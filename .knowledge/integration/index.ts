/**
 * Integration module for KUI Design skill.
 * Contains quality gates, context analysis, and workflow integration.
 */

// Re-export quality gate types and functions
export {
  validateQuality,
  type QualityResult,
  type QualityIssue,
  type Severity,
} from './quality-gates';

// Re-export context analysis
export {
  extractCategories,
  analyzeTaskContext,
  CATEGORY_KEYWORDS,
  type TaskContext,
} from './context-analyzer';

// Re-export suggestion engine
export {
  suggestPatterns,
  type PatternSuggestion,
  type SuggestOptions,
} from './suggestion-engine';
