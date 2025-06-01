import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversionModule } from './conversion/conversion.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './upload/upload.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConversionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
