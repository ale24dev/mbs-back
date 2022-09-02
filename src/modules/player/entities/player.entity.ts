import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { PlayerStatsEntity } from "./player_stats.entity";
import { RosterEntity } from "src/modules/team/roster/roster.entity";
import { TeamTournamentEntity } from "src/modules/tournament/team_tournament/team_tournament.entity";

export enum PlayerPosition {
  ALA = "Ala",
  CIERRE = "Cierre",
  PIVOT = "Pivot",
  PORTERO = "Portero",
}

@Entity({ name: 'player' })
@Unique(['ci'])
export class PlayerEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  idPlayer: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  height: number;

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: true, default: "no phone" })
  phone: string;

  @Column({ nullable: true, default: "no profession" })
  profession: string;

  @Column({ nullable: false, unique: true })
  ci: string;

  @Column({ nullable: true, default: "no image" })
  image: string;

  @Column({ nullable: true, default: "no image" })
  image_face: string;

  @Column({
    type: 'enum',
    enum: PlayerPosition,
  })
  position: PlayerPosition;

  @Column({ default: true })
  active: boolean

  @OneToMany((type) => RosterEntity, (roster) => roster.idRoster)
  roster: RosterEntity[];

  @OneToMany((type) => PlayerStatsEntity, (player_stats) => player_stats.idPlayerStats)
  player_stats: PlayerStatsEntity[];

  @OneToMany((type) => TeamTournamentEntity, (teamTournament) => teamTournament.idTeamTournament)
  teamTournament: TeamTournamentEntity[];


}