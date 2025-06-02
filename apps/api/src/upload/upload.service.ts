import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, promises } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { XMLParser } from 'fast-xml-parser';

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
  private readonly uploadPath: string = join(__dirname, '..', '..', 'uploads', 'svgs');
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

  /**
   * Generates a unique filename by sanitizing the original filename and adding a UUID suffix
   *
   * Sanitization rules:
   * - Removes all characters except alphanumeric, underscore, period, and hyphen
   * - Replaces invalid characters with underscore
   * - Preserves file extension
   * - Adds first segment of UUID as suffix for uniqueness
   */
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
        `SVG file saved - Original name: ${file.originalname}, Size: ${file.size} bytes, Type: ${file.mimetype}, Saved path: ${filePath}, Saved filename: ${filename}`,
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

  /**
   * Reads an SVG file and extracts its width and height attributes (if present).
   * Returns an object with width and height as numbers. Defaults to 800x600 if not found.
   * @param filePath - The path to the SVG file
   */
  async getSvgDimensions(filePath: string): Promise<{ width: number; height: number }> {
    try {
      const svgContent = await promises.readFile(filePath, 'utf8');
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });
      const parsed = parser.parse(svgContent);
      const svg = parsed.svg;

      let width = 800;
      let height = 600;

      if (svg && svg.width && svg.height) {
        width = parseInt(svg.width, 10);
        height = parseInt(svg.height, 10);
      } else if (svg && svg.viewBox) {
        // Fallback: extract from viewBox if width/height are missing
        const viewBoxParts = svg.viewBox.split(' ');
        if (viewBoxParts.length === 4) {
          width = parseInt(viewBoxParts[2], 10);
          height = parseInt(viewBoxParts[3], 10);
        }
      }
      return { width, height };
    } catch (error) {
      this.logger.error(`Failed to read SVG dimensions from ${filePath}:`, error);
      return { width: 800, height: 600 };
    }
  }
}
