/**
 * Search and filter operations for design patterns.
 * Simple in-memory filtering for small-scale pattern storage.
 */

import { loadPattern, listPatterns } from './storage';
import type { Pattern } from '../schema/pattern.schema';
import type { Category, Framework } from '../schema/categories';

/** Options for combined pattern search */
export interface SearchOptions {
  tags?: string[];
  category?: Category;
  framework?: Framework;
}

/**
 * Search patterns by tags.
 * Returns patterns that include ALL specified tags.
 */
export async function searchByTags(tags: string[]): Promise<Pattern[]> {
  const files = await listPatterns();
  const patterns = await Promise.all(files.map(loadPattern));

  return patterns.filter((pattern) =>
    tags.every((tag) =>
      pattern.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  );
}

/**
 * Filter patterns by category.
 * Returns all patterns in the specified category.
 */
export async function filterByCategory(category: Category): Promise<Pattern[]> {
  const files = await listPatterns(category);
  return Promise.all(files.map(loadPattern));
}

/**
 * Filter patterns by framework.
 * Returns patterns that support the specified framework.
 */
export async function filterByFramework(framework: Framework): Promise<Pattern[]> {
  const files = await listPatterns();
  const patterns = await Promise.all(files.map(loadPattern));

  return patterns.filter((pattern) => pattern.frameworks.includes(framework));
}

/**
 * Combined search with multiple optional filters.
 * Returns patterns matching ALL provided criteria.
 */
export async function searchPatterns(options: SearchOptions): Promise<Pattern[]> {
  // Start with category filter if provided (most efficient)
  const files = options.category
    ? await listPatterns(options.category)
    : await listPatterns();

  if (files.length === 0) {
    return [];
  }

  let patterns = await Promise.all(files.map(loadPattern));

  // Apply tag filter
  if (options.tags && options.tags.length > 0) {
    patterns = patterns.filter((pattern) =>
      options.tags!.every((tag) =>
        pattern.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    );
  }

  // Apply framework filter
  if (options.framework) {
    patterns = patterns.filter((pattern) =>
      pattern.frameworks.includes(options.framework!)
    );
  }

  return patterns;
}
