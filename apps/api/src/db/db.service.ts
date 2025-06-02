import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { SavedFileInfoType } from '../upload/upload.service';
import { prisma } from '@workspace/db';
import { UploadStatus } from '@workspace/db';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: Logger) {}
  async onModuleInit() {
    await prisma.$connect();
    this.logger.log('Database connected sucessfully');
  }

  async onModuleDestroy() {
    this.logger.log('Database disconnected sucessfully');
    await prisma.$disconnect();
  }

  /**
   * Adds file information to the database
   * @param fileInfo - The file information to be stored in the database
   * @returns {Promise<UploadedFileInfo>} A promise that resolves with the created file information record
   * @throws {Error} If the database operation fails
   */
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

  /**
   * Updates the status of a file from UPLOADED to CONVERTED in the database
   * @param fileName - The name of the file to update
   * @throws {Error} If the update operation fails
   */
  async updateFileStatus(fileName: string) {
    try {
      await prisma.uploadedFileInfo.update({
        where: {
          fileName: fileName,
        },
        data: {
          status: UploadStatus.CONVERTED,
        },
      });
      this.logger.log(`File status updated to CONVERTED for file: ${fileName}`);
    } catch (error) {
      this.logger.error(`Failed to update file status for ${fileName}:`, error);
      throw error;
    }
  }
}
