import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { SavedFileInfoType } from '../upload/upload.service';
import { prisma } from '@workspace/db';
import { UploadStatus } from '@workspace/db';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger:Logger) {}
  async onModuleInit() {
    await prisma.$connect();
    this.logger.log("Database connected sucessfully")
  }

  async onModuleDestroy() {
    this.logger.log("Database disconnected sucessfully")
    await prisma.$disconnect();
  }

  async addFileInfo(fileInfo: SavedFileInfoType) {
    return prisma.uploadedFileInfo.create({
      data: {
        originalName: fileInfo.originalname,
        fileName: fileInfo.filename,
        path: fileInfo.path,
        mimeType: fileInfo.mimetype,
        size: fileInfo.size,
        status: UploadStatus.UPLOADED,
      },
    });
  }
}
