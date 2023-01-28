import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeetService } from './seet.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@ApiTags('Seed')
@Controller('seed')
export class SeetController {
  constructor(private readonly seetService: SeetService) {}

  @Get()
  @Auth(ValidRoles.admin)
  executeSeet() {
    return this.seetService.runSeed();
  }
}
