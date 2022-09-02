import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocialMediaService } from './social_media.service';
import { TeamRepository } from '../team/team/team.repository';
import { SocialMediaRepository } from './social_media.repository';
import { SocialMediaController } from './social_media.controller';


@Module({
  imports: [TypeOrmModule.forFeature([SocialMediaRepository, TeamRepository])],
  controllers: [SocialMediaController],
  providers: [SocialMediaService],
  exports: [SocialMediaService],
})
export class SocialMediaModule {}
