import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { SocialMediaDto } from './dto/social_media.dto';
import { SocialMediaEntity } from './social_media.entity';
import { TeamRepository } from '../team/team/team.repository';


@EntityRepository(SocialMediaEntity)
export class SocialMediaRepository extends Repository<SocialMediaEntity> {

    async getAllSocialMedia() {
        const allSocialMedia = await this.find();

        return allSocialMedia;
    }

    async getSocialMediaById(idSocialMedia: number) {
        const socialMedia = await this.findOne({ idSocialMedia });
        if (socialMedia) return socialMedia;
        throw new NotFoundException(`No se encontró una red social con id ${idSocialMedia}`);
        ;
    }

    async getSocialMediaByTeam(idTeam: number) {
        const socialMedia = await this
            .createQueryBuilder('social_media')
            .leftJoinAndSelect('social_media.team', 'team')
            .where('social_media.team.idTeam = :idTeam', { idTeam: idTeam })
            .getMany();

        return socialMedia;
    }

    async createSocialMediaToTeam(idTeam: number, socialMediaDto: SocialMediaDto, _teamRepository: TeamRepository) {
        const { name, link } = socialMediaDto;

        const team = await _teamRepository.getTeamById(idTeam);
        const socialMedia = new SocialMediaEntity();
        socialMedia.name = name;
        socialMedia.link = link;
        socialMedia.team = team;
        const socialM = await this.save(socialMedia);
        return socialM;

    }

    async updateSocialMedia(idSocialMedia: number, socialMediaDto: SocialMediaDto) {
        const { name, link } = socialMediaDto;

        const socialMedia = await this.getSocialMediaById(
            idSocialMedia,
        );
        const socialMediaUpdated = this.merge(socialMedia, socialMediaDto);

        const socialM = await this.save(socialMediaUpdated);
        return socialM;
    }

    async deletSocialMedia(idSocialMedia: number) {
        const socialMedia = await this.getSocialMediaById(
            idSocialMedia
        );

        const result = await this.delete(idSocialMedia);
        return Promise.resolve({
            result: result,
            status: 'success',
        });
    }
}
