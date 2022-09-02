import { Repository, EntityRepository } from 'typeorm';

import { PlayerStatsTypeEntity } from './player_stats_type.entity';
import { PlayerStatsEntity } from '../entities/player_stats.entity';
import { StatisticsTypeEntity, StatsType } from 'src/modules/statistics/statistics_type/statisticts_type.entity';
import { PlayerStatsDto } from '../dto/player_stats.dto';
import { StatisticsTypeRepository } from 'src/modules/statistics/statistics_type/statistics_type.repository';

@EntityRepository(PlayerStatsTypeEntity)
export class PlayerStatsTypeRepository extends Repository<PlayerStatsTypeEntity> {

    /**
     * Devuelve una lista con el ranking de jugadores de una estadística dada.
     */
    async getRankingPlayersByStatsType(listPlayerStatsEntity: PlayerStatsEntity[], statsType: StatsType, statisticsTypeRepository: StatisticsTypeRepository) {

        const statisticsType = await statisticsTypeRepository.getStatisticByType(statsType);
        const listPlayerStatsDto = await this.getListPlayerStatsDto(listPlayerStatsEntity, statisticsType);

        return this.sortPlayerStatsByStatsType(listPlayerStatsDto, statisticsType);
    }
    /**
     * Función que obtiene la lista de jugadores con la cantidad de valores de la estadística correspondiente.
     * 
     * La estadística puede ser goles, asistencias, tarjetas amarillas, doble amarilla o tarjeta roja.
     */
    async getListPlayerStatsDto(listPlayerStatsEntity: PlayerStatsEntity[], statisticsType: StatisticsTypeEntity): Promise<PlayerStatsDto[]> {
        let playerStatsDto: PlayerStatsDto
        var listPlayerStatsDto: PlayerStatsDto[] = [];

        for await (const playerStats of listPlayerStatsEntity) {
            playerStatsDto = new PlayerStatsDto();
            const ranking = await this.findAndCount({ where: { playerStats: playerStats, statisticsType: statisticsType } });
            switch (statisticsType.statsType) {
                case StatsType.GOAL:
                    playerStatsDto.playerStats = playerStats;
                    playerStatsDto.goals = ranking[1];
                    break;
                case StatsType.ASSISTS:
                    playerStatsDto.playerStats = playerStats;
                    playerStatsDto.assists = ranking[1];
                    break;
                case StatsType.YELLOW_CARD:
                    playerStatsDto.playerStats = playerStats;
                    playerStatsDto.yellowCard = ranking[1];
                    break;
                case StatsType.YELLOWRED_CARD:
                    playerStatsDto.playerStats = playerStats;
                    playerStatsDto.yellowRedCard = ranking[1];
                    break;
                case StatsType.RED_CARD:
                    playerStatsDto.playerStats = playerStats;
                    playerStatsDto.redCard = ranking[1];
                    break;
            }
            listPlayerStatsDto.push(playerStatsDto);
            console.log(listPlayerStatsDto);
        }
        return listPlayerStatsDto;
    }

    /** 
     * Método para ordenar la lista de estadísticas de los jugadores en un torneo a partir de una estadística determinada.
     *
     * @param listPlayerStatsDto Listado de estadisticas de jugadores desordenada.
     * @param statisticsType Estadistica por la cual realizar el ordenamiento.
    */
    sortPlayerStatsByStatsType(listPlayerStatsDto: PlayerStatsDto[], statisticsType: StatisticsTypeEntity): PlayerStatsDto[] {
        let listPlayerStatsSorted: PlayerStatsDto[];
        switch (statisticsType.statsType) {
            case StatsType.GOAL:
                listPlayerStatsSorted = listPlayerStatsDto.sort((a, b) => (a.goals > b.goals) ? -1 : 1);
                break;
            case StatsType.ASSISTS:
                listPlayerStatsSorted = listPlayerStatsDto.sort((a, b) => (a.assists > b.assists) ? -1 : 1);
                break;
            case StatsType.YELLOW_CARD:
                listPlayerStatsSorted = listPlayerStatsDto.sort((a, b) => (a.yellowCard > b.yellowCard) ? -1 : 1);
                break;
            case StatsType.YELLOWRED_CARD:
                listPlayerStatsSorted = listPlayerStatsDto.sort((a, b) => (a.yellowRedCard > b.yellowRedCard) ? -1 : 1);
                break;
            case StatsType.RED_CARD:
                listPlayerStatsSorted = listPlayerStatsDto.sort((a, b) => (a.redCard > b.redCard) ? -1 : 1);
                break;

            default:
                break;
        }
        return listPlayerStatsSorted;
    }
}
