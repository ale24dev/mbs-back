import { Controller } from "@nestjs/common";

import { StatsTableService } from "./stats_table.service";

@Controller("stats_table")
export class StatsTableController{

    constructor(private readonly _statsTableService: StatsTableService){}
}