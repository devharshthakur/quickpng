import { Controller, Logger, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, SavedFileInfoType, UploadFileType } from './upload.service';
import { SvgValidationPipe } from './pipes/svg-validation.pipe';
import { DbService } from 'src/db/db.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService,private readonly dbService:DbService) {}

  private logger = new Logger(UploadController.name);

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(SvgValidationPipe)
  async uploadSvg(@UploadedFile() file: Express.Multer.File) {
    const uploadedFile: UploadFileType = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    const savedFileInfo: SavedFileInfoType = await this.uploadService.saveFile(uploadedFile);
    this.dbService.addFileInfo(savedFileInfo);
    return savedFileInfo;
  }
}
