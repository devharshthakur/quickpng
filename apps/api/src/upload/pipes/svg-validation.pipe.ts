import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FILE_CONSTRAINTS } from '../../conversion/constants/values.constants';

@Injectable()
export class SvgValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !FILE_CONSTRAINTS.SUPPORTED_EXTENSIONS.includes(`.${fileExtension}` as any)) {
      throw new BadRequestException(`Invalid file extension. Supported extensions: ${FILE_CONSTRAINTS.SUPPORTED_EXTENSIONS.join(', ')}`);
    }
    if (!FILE_CONSTRAINTS.SUPPORTED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException(`Invalid file type. Supported types: ${FILE_CONSTRAINTS.SUPPORTED_MIME_TYPES.join(', ')}`);
    }
    if (file.size > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${FILE_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    const fileContent = file.buffer.toString('utf8');
    if (!fileContent.includes('<svg') || !fileContent.includes('</svg>')) {
      throw new BadRequestException('Invalid SVG file content');
    }
    return file;
  }
}
