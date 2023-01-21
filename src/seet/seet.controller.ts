import { Controller, Get } from '@nestjs/common';
import { SeetService } from './seet.service';

@Controller('seed')
export class SeetController {
  constructor(private readonly seetService: SeetService) {}

  @Get()
  executeSeet() {
    return this.seetService.runSeed();
  }
}
