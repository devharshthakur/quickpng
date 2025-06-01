import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { SvgValidationPipe } from './pipes/svg-validation.pipe';
import { memoryStorage } from 'multer';
import { FILE_CONSTRAINTS } from '../conversion/constants/values.constants';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: FILE_CONSTRAINTS.MAX_FILE_SIZE,
      },
    }),
    DbModule,
  ],
  providers: [UploadService, SvgValidationPipe],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
