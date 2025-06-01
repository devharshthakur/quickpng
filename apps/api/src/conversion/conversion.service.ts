import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ConversionService {
  private logger = new Logger('convert');

  async convertSvgToPng(svgFilePath: string, width: number, height: number) {
    try {
      let sharpInstance = sharp(svgFilePath);

      if (width && height) {
        sharpInstance = sharpInstance.resize(width, height);
      }

      const pngBuffer = await sharpInstance.png().toBuffer();
      return pngBuffer;
    } catch (error) {
      this.logger.error('Error during Svg to Png conversion:', error);
      throw new InternalServerErrorException('Falied to convert dvg to png');
    }
  }
}
