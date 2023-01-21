import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DatabasesModule } from './databases/databases.module';
import { EnvConfiguration, JoiValidationSchema } from './configuration';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeetModule } from './seet/seet.module';
import { FilesModule } from './files/files.module';
// aabf08b9-0f49-40be-8f20-bfee1b102b3d
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public '),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    DatabasesModule,
    ProductsModule,
    CommonModule,
    SeetModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
