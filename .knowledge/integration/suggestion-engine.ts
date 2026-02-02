/**
 * Pattern suggestion engine.
 * Generates ranked pattern suggestions based on context.
 */

import type { Pattern } from '../schema/pattern.schema';
import type { Category, Framework } from '../schema/categories';
import { getIndex } from '../lib/cache';
import { loadPattern } from '../lib/storage';
import { analyzeTaskContext, type TaskContext } from './context-analyzer';

/** A pattern suggestion with relevance scoring */
export interface PatternSuggestion {
  /** The suggested pattern */
  pattern: Pattern;
  /** Relevance score 0-1 */
  relevance: number;
  /** Human-readable explanation for why this pattern was suggested */
  reason: string;
  /** Keywords from the query that matched pattern tags */
  matchedKeywords: string[];
}

/** Options for generating suggestions */
export interface SuggestOptions {
  /** Task description to analyze */
  text?: string;
  /** Direct category filter (overrides text analysis) */
  categories?: Category[];
  /** Filter by framework compatibility */
  framework?: Framework;
  /** Maximum number of suggestions (default: 5) */
  limit?: number;
  /** Minimum relevance threshold 0-1 (default: 0.3) */
  minRelevance?: number;
}

/**
 * Calculate relevance score for a pattern given the context.
 *
 * Scoring:
 * - Category match: +0.5
 * - Tag overlap with keywords: +0.15 each
 * - Framework match: +0.1
 *
 * @param pattern - Pattern to score
 * @param context - Task context for comparison
 * @returns Score and matched keywords
 */
function calculateRelevance(
  pattern: Pattern,
  context: TaskContext
): { score: number; matchedKeywords: string[] } {
  let score = 0;
  const matchedKeywords: string[] = [];

  // Category match: major boost
  if (context.categories.includes(pattern.category)) {
    score += 0.5;
  }

  // Tag overlap with keywords: incremental boost
  const lowerTags = pattern.tags.map(t => t.toLowerCase());
  for (const keyword of context.keywords) {
    if (lowerTags.includes(keyword)) {
      score += 0.15;
      matchedKeywords.push(keyword);
    }
  }

  // Framework match: minor boost if specified
  if (context.framework && pattern.frameworks.includes(context.framework)) {
    score += 0.1;
  }

  return { score: Math.min(score, 1), matchedKeywords };
}

/**
 * Generate human-readable reason for suggestion.
 *
 * @param pattern - Suggested pattern
 * @param context - Task context
 * @param matchedKeywords - Keywords that matched
 * @returns Human-readable explanation
 */
function generateReason(
  pattern: Pattern,
  context: TaskContext,
  matchedKeywords: string[]
): string {
  const parts: string[] = [];

  if (context.categories.includes(pattern.category)) {
    parts.push(`matches ${pattern.category} category`);
  }

  if (matchedKeywords.length > 0) {
    parts.push(`tags match: ${matchedKeywords.join(', ')}`);
  }

  if (context.framework && pattern.frameworks.includes(context.framework)) {
    parts.push(`supports ${context.framework}`);
  }

  return parts.length > 0 ? parts.join('; ') : 'general match';
}

/**
 * Get pattern suggestions based on context.
 * Analyzes the input text (or uses provided categories) to find relevant patterns.
 *
 * @param options - Suggestion options
 * @returns Array of pattern suggestions sorted by relevance
 */
export async function suggestPatterns(
  options: SuggestOptions
): Promise<PatternSuggestion[]> {
  const limit = options.limit ?? 5;
  const minRelevance = options.minRelevance ?? 0.3;

  // Build context from text or use provided categories
  const context: TaskContext = options.text
    ? analyzeTaskContext(options.text, options.framework)
    : {
        text: '',
        categories: options.categories ?? [],
        keywords: [],
        framework: options.framework,
      };

  // If no categories detected and none provided, return empty
  if (context.categories.length === 0 && !options.categories) {
    return [];
  }

  // Get the pattern index for fast lookups
  const index = await getIndex();
  const candidateIds = new Set<string>();

  // Collect candidates from all matching categories
  const categoriesToSearch = options.categories ?? context.categories;
  for (const category of categoriesToSearch) {
    const categoryPatterns = index.byCategory.get(category);
    if (categoryPatterns) {
      categoryPatterns.forEach(id => candidateIds.add(id));
    }
  }

  // Load patterns and calculate relevance
  const suggestions: PatternSuggestion[] = [];

  for (const id of candidateIds) {
    const meta = index.byId.get(id);
    if (!meta) continue;

    // Framework filter
    if (context.framework && !meta.frameworks.includes(context.framework)) {
      continue;
    }

    const pattern = await loadPattern(meta.file);
    const { score, matchedKeywords } = calculateRelevance(pattern, context);

    if (score >= minRelevance) {
      suggestions.push({
        pattern,
        relevance: score,
        reason: generateReason(pattern, context, matchedKeywords),
        matchedKeywords,
      });
    }
  }

  // Sort by relevance (descending) and limit
  suggestions.sort((a, b) => b.relevance - a.relevance);
  return suggestions.slice(0, limit);
}
