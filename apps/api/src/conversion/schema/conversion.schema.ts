/**
 * @fileoverview schema definations for conversion service
 */

import { z } from 'zod';

export const QualityOptionSchema = z.enum(['LOW', 'MEDIUM', 'HIGH'] as const);
export const ScaleOptionSchema = z.enum(['50', '100', '150', '200'] as const);
export const BackGroundOptionSchema = z.enum(['TRANSPARENT', 'WHITE', 'BLACK'] as const);

export const ConversionConfigSchema = z.object({
  quality: QualityOptionSchema,
  scale: ScaleOptionSchema,
  background: BackGroundOptionSchema,
});

export const ConversionRequestSchema = z.object({
  config: ConversionConfigSchema,
  fileCount: z.number().min(1).max(50),
  timestamp: z.string().datetime(),
});

export type QualityOption = z.infer<typeof QualityOptionSchema>;
export type ScaleOption = z.infer<typeof ScaleOptionSchema>;
export type BackgroundOption = z.infer<typeof BackGroundOptionSchema>;
export type ConversionConfig = z.infer<typeof ConversionConfigSchema>;
export type ConversionRequest = z.infer<typeof ConversionRequestSchema>;
