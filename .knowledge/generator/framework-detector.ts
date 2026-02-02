/**
 * Framework detection from package.json.
 * Analyzes project dependencies to determine the frontend framework in use.
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Framework } from '../schema/categories';

/**
 * Package names that indicate each framework.
 * Checked in priority order: react first, then vue, then svelte.
 */
export const FRAMEWORK_PACKAGES: Record<Framework, readonly string[]> = {
  react: ['react', 'react-dom', 'next', '@remix-run/react', 'gatsby'],
  vue: ['vue', 'nuxt', '@vue/cli-service', 'vite-plugin-vue'],
  svelte: ['svelte', '@sveltejs/kit', '@sveltejs/adapter-auto'],
  vanilla: [], // Fallback - no specific packages
} as const;

/**
 * Priority order for framework detection.
 * React is checked first, vanilla is the fallback.
 */
const DETECTION_ORDER: Framework[] = ['react', 'vue', 'svelte'];

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Detects the frontend framework used in a project by analyzing package.json.
 *
 * @param projectDir - Directory containing package.json. Defaults to current directory.
 * @returns The detected framework, or 'vanilla' if none detected or on error.
 *
 * @example
 * ```typescript
 * const framework = await detectFramework();
 * // Returns 'react' if react is in package.json
 *
 * const framework = await detectFramework('/path/to/project');
 * // Checks specific directory
 * ```
 */
export async function detectFramework(projectDir: string = '.'): Promise<Framework> {
  try {
    const packageJsonPath = join(projectDir, 'package.json');
    const content = await readFile(packageJsonPath, 'utf-8');
    const packageJson: PackageJson = JSON.parse(content);

    // Combine all dependencies
    const allDependencies = new Set([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
    ]);

    // Check each framework in priority order
    for (const framework of DETECTION_ORDER) {
      const packages = FRAMEWORK_PACKAGES[framework];
      for (const pkg of packages) {
        if (allDependencies.has(pkg)) {
          return framework;
        }
      }
    }

    // No framework detected
    return 'vanilla';
  } catch {
    // File not found, parse error, or other issues
    return 'vanilla';
  }
}
