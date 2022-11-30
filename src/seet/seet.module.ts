import { Module } from '@nestjs/common';
import { SeetService } from './seet.service';
import { SeetController } from './seet.controller';

@Module({
  controllers: [SeetController],
  providers: [SeetService]
})
export class SeetModule {}
