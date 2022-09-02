import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SocialMediaDto } from './dto/social_media.dto';
import { TeamRepository } from '../team/team/team.repository';
import { SocialMediaRepository } from './social_media.repository';

@Injectable()
export class SocialMediaService {
  @InjectRepository(SocialMediaRepository)
  private readonly _socialMediaRepository: SocialMediaRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  async getAllSocialMedia() {
    return await this._socialMediaRepository.getAllSocialMedia();
  }

  async getSocialMediaById(idSocialMedia: number) {
    return await this._socialMediaRepository.getSocialMediaById(idSocialMedia);
  }

  async getSocialMediaByTeam(idTeam: number) {
    return await this._socialMediaRepository.getSocialMediaByTeam(idTeam);
  }

  async createSocialMediaToTeam(
    idTeam: number,
    socialMediaDto: SocialMediaDto,
  ) {
    return await this._socialMediaRepository.createSocialMediaToTeam(idTeam, socialMediaDto, this._teamRepository);
  }

  async updateSocialMedia(
    idSocialMedia: number,
    socialMediaDto: SocialMediaDto,
  ) {
    return await this._socialMediaRepository.updateSocialMedia(idSocialMedia, socialMediaDto);
  }

  async deleteSocialMedia(idSocialMedia: number) {
    return await this._socialMediaRepository.deletSocialMedia(idSocialMedia);
  }
}
