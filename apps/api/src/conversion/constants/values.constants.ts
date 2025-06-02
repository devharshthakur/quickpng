import { ConversionConfig, QualityOption, ScaleOption } from '../schema/conversion.schema';

export const QUALITY_VALUES: Record<QualityOption, number> = {
  LOW: 0.5,
  MEDIUM: 0.75,
  HIGH: 1.0,
} as const;

export const SCALE_VALUES: Record<ScaleOption, number> = {
  '50': 0.5,
  '100': 1.0,
  '150': 1.5,
  '200': 2.0,
} as const;

export const DEFAULT_CONVERSION_CONFIG: ConversionConfig = {
  quality: 'HIGH',
  scale: '100',
  background: 'TRANSPARENT',
} as const;

export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: (10 * 1024 * 1024) as number, // 10MB
  MAX_FILES_PER_REQUEST: 50 as number,
  ZIP_THRESHOLD: 3 as number,
  SUPPORTED_MIME_TYPES: ['image/svg+xml'] as const,
  SUPPORTED_EXTENSIONS: ['.svg'] as const,
} as const;

export type SupportedMimeType = (typeof FILE_CONSTRAINTS.SUPPORTED_MIME_TYPES)[number];
export type SupportedExtension = (typeof FILE_CONSTRAINTS.SUPPORTED_EXTENSIONS)[number];
export type FileConstraints = typeof FILE_CONSTRAINTS;
