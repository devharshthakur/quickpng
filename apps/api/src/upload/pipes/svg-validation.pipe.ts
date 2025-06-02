import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FILE_CONSTRAINTS, SupportedExtension, SupportedMimeType } from '../../conversion/constants/values.constants';
import { UploadFileType } from '../upload.service';

@Injectable()
export class SvgValidationPipe implements PipeTransform {
  transform(file: UploadFileType): UploadFileType {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const fileExtension = ('.' + file.originalname.split('.').pop()?.toLowerCase()) as SupportedExtension;
    if (!FILE_CONSTRAINTS.SUPPORTED_EXTENSIONS.includes(fileExtension)) {
      throw new BadRequestException(`Invalid file extension. Supported extensions: ${FILE_CONSTRAINTS.SUPPORTED_EXTENSIONS.join(', ')}`);
    }
    if (!FILE_CONSTRAINTS.SUPPORTED_MIME_TYPES.includes(file.mimetype as SupportedMimeType)) {
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
