import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TeamEntity } from '../team/team.entity';
import { PlayerEntity } from 'src/modules/player/entities/player.entity';
import { TournamentEntity } from 'src/modules/tournament/tournament/tournament.entity';

@Entity({ name: 'roster' })
export class RosterEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRoster: number;

  @Column({ default: true })
  player_active: boolean;

  @ManyToOne((type) => PlayerEntity, (player) => player.idPlayer)
  player: PlayerEntity;

  @ManyToOne((type) => TeamEntity, (team) => team.idTeam)
  team: TeamEntity;

  @ManyToOne((type) => TournamentEntity, (tournament) => tournament)
  tournament: TournamentEntity;
}
