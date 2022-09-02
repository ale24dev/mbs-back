import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { MatchDto } from './dto/match.dto';
import { ResultMatchDto } from './dto/result.match.dto';
import { MatchEntity, MatchState } from './match.entity';
import { TeamRepository } from 'src/modules/team/team/team.repository';
import { MatchStatsEntity } from '../match_stats/entities/match_stats.entity';
import { TeamMatchEntity } from 'src/modules/team/team_match/team_match.entity';
import { StatsTableRepository } from 'src/modules/stats_table/stats_table.repository';
import { TeamMatchRepository } from 'src/modules/team/team_match/team_match.repository';
import { MatchStatsRepository } from '../match_stats/repository/match_stats.repository';
import { TournamentRepository } from 'src/modules/tournament/tournament/tournament.repository';
import { TeamTournamentRepository } from 'src/modules/tournament/team_tournament/team_tournament.repository';

@EntityRepository(MatchEntity)
export class MatchRepository extends Repository<MatchEntity> {

    async getMatchById(idMatch: number) {
        const match = await this.findOne(idMatch);

        if (!match) throw new NotFoundException(`No se encontró un partido con id: ${idMatch}`);

        return match;
    }

    async getMatchsByTournament(idTournament: number) {
        const match = await this
            .createQueryBuilder("match")
            .leftJoin("match.tournament", "tournament")
            .where("tournament.idTournament = :idTournament", { idTournament: idTournament })
            .getMany();

        if (!match) throw new NotFoundException(`No se encontraron partidos en el torneo con id: ${idTournament}`);

        return match;
    }
    async getMatchsByTournamentAndRound(idTournament: number, round: number) {
        const match = await this
            .createQueryBuilder("match")
            .leftJoin("match.tournament", "tournament")
            .where("tournament.idTournament = :idTournament", { idTournament: idTournament })
            .andWhere("round = :round", { round: round })
            .getMany();
        if (match.length == 0)
            throw new NotFoundException(`No se encontraron partidos en la ronda: ${round} del torneo con id: ${idTournament}`);
            
        return match;
    }

    async create_match(idHomeTeam: number, idAwayTeam: number, idTournament: number, matchDto: MatchDto, _teamRepository: TeamRepository, _tournamentRepository: TournamentRepository, _teamTournamentRepository: TeamTournamentRepository, _teamMatchRepository: TeamMatchRepository, _matchStatsRepository: MatchStatsRepository) {
        const { referee, round, timestamp } = matchDto;
        if (idHomeTeam == idAwayTeam) throw new ConflictException("No se puede crear un partido contra el mismo equipo");
        const tournament = await _tournamentRepository.getTournamentById(idTournament);

        //**Verificar la existencia de ambos equipos */
        const homeTeam = await _teamRepository.getTeamById(idHomeTeam);
        const awayTeam = await _teamRepository.getTeamById(idAwayTeam);

        //**Verificar si el HomeTeam pertence al torneo */
        await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            idHomeTeam,
            idTournament,
        );

        //**Verificar si el AwayTeam pertence al torneo */
        await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            idAwayTeam,
            idTournament,
        );

        if (referee) {
            const match = new MatchEntity();

            match.round = round;
            match.referee = referee;
            match.timestamp = timestamp
            match.tournament = tournament;

            const matchRes = await this.save(match);

            //*Se guarda el partido del HomeTeam
            const homeTeamMatch = new TeamMatchEntity();
            homeTeamMatch.match = matchRes;
            homeTeamMatch.team = homeTeam;
            await _teamMatchRepository.save(homeTeamMatch);

            //*Guardo el partido del AwayTeam
            const awayTeamMatch = new TeamMatchEntity();
            awayTeamMatch.match = matchRes;
            awayTeamMatch.team = awayTeam;
            await _teamMatchRepository.save(awayTeamMatch);

            //*Creando las estadísticas de ambos equipos en el partido.   
            await _matchStatsRepository.createStatsOfMatch(matchRes.idMatch, idHomeTeam, _teamRepository, this);
            await _matchStatsRepository.createStatsOfMatch(matchRes.idMatch, idAwayTeam, _teamRepository, this);
            return matchRes;
        } else throw new NotFoundException("Los campos date y referee son obligatorios");
    }

    async updateMatch(idMatch: number, matchDto: MatchDto) {
        const match = await this.getMatchById(idMatch);

        const matchUpdated = await this.save(await this.merge(match, matchDto));

        return matchUpdated;
    }

    async closeMatch(idMatch: number, resultMatchDto: ResultMatchDto, _teamMatchRepository: TeamMatchRepository, _matchStatsRepository: MatchStatsRepository, _teamRepository: TeamRepository, _tournamentRepository: TournamentRepository, _statsTableRepository: StatsTableRepository, _teamTournamentRepository, _matchRepository: MatchRepository) {
        const match = await this.getMatchById(idMatch);

        if (match.state == MatchState.FT) throw new ConflictException("El partido ya concluyó");

        match.state = resultMatchDto.state;
        match.save();

        const listTeamMatch = await _teamMatchRepository.getTeamsByMatch(
            idMatch
        );

        const matchStatsHomeTeam = await _matchStatsRepository.getStatsByMatchAndTeam(
            listTeamMatch[0].match.idMatch,
            listTeamMatch[0].team.idTeam,
            this
        );
        const matchStatsAwayTeam = await _matchStatsRepository.getStatsByMatchAndTeam(
            listTeamMatch[1].match.idMatch,
            listTeamMatch[1].team.idTeam,
            this,
        );

        switch (resultMatchDto.state) {
            //**En caso de haber FORFEIT, buscamos cual de los 2 equipos fue el ganador */
            case MatchState.FF:
                const team = await _teamRepository.getTeamById(resultMatchDto.winner);
                if (listTeamMatch[0].team.idTeam == team.idTeam) {
                    listTeamMatch[0].winner = true;
                    listTeamMatch[1].winner = false;
                } else {
                    listTeamMatch[0].winner = false;
                    listTeamMatch[1].winner = true;
                }
                await this.setStatsTableWithFouldField(matchStatsHomeTeam,
                    matchStatsAwayTeam,
                    match.tournament.idTournament,
                    listTeamMatch,
                    _teamRepository,
                    _tournamentRepository,
                    _statsTableRepository,
                    _teamTournamentRepository,
                    _matchStatsRepository)
                break;
            case MatchState.FT:
                const winnerPosition = this.getWinnerInMatch(resultMatchDto);
                console.log(winnerPosition);
                if (winnerPosition == 0) {
                    listTeamMatch[0].winner = true;
                    listTeamMatch[1].winner = false;
                }
                else if (winnerPosition == 1) {
                    listTeamMatch[0].winner = false;
                    listTeamMatch[1].winner = true;
                } else if (winnerPosition == 2) {
                    listTeamMatch[0].winner = false;
                    listTeamMatch[1].winner = false;
                }
                await this.setStatsTable(matchStatsHomeTeam, matchStatsAwayTeam, match.tournament.idTournament, resultMatchDto, _teamRepository, _tournamentRepository, _statsTableRepository, _teamTournamentRepository, _matchStatsRepository);

                break;
        }
        await _teamMatchRepository.save(listTeamMatch[0]);
        await _teamMatchRepository.save(listTeamMatch[1]);

        return match;
    }

    async setStatsTable(
        matchStatsHomeTeam: MatchStatsEntity,
        matchStatsAwayTeam: MatchStatsEntity,
        idTournament: number,
        resultMatchDto: ResultMatchDto,
        _teamRepository: TeamRepository,
        _tournamentRepository: TournamentRepository,
        _statsTableRepository: StatsTableRepository,
        _teamTournamentRepository: TeamTournamentRepository,
        _matchStatsRepository: MatchStatsRepository
    ) {
        const teamTournamentHomeTeam = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            matchStatsHomeTeam.team.idTeam,
            idTournament,
        );
        const teamTournamentAwayTeam = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            matchStatsAwayTeam.team.idTeam,
            idTournament
        );

        const statsTableHomeTeam = await _statsTableRepository.findOne(
            teamTournamentHomeTeam.stats_table.idStatsTable,
        );
        const statsTableAwayTeam = await _statsTableRepository.findOne(
            teamTournamentAwayTeam.stats_table.idStatsTable,
        );
        const winnerInMatch = this.getWinnerInMatch(resultMatchDto);

        //*Obtenemos los goles de ambos equipos en el partido
        const goalsTeamMatchHome = await _matchStatsRepository.getGoalsByMatchAndTeam(matchStatsHomeTeam.match.idMatch, matchStatsHomeTeam.team.idTeam);
        const goalsTeamMatchAway = await _matchStatsRepository.getGoalsByMatchAndTeam(matchStatsAwayTeam.match.idMatch, matchStatsAwayTeam.team.idTeam);

        if (winnerInMatch == 0) {
            statsTableHomeTeam.pj++;
            statsTableHomeTeam.pg++;
            statsTableHomeTeam.pts += 3;
            statsTableHomeTeam.gf += goalsTeamMatchHome;
            statsTableHomeTeam.gc += goalsTeamMatchAway;
            statsTableHomeTeam.dg = statsTableHomeTeam.gf - statsTableHomeTeam.gc;

            statsTableAwayTeam.pj++;
            statsTableAwayTeam.pp++;
            statsTableAwayTeam.gf += goalsTeamMatchAway;
            statsTableAwayTeam.gc += goalsTeamMatchHome;
            statsTableAwayTeam.dg = statsTableAwayTeam.gf - statsTableAwayTeam.gc;

        } else if (winnerInMatch == 1) {
            statsTableHomeTeam.pj++;
            statsTableHomeTeam.pp++;
            statsTableHomeTeam.gf += goalsTeamMatchHome;
            statsTableHomeTeam.gc += goalsTeamMatchAway;
            statsTableHomeTeam.dg = statsTableHomeTeam.gf - statsTableHomeTeam.gc;

            statsTableAwayTeam.pj++;
            statsTableAwayTeam.pg++;
            statsTableAwayTeam.pts += 3;
            statsTableAwayTeam.gf += goalsTeamMatchAway;
            statsTableAwayTeam.gc += goalsTeamMatchHome;
            statsTableAwayTeam.dg = statsTableAwayTeam.gf - statsTableAwayTeam.gc;
        } else if (winnerInMatch == 2) {
            statsTableHomeTeam.pj++;
            statsTableHomeTeam.pe++;
            statsTableHomeTeam.pts++;
            statsTableHomeTeam.gf += goalsTeamMatchHome;
            statsTableHomeTeam.gc += goalsTeamMatchAway;
            statsTableHomeTeam.dg = statsTableHomeTeam.gf - statsTableHomeTeam.gc;

            statsTableAwayTeam.pj++;
            statsTableAwayTeam.pe++;
            statsTableAwayTeam.pts++;
            statsTableAwayTeam.gf += goalsTeamMatchAway;
            statsTableAwayTeam.gc += goalsTeamMatchHome;
            statsTableAwayTeam.dg = statsTableAwayTeam.gf - statsTableAwayTeam.gc;

        }
        await _statsTableRepository.save(statsTableHomeTeam);
        await _statsTableRepository.save(statsTableAwayTeam);
    }
    async setStatsTableWithFouldField(
        matchStatsHomeTeam: MatchStatsEntity,
        matchStatsAwayTeam: MatchStatsEntity,
        idTournament: number,
        listTeamMatch: TeamMatchEntity[],
        _teamRepository: TeamRepository,
        _tournamentRepository: TournamentRepository,
        _statsTableRepository: StatsTableRepository,
        _teamTournamentRepository: TeamTournamentRepository,
        _matchStatsRepository: MatchStatsRepository
    ) {
        const teamTournamentHomeTeam = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            matchStatsHomeTeam.team.idTeam,
            idTournament,
        );
        const teamTournamentAwayTeam = await _teamTournamentRepository.getTeamTournamentByTeamAndTournament(
            matchStatsAwayTeam.team.idTeam,
            idTournament,
        );
        const statsTableHomeTeam = await _statsTableRepository.findOne(
            teamTournamentHomeTeam.stats_table.idStatsTable
        );
        const statsTableAwayTeam = await _statsTableRepository.findOne(
            teamTournamentAwayTeam.stats_table.idStatsTable,
        );

        //*Verificar cual de los 2 equipos dio el FouldField y luego le asignamos el footballStatistics creado anteriormente
        if (listTeamMatch[0].winner == true && listTeamMatch[0].team.idTeam == matchStatsHomeTeam.team.idTeam) {

            statsTableHomeTeam.pj++;
            statsTableHomeTeam.pp--;
            statsTableHomeTeam.gc += 3;
            statsTableHomeTeam.dg = statsTableHomeTeam.gf - statsTableHomeTeam.gc;

            statsTableAwayTeam.pj++;
            statsTableAwayTeam.pg++;
            statsTableAwayTeam.pts += 3;
            statsTableAwayTeam.gf += 3;
            statsTableAwayTeam.dg = statsTableAwayTeam.gf - statsTableAwayTeam.gc;

            await _statsTableRepository.save(statsTableHomeTeam);
            await _statsTableRepository.save(statsTableAwayTeam);
        } else {
            statsTableAwayTeam.pj++;
            statsTableAwayTeam.pp--;
            statsTableAwayTeam.gc += 3;
            statsTableAwayTeam.dg = statsTableHomeTeam.gf - statsTableHomeTeam.gc;

            statsTableHomeTeam.pj++;
            statsTableHomeTeam.pg++;
            statsTableHomeTeam.pts += 3;
            statsTableHomeTeam.gf += 3;
            statsTableHomeTeam.dg = statsTableAwayTeam.gf - statsTableAwayTeam.gc;

            await _statsTableRepository.save(statsTableHomeTeam);
            await _statsTableRepository.save(statsTableAwayTeam);

        }
    }

    async deletMatch(idMatch: number) {
        const match = await this.getMatchById(idMatch);
        if (match) {
            const result = await this.delete(idMatch);
            return Promise.resolve({
                result: result,
                status: 'success',
            });
        }
    }

    getWinnerInMatch(resultMatchDto: ResultMatchDto) {
        const { awayTeamGoals, homeTeamGoals, state } = resultMatchDto;

        if (state == MatchState.PST) {
            return -1;
        }
        if (homeTeamGoals > awayTeamGoals) {
            return 0;
        }
        if (awayTeamGoals > homeTeamGoals)
            return 1;
        if (homeTeamGoals == awayTeamGoals)
            return 2;
    }
}


