/**
 * Zod schema for design pattern validation.
 * Single source of truth for pattern structure.
 */

import { z } from 'zod';
import { CATEGORIES, FRAMEWORKS, WCAG_LEVELS } from './categories';

/** Parameter documentation schema */
const ParameterSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  required: z.boolean().default(true),
  default: z.string().optional(),
});

/** Documentation schema for pattern docs */
const DocumentationSchema = z.object({
  description: z.string().min(10).max(500),
  usage: z.string().optional(),
  parameters: z.array(ParameterSchema).optional(),
  best_practices: z.array(z.string()).optional(),
  related_patterns: z.array(z.string()).optional(),
});

/** Framework version compatibility schema */
const FrameworkCompatibilitySchema = z.object({
  react: z.string().optional(),    // e.g., "18.0+"
  vue: z.string().optional(),      // e.g., "3.0+"
  svelte: z.string().optional(),   // e.g., "4.0+"
  vanilla: z.boolean().optional(), // true = supported
});

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

  /** Framework-specific code examples (partial - not all frameworks required) */
  code_examples: z
    .object({
      react: z.string().optional(),
      vue: z.string().optional(),
      svelte: z.string().optional(),
      vanilla: z.string().optional(),
    })
    .optional(),

  /** Source/origin information */
  source: SourceSchema.optional(),

  /** Comprehensive documentation (optional, backward compatible) */
  documentation: DocumentationSchema.optional(),

  /** Framework version compatibility (optional, backward compatible) */
  framework_compatibility: FrameworkCompatibilitySchema.optional(),
});

/** Validated pattern type (output) */
export type Pattern = z.infer<typeof PatternSchema>;

/** Pattern input type (for creating patterns) */
export type PatternInput = z.input<typeof PatternSchema>;

/** Documentation type */
export type Documentation = z.infer<typeof DocumentationSchema>;

/** Parameter type */
export type Parameter = z.infer<typeof ParameterSchema>;

/** Framework compatibility type */
export type FrameworkCompatibility = z.infer<typeof FrameworkCompatibilitySchema>;
