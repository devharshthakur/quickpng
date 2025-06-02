/**
 * @fileoverview schema definations for conversion service
 */

export type QualityOption = 'LOW' | 'MEDIUM' | 'HIGH';
export type ScaleOption = '50' | '100' | '150' | '200';
export type BackgroundOption = 'TRANSPARENT' | 'WHITE' | 'BLACK';

export interface ConversionConfig {
  quality: QualityOption;
  scale: ScaleOption;
  background: BackgroundOption;
}

export interface ConversionRequest {
  config: ConversionConfig;
  fileCount: number;
  timestamp: string;
}
