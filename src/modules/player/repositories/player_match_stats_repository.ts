import { Repository, EntityRepository } from 'typeorm';
import { PlayerMatchStatsEntity } from '../entities/player_match_stats.entity';


@EntityRepository(PlayerMatchStatsEntity)
export class PlayerMatchStatsRepository extends Repository<PlayerMatchStatsEntity> {
 
}