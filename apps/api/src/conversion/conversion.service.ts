import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class ConversionService {
  private logger = new Logger('convert');

  /**
   * Converts an SVG file to PNG format with specified dimensions
   * @param svgFilePath - The path to the source SVG file
   * @param width - The desired width of the output PNG image
   * @param height - The desired height of the output PNG image
   * @returns {Promise<string>} A promise that resolves to the download URL of the converted PNG file
   * @throws {InternalServerErrorException} If the conversion process fails
   */
  async convertSvgToPng(baseUrl: string, svgFilePath: string, width: number, height: number): Promise<string> {
    try {
      let sharpInstance = sharp(svgFilePath);

      if (width && height) {
        sharpInstance = sharpInstance.resize(width, height);
      }

      sharpInstance = sharpInstance.toColourspace('rgb16').sharpen();

      const pngBuffer = await sharpInstance.png({ compressionLevel: 2 }).toBuffer();
      const originalSvgFileName = path.basename(svgFilePath, path.extname(svgFilePath));
      const ConvertedPngfileName = `${originalSvgFileName}_converted.png`;
      const imagesDir = path.join(process.cwd(), 'uploads', 'images');
      const outputPath = path.join(imagesDir, ConvertedPngfileName);

      if (!fs.existsSync(imagesDir)) {
        await fs.promises.mkdir(imagesDir, { recursive: true });
      }
      await fs.promises.writeFile(outputPath, pngBuffer);

      const downloadUrl = `${baseUrl}/uploads/images/${ConvertedPngfileName}`;
      return downloadUrl;
    } catch (error) {
      this.logger.error('Error during Svg to Png conversion:', error);
      throw new InternalServerErrorException('Failed to convert svg to png');
    }
  }
}
