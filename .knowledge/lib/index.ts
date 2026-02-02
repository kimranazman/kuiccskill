/**
 * Public API for pattern storage and search.
 * Single import point for all pattern operations.
 */

// Re-export types
export type { Pattern, PatternInput } from '../schema/pattern.schema';
export type { Category, Framework, WcagLevel } from '../schema/categories';

// Re-export constants
export { CATEGORIES, FRAMEWORKS, WCAG_LEVELS } from '../schema/categories';

// Re-export schema for external validation
export { PatternSchema } from '../schema/pattern.schema';

// Re-export storage operations
export {
  savePattern,
  loadPattern,
  deletePattern,
  listPatterns,
  getPatternPath,
  PATTERNS_DIR,
} from './storage';

// Re-export search operations
export {
  searchByTags,
  filterByCategory,
  filterByFramework,
  searchPatterns,
} from './search';
export type { SearchOptions } from './search';
