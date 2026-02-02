/**
 * Storage operations for design patterns.
 * CRUD operations with Zod validation on save and load.
 */

import { readFile, writeFile, mkdir, unlink, access } from 'fs/promises';
import { dirname, join } from 'path';
import { glob } from 'glob';
import { parse, stringify } from 'yaml';
import { PatternSchema, type Pattern } from '../schema/pattern.schema';
import type { Category } from '../schema/categories';

/** Base directory for pattern storage */
export const PATTERNS_DIR = '.knowledge/patterns';

/**
 * Convert a pattern name to a URL-safe slug.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get the file path for a pattern.
 */
export function getPatternPath(category: Category, name: string): string {
  const slug = slugify(name);
  return join(PATTERNS_DIR, category, `${slug}.yaml`);
}

/**
 * Save a pattern to disk with validation.
 * @throws ZodError if pattern is invalid
 * @returns The file path where the pattern was saved
 */
export async function savePattern(pattern: Pattern): Promise<string> {
  // Validate BEFORE writing
  const validated = PatternSchema.parse(pattern);

  const filePath = getPatternPath(validated.category, validated.name);

  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true });

  // Stringify to YAML and write
  const yamlContent = stringify(validated);
  await writeFile(filePath, yamlContent, 'utf-8');

  return filePath;
}

/**
 * Load a pattern from disk with validation.
 * @throws ZodError if pattern file is invalid
 * @throws Error if file doesn't exist
 */
export async function loadPattern(filePath: string): Promise<Pattern> {
  const content = await readFile(filePath, 'utf-8');
  const parsed = parse(content);

  // Validate after reading
  return PatternSchema.parse(parsed);
}

/**
 * Delete a pattern file.
 * No error if file doesn't exist.
 */
export async function deletePattern(filePath: string): Promise<void> {
  try {
    await access(filePath);
    await unlink(filePath);
  } catch {
    // File doesn't exist, ignore
  }
}

/**
 * List all pattern files, optionally filtered by category.
 * @returns Array of file paths
 */
export async function listPatterns(category?: Category): Promise<string[]> {
  const pattern = category
    ? `${PATTERNS_DIR}/${category}/*.yaml`
    : `${PATTERNS_DIR}/**/*.yaml`;

  return glob(pattern);
}
