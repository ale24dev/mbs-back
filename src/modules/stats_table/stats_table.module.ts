import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsTableService } from './stats_table.service';
import { StatsTableRepository } from './stats_table.repository';
import { StatsTableController } from './stats_table.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatsTableRepository])],
  controllers: [StatsTableController],
  providers: [StatsTableService],
  exports: [StatsTableService],
})
export class StatsTableModule {}
