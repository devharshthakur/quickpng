import { Controller, Logger, Post, Req, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, SavedFileInfoType, UploadFileType } from './upload.service';
import { SvgValidationPipe } from './pipes/svg-validation.pipe';
import { DbService } from 'src/db/db.service';
import { ConversionService } from 'src/conversion/conversion.service';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly conversionService: ConversionService,
    private readonly dbService: DbService,
  ) {}

  private logger = new Logger(UploadController.name);

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(SvgValidationPipe)
  async uploadSvgAndConvert(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Step 1: Transform the uploaded file into our internal UploadFileType format
    const FileToBeUploaded: UploadFileType = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    // Step 2: Save the file to disk and get file information
    const savedFileInfo: SavedFileInfoType = await this.uploadService.saveFile(FileToBeUploaded);

    // Step 3: Store file Info (metadata) in database
    this.dbService.addFileInfo(savedFileInfo);

    // Step 3.5: Fetch the dimensions of the uploaded SVG file
    const svgDimensions = await this.uploadService.getSvgDimensions(savedFileInfo.path);
    this.logger.log(`Fetched SVG dimensions: width=${svgDimensions.width}, height=${svgDimensions.height}`);

    // Step 4: Convert SVG to PNG with the fetched dimensions
    const convertedPngDownloadUrl = await this.conversionService.convertSvgToPng(
      baseUrl,
      savedFileInfo.path,
      svgDimensions.width,
      svgDimensions.height,
    );
    this.logger.log(`Svg file ${savedFileInfo.originalname} converted to png successfully`);

    // Step 5: Log cleanup process and return file information containig the download url
    this.logger.log(`Cleaning up the uploaded svg file ${savedFileInfo.originalname}`);
    await this.uploadService.cleanUpFile(savedFileInfo.path);

    // Step 6: Return the savedFileInfo with the download url
    return {
      savedFileInfo,
      convertedPngDownloadUrl,
    };
  }
}
