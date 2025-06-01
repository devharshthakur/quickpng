export type FileStatus = 'PENDING' | 'CONVERTING' | 'COMPLETED' | 'FAILED';

export interface FileMetaData {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly mimeType: string;
  readonly lastModified: number;
  status: FileStatus;
  readonly dimensions?: {
    width: number;
    height: number;
  };
}

export interface ProcessedFile {
  readonly id: string;
  readonly originalName: string;
  readonly outputName: string;
  readonly buffer: Buffer;
  readonly size: number;
  readonly processingTime?: number;
}

export interface ConversionResult {
  readonly downloadUrl: string;
  readonly individualUrls?: ReadonlyArray<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
  readonly zipSize?: number;
  readonly conversionTime: number;
  readonly fileCount: number;
  readonly failedCount?: number;
}

export interface ConversionError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
}
