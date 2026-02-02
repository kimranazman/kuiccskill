/**
 * Category and framework type definitions for design patterns.
 * Uses const assertions for type safety.
 */

/** All supported pattern categories */
export const CATEGORIES = [
  'layout',
  'forms',
  'navigation',
  'micro-interactions',
  'data-display',
  'feedback',
  'authentication',
] as const;

/** Pattern category type */
export type Category = (typeof CATEGORIES)[number];

/** All supported frameworks */
export const FRAMEWORKS = ['react', 'vue', 'svelte', 'vanilla'] as const;

/** Framework type */
export type Framework = (typeof FRAMEWORKS)[number];

/** WCAG accessibility levels */
export const WCAG_LEVELS = ['A', 'AA', 'AAA'] as const;

/** WCAG level type */
export type WcagLevel = (typeof WCAG_LEVELS)[number];
