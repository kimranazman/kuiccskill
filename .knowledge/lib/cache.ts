/**
 * In-memory pattern cache with fast indexed search.
 * Provides O(1) lookups by tag, category, and framework.
 */

import { listPatterns, loadPattern } from './storage';
import type { Pattern } from '../schema/pattern.schema';
import type { Category, Framework } from '../schema/categories';
import type { SearchOptions } from './search';

/** Metadata extracted from a pattern for indexing */
export interface PatternMetadata {
  file: string;
  name: string;
  category: Category;
  tags: string[];
  frameworks: Framework[];
}

/** In-memory pattern index with multiple lookup maps */
export interface PatternIndex {
  byId: Map<string, PatternMetadata>;
  byTag: Map<string, Set<string>>; // lowercase tag -> pattern IDs
  byCategory: Map<Category, Set<string>>;
  byFramework: Map<Framework, Set<string>>;
  buildTime: number; // ms to build
}

// Singleton cache
let cachedIndex: PatternIndex | null = null;
let buildPromise: Promise<PatternIndex> | null = null;

/**
 * Build the pattern index from disk.
 * Loads all patterns and creates indexed maps for fast lookup.
 */
export async function buildIndex(): Promise<PatternIndex> {
  const startTime = performance.now();

  const files = await listPatterns();

  const index: PatternIndex = {
    byId: new Map(),
    byTag: new Map(),
    byCategory: new Map(),
    byFramework: new Map(),
    buildTime: 0,
  };

  // Load all patterns and build index
  await Promise.all(
    files.map(async (file) => {
      try {
        const pattern = await loadPattern(file);

        // Create ID from file path (unique identifier)
        const id = file;

        // Store metadata
        const metadata: PatternMetadata = {
          file,
          name: pattern.name,
          category: pattern.category,
          tags: pattern.tags,
          frameworks: pattern.frameworks,
        };
        index.byId.set(id, metadata);

        // Index by tags (lowercase for case-insensitive search)
        for (const tag of pattern.tags) {
          const lowerTag = tag.toLowerCase();
          if (!index.byTag.has(lowerTag)) {
            index.byTag.set(lowerTag, new Set());
          }
          index.byTag.get(lowerTag)!.add(id);
        }

        // Index by category
        if (!index.byCategory.has(pattern.category)) {
          index.byCategory.set(pattern.category, new Set());
        }
        index.byCategory.get(pattern.category)!.add(id);

        // Index by framework
        for (const framework of pattern.frameworks) {
          if (!index.byFramework.has(framework)) {
            index.byFramework.set(framework, new Set());
          }
          index.byFramework.get(framework)!.add(id);
        }
      } catch (error) {
        // Log but continue - one bad pattern shouldn't break the whole index
        console.warn(`Failed to index pattern: ${file}`, error);
      }
    })
  );

  index.buildTime = performance.now() - startTime;
  return index;
}

/**
 * Get the pattern index, building it on first access.
 * Handles concurrent access - only one build at a time.
 */
export async function getIndex(): Promise<PatternIndex> {
  // Return cached index if available
  if (cachedIndex) {
    return cachedIndex;
  }

  // If build is in progress, wait for it
  if (buildPromise) {
    return buildPromise;
  }

  // Start a new build
  buildPromise = buildIndex().then((index) => {
    cachedIndex = index;
    buildPromise = null;
    return index;
  });

  return buildPromise;
}

/**
 * Helper to intersect two sets.
 */
function intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of a) {
    if (b.has(item)) {
      result.add(item);
    }
  }
  return result;
}

/**
 * Fast indexed search returning pattern IDs.
 * O(1) lookups using pre-built indexes.
 */
export async function searchFast(options: SearchOptions): Promise<string[]> {
  const index = await getIndex();

  // Start with all patterns if no filters
  let resultSet: Set<string> | null = null;

  // Apply tag filter (AND logic - must match ALL tags)
  if (options.tags && options.tags.length > 0) {
    for (const tag of options.tags) {
      const lowerTag = tag.toLowerCase();
      const tagSet = index.byTag.get(lowerTag) || new Set();

      if (resultSet === null) {
        resultSet = new Set(tagSet);
      } else {
        resultSet = intersect(resultSet, tagSet);
      }

      // Early exit if no matches
      if (resultSet.size === 0) {
        return [];
      }
    }
  }

  // Apply category filter
  if (options.category) {
    const categorySet = index.byCategory.get(options.category) || new Set();

    if (resultSet === null) {
      resultSet = new Set(categorySet);
    } else {
      resultSet = intersect(resultSet, categorySet);
    }

    if (resultSet.size === 0) {
      return [];
    }
  }

  // Apply framework filter
  if (options.framework) {
    const frameworkSet = index.byFramework.get(options.framework) || new Set();

    if (resultSet === null) {
      resultSet = new Set(frameworkSet);
    } else {
      resultSet = intersect(resultSet, frameworkSet);
    }

    if (resultSet.size === 0) {
      return [];
    }
  }

  // If no filters were applied, return all pattern IDs
  if (resultSet === null) {
    return Array.from(index.byId.keys());
  }

  return Array.from(resultSet);
}

/**
 * Invalidate the cached index.
 * Call this when patterns are added/removed/modified.
 */
export function invalidateCache(): void {
  cachedIndex = null;
  buildPromise = null;
}
