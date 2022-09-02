import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { SocialMediaDto } from './dto/social_media.dto';
import { SocialMediaService } from './social_media.service';

@Controller('social_media')
export class SocialMediaController {
  constructor(private readonly _socialMediaService: SocialMediaService) { }

  @Get()
  async getAllSocialMedia() {
    return await this._socialMediaService.getAllSocialMedia();
  }

  @Get('/:idSocialMedia')
  async getSocialMediaById(@Param("idSocialMedia", ParseIntPipe) idSocialMedia: number) {
    return await this._socialMediaService.getSocialMediaById(idSocialMedia);
  }

  @Get('/team/:idTeam')
  async getSocialMediaByTeam(@Param('idTeam', ParseIntPipe) idTeam: number) {
    return await this._socialMediaService.getSocialMediaByTeam(idTeam);
  }

  @Post()
  async createSocialMediaToTeam(
    @Body() socialMedia: SocialMediaDto,
    @Body('idTeam', ParseIntPipe) idTeam: number,
  ) {
    return await this._socialMediaService.createSocialMediaToTeam(
      idTeam,
      socialMedia
    );
  }

  @Patch('/:idSocialMedia')
  async updateTeam(
    @Param('idSocialMedia', ParseIntPipe) idSocialMedia: number,
    @Body() socialMedia: SocialMediaDto,
  ) {
    return await this._socialMediaService.updateSocialMedia(
      idSocialMedia,
      socialMedia,
    );
  }

  @Delete("/:idSocialMedia")
  async deleteTeam(
    @Param("idSocialMedia", ParseIntPipe) idSocialMedia: number
  ) {
    return await this._socialMediaService.deleteSocialMedia(idSocialMedia);
  }
}
