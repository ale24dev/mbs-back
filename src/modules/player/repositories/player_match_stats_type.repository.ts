import { MatchStatsDto } from 'src/modules/matchGame/match_stats/dto/match_stats.dto';
import { Repository, EntityRepository } from 'typeorm';
import { PlayerMatchStatsTypeEntity } from '../entities/player_match_stats_type.entity';


@EntityRepository(PlayerMatchStatsTypeEntity)
export class PlayerMatchStatsTypeRepository extends Repository<PlayerMatchStatsTypeEntity> {
    async getPlayerMatchStatsType(idMatchStats: number, matchStatDto: MatchStatsDto) {
        const playerMatchStatsType = await this
            .createQueryBuilder("player_matchStats_type")
            .leftJoin('player_match_stats_type.match_stats', 'match_stats')
            .leftJoin('player_match_stats_type.statistics_type', 'statistics_type')
            .where('match_stats.idMatchStats = :idMatchStats=:idMatchStats', { idMatchStats: idMatchStats })
            .andWhere('statistics_type.statsType = :statsType=:statsType', { statsType: matchStatDto.statsType })
            .getOne();

        return playerMatchStatsType;
    }
}