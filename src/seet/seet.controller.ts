import { Controller, Get } from '@nestjs/common';
import { SeetService } from './seet.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Controller('seed')
export class SeetController {
  constructor(private readonly seetService: SeetService) {}

  @Get()
  @Auth(ValidRoles.admin)
  executeSeet() {
    return this.seetService.runSeed();
  }
}
