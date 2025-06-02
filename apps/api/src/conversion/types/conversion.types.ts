export type FileStatus = 'PENDING' | 'CONVERTING' | 'COMPLETED' | 'FAILED';
export type IndivisualUrlType = {
  id: string;
  name: string;
  url: string;
  size: number;
};
export interface FileMetaData {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly mimeType: string;
  lastModified: number;
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
  readonly individualUrls?: ReadonlyArray<IndivisualUrlType>;
  readonly isZip: boolean;
  readonly zipSize?: number;
  readonly conversionTime: number;
  readonly fileCount: number;
  readonly failedCount?: number;
}
