import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, promises } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadFileType {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface SavedFileInfoType {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadService {
  private readonly uploadPath: string = join(__dirname, '..', '..', 'uploads');
  private logger = new Logger();
  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!existsSync(this.uploadPath)) {
      try {
        mkdirSync(this.uploadPath, { recursive: true });
        this.logger.log(`Created Upload Directory at ${this.uploadPath}`);
      } catch (error) {
        this.logger.debug(`Error creating upload directory error: ${error}`);
      }
    }
  }

  private generateUniqueFilename(originalname: string): string {
    const parsedPath = {
      name: originalname.substring(0, originalname.lastIndexOf('.')) || originalname,
      ext: originalname.substring(originalname.lastIndexOf('.')),
    };
    const sanitizedOriginalName = parsedPath.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueSuffix = uuidv4().split('-')[0];
    return `${sanitizedOriginalName}-${uniqueSuffix}${parsedPath.ext}`;
  }

  async saveFile(file: UploadFileType): Promise<SavedFileInfoType> {
    const filename = this.generateUniqueFilename(file.originalname);
    const filePath = join(this.uploadPath, filename);
    try {
      await promises.writeFile(filePath, file.buffer);
      this.logger.log(
        `SVG file saved - Original name: ${file.originalname}, Size: ${file.size} bytes, Type: ${file.mimetype}, Saved path: ${filePath}`,
      );
      return {
        filename,
        originalname: file.originalname,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      this.logger.error(`Error saving file ${file.originalname}:`, error);
      throw new BadRequestException('Failed to save file');
    }
  }

  async cleanUpFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        await promises.unlink(filePath);
        this.logger.log(`Cleaned up file at: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error cleaning up file at ${filePath}:`, error);
    }
  }
}
