import { BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MatchEntity } from "../../match/match.entity";
import { TeamEntity } from "src/modules/team/team/team.entity";
import { MatchStatsTypeEntity } from "../../match_stats_type/match_stats_type.entity";

@Entity({ name: 'match_stats' })
export class MatchStatsEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  idMatchStats: number;

  @ManyToOne((type) => MatchEntity, (match) => match.idMatch, { eager: true })
  match: MatchEntity;

  @ManyToOne((type) => TeamEntity, (team) => team.idTeam, { eager: true })
  team: TeamEntity;

  @OneToMany((type) => MatchStatsTypeEntity, (matchStatsType) => matchStatsType.idMatchStatsType, { eager: true })
  matchStatsType: MatchStatsTypeEntity[];
}