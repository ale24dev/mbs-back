import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { RosterEntity } from "../roster/roster.entity";
import { SocialMediaEntity } from "../../social_media/social_media.entity";
import { MatchStatsEntity } from "../../matchGame/match_stats/entities/match_stats.entity";
import { TeamTournamentEntity } from "../../tournament/team_tournament/team_tournament.entity";

@Entity({ name: 'team' })
export class TeamEntity {

  @PrimaryGeneratedColumn()
  idTeam: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  captain: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: false })
  equipationColor: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  headerImage: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  town: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany((type)=> SocialMediaEntity, (socialMedia)=> socialMedia.idSocialMedia)
  social_media: SocialMediaEntity[];

  @OneToMany((type)=> RosterEntity, (roster)=> roster.idRoster)
  roster: RosterEntity[];

  @OneToMany((type)=> TeamTournamentEntity, (teamTournament)=> teamTournament.idTeamTournament)
  team_tournament: TeamTournamentEntity[];

  @OneToMany((type)=> MatchStatsEntity, (match_stats)=> match_stats.idMatchStats)
  match_stats: MatchStatsEntity[];
}