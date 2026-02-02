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
