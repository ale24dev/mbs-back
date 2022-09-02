import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { TournamentDto } from './dto/tournament.dto';
import { TournamentEntity } from './tournament.entity';
import { TournamentService } from './tournament.service';
import { BaseService } from 'src/common/service/base.service';
import { editFileName, imageFileFilter } from 'src/utils/file.upload';
import { BaseController } from 'src/common/controller/base.controller';

@Controller('api/tournament')
export class TournamentController extends BaseController<TournamentEntity>{
  getService(): BaseService<TournamentEntity> {
    return this._tournamentService;
  }
  constructor(private readonly _tournamentService: TournamentService) { super(); }

  /**
   * Obtener los torneos que no han finalizado.
   */
  @Get("not-finalized")
  async getTournamentsNotFinalized() {
    return await this._tournamentService.getTournamentsNotFinalized();
  }
  /**
   * Crear un nuevo torneo.
   */
  @Post("save")
  async createTournament(@Body() tournamentDto: TournamentDto) {
    return await this._tournamentService.createTournament(tournamentDto);
  }

  /**
   * Inserta una imagen en el torneo.
   */
  @Post('/:idTournament/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageToTournament(
    @Param('idTournament') idTournament: number,
    @UploadedFile() file: any,
  ): Promise<any> {
    return await this._tournamentService.uploadImageToTournament(idTournament, file);
  }

  /**
   * Añade un equipo a un torneo.
   * 
   */
  @Post('add_team')
  async addTeamToTournament(
    @Query('team') idTeam: number,
    @Query('tournament') idTournament: number,
  ) {
    return await this._tournamentService.addTeamToTournament(
      idTeam,
      idTournament
    );
  }

  /**
   * Actualiza un torneo.
   */
  @Patch('update')
  async updateTournament(
    @Query('tournament', ParseIntPipe) idTournament: number,
    @Body() tournamentDto: TournamentDto,
  ) {
    return await this._tournamentService.updateTournament(
      idTournament,
      tournamentDto,
    );
  }

  /**
   * Finaliza un torneo activo.
   */
  @Delete('finish')
  async finishTournament(@Query('tournament', ParseIntPipe) idTournament: number) {
    return this._tournamentService.finishTournament(idTournament);
  }
}
