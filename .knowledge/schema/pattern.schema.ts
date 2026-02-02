/**
 * Zod schema for design pattern validation.
 * Single source of truth for pattern structure.
 */

import { z } from 'zod';
import { CATEGORIES, FRAMEWORKS, WCAG_LEVELS } from './categories';

/** Accessibility information schema */
const AccessibilitySchema = z.object({
  notes: z.string(),
  wcag_level: z.enum(WCAG_LEVELS).optional(),
});

/** Source/origin information schema */
const SourceSchema = z.object({
  url: z.string().url().optional(),
  extracted: z.string().optional(),
});

/** Main pattern schema */
export const PatternSchema = z.object({
  /** Pattern name (3-100 characters) */
  name: z.string().min(3).max(100),

  /** Pattern category */
  category: z.enum(CATEGORIES),

  /** Searchable tags */
  tags: z.array(z.string().min(1)).min(1),

  /** Supported frameworks */
  frameworks: z.array(z.enum(FRAMEWORKS)).min(1),

  /** Accessibility notes and WCAG level */
  accessibility: AccessibilitySchema.optional(),

  /** Design principles and guidelines */
  principles: z.array(z.string()).min(1),

  /** Framework-specific code examples */
  code_examples: z.record(z.enum(FRAMEWORKS), z.string()).optional(),

  /** Source/origin information */
  source: SourceSchema.optional(),
});

/** Validated pattern type (output) */
export type Pattern = z.infer<typeof PatternSchema>;

/** Pattern input type (for creating patterns) */
export type PatternInput = z.input<typeof PatternSchema>;
