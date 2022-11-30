import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabasesModule } from './databases/databases.module';
import { EnvConfiguration, JoiValidationSchema } from './configuration';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeetModule } from './seet/seet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    DatabasesModule,
    ProductsModule,
    CommonModule,
    SeetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
