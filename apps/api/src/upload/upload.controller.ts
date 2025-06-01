import { Controller, Logger, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, SavedFileInfoType, UploadFileType } from './upload.service';
import { SvgValidationPipe } from './pipes/svg-validation.pipe';

interface UploadResponse {
  filename: string;
  uploadedFilename: string;
  filePath?: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private logger = new Logger(UploadController.name);

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(SvgValidationPipe)
  async uploadSvg(@UploadedFile() file: Express.Multer.File): Promise<UploadResponse> {
    const uploadedFile: UploadFileType = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    const savedFile: SavedFileInfoType = await this.uploadService.saveFile(uploadedFile);

    const uploadedFileDetails: UploadResponse = {
      filename: savedFile.filename,
      uploadedFilename: savedFile.originalname,
      filePath: savedFile.path,
    };

    return uploadedFileDetails;
  }
}
