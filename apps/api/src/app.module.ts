import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversionModule } from './conversion/conversion.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './upload/upload.module';
import { DbModule } from './db/db.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConversionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
    DbModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads', 'images'),
      serveRoot: '/uploads/images',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
