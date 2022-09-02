import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { ImageModule } from 'src/modules/images/image.module';
import { TeamModule } from 'src/modules/team/team/team.module';
import { PlayerModule } from 'src/modules/player/player.module';
import { MatchModule } from 'src/modules/matchGame/match/match.module';
import { RosterModule } from 'src/modules/team/roster/roster.module';
import { typeOrmConfig } from 'src/database/typeOrmConfig/typeorm.config';
import { StatsTableModule } from 'src/modules/stats_table/stats_table.module';
import { TeamMatchModule } from 'src/modules/team/team_match/team_match.module';
import { SocialMediaModule } from 'src/modules/social_media/social_media.module';
import { MatchStatsModule } from 'src/modules/matchGame/match_stats/match_stats.module';
import { TournamentModule } from 'src/modules/tournament/tournament/tournament.module';
import { TeamTournamentModule } from 'src/modules/tournament/team_tournament/team_tournament.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    /*ServeStaticModule.forRoot({
      //renderPath: "public",
      rootPath: join(__dirname, '..', 'public'),
     // exclude: ["/api*"],
  }),*/
    TeamModule,
    AuthModule,
    UserModule,
    MatchModule,
    ImageModule,
    PlayerModule,
    RosterModule,
    TeamMatchModule,
    StatsTableModule,
    MatchStatsModule,
    TournamentModule,
    SocialMediaModule,
    TeamTournamentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
