/**
 * Output module for syntax-highlighted display and clipboard operations.
 * Provides terminal output formatting and cross-platform clipboard support.
 */

import { highlight } from 'cli-highlight';
import type { Framework } from '../schema/categories';

/** Maps frameworks to highlight.js language names */
const LANGUAGE_MAP: Record<Framework, string> = {
  react: 'typescript',
  vue: 'html',
  svelte: 'html',
  vanilla: 'css',
};

/** Separator line for code display */
const SEPARATOR = '\u2500'.repeat(50);

/**
 * Displays syntax-highlighted code in the terminal.
 *
 * @param code - The code to display
 * @param framework - The framework (determines syntax highlighting)
 *
 * @example
 * ```typescript
 * displayCode(reactComponent, 'react');
 * // Prints colored TypeScript/JSX to terminal
 * ```
 */
export function displayCode(code: string, framework: Framework): void {
  const language = LANGUAGE_MAP[framework];

  console.log(`\x1b[2m${SEPARATOR}\x1b[0m`); // dim separator
  console.log(highlight(code, { language }));
  console.log(`\x1b[2m${SEPARATOR}\x1b[0m`); // dim separator
}

/**
 * Copies text to the system clipboard.
 * Uses dynamic import for ESM-only clipboardy.
 *
 * @param text - The text to copy
 * @returns true if successful, false on failure
 *
 * @example
 * ```typescript
 * const success = await copyToClipboard(generatedCode);
 * if (success) console.log('Copied!');
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Dynamic import for ESM-only clipboardy
    const clipboard = await import('clipboardy');
    await clipboard.default.write(text);
    return true;
  } catch (error) {
    console.log(`\x1b[33m\u26A0 Clipboard unavailable: ${(error as Error).message}\x1b[0m`);
    return false;
  }
}

/**
 * Displays code with syntax highlighting and copies to clipboard.
 * Shows confirmation message on success or fallback message on failure.
 *
 * @param code - The code to display and copy
 * @param framework - The framework (determines syntax highlighting)
 *
 * @example
 * ```typescript
 * await outputCode(generatedCode, 'react');
 * // Displays highlighted code and copies to clipboard
 * ```
 */
export async function outputCode(code: string, framework: Framework): Promise<void> {
  displayCode(code, framework);

  const success = await copyToClipboard(code);

  if (success) {
    console.log('\x1b[32m\u2713 Copied to clipboard\x1b[0m');
  } else {
    console.log('\x1b[33m\u26A0 Copy the code above manually\x1b[0m');
  }
}
