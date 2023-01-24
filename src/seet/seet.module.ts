import { Module } from '@nestjs/common';
import { SeetService } from './seet.service';
import { SeetController } from './seet.controller';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeetController],
  providers: [SeetService],
  imports: [ProductsModule, AuthModule],
})
export class SeetModule {}
