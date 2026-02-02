/**
 * Code generator that compiles Handlebars templates with pattern data.
 * Produces framework-specific code from design patterns.
 */

import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Pattern } from '../schema/pattern.schema';
import type { Framework } from '../schema/categories';

/** Templates directory path */
const TEMPLATES_DIR = join(__dirname, 'templates');

/** Compiled template cache for performance */
const templateCache = new Map<Framework, Handlebars.TemplateDelegate>();

/**
 * Converts a string to PascalCase.
 * Used for React component names.
 *
 * @example
 * toPascalCase("my pattern name") // "MyPatternName"
 * toPascalCase("css-grid-system") // "CssGridSystem"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Converts a string to slug-case (kebab-case).
 * Used for CSS class names.
 *
 * @example
 * toSlugCase("My Pattern Name") // "my-pattern-name"
 * toSlugCase("CSSGridSystem") // "css-grid-system"
 */
export function toSlugCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// Register Handlebars helpers
Handlebars.registerHelper('pascalCase', toPascalCase);
Handlebars.registerHelper('slugCase', toSlugCase);

/**
 * Loads and compiles a template for the specified framework.
 * Templates are cached after first load.
 *
 * @param framework - The framework to load template for
 * @returns Compiled Handlebars template
 * @throws Error if template file not found
 */
export function loadTemplate(framework: Framework): Handlebars.TemplateDelegate {
  const cached = templateCache.get(framework);
  if (cached) {
    return cached;
  }

  const templatePath = join(TEMPLATES_DIR, `${framework}.hbs`);

  try {
    const templateSource = readFileSync(templatePath, 'utf-8');
    const compiled = Handlebars.compile(templateSource);
    templateCache.set(framework, compiled);
    return compiled;
  } catch (error) {
    throw new Error(
      `Template not found for framework "${framework}". ` +
        `Expected file at: ${templatePath}`
    );
  }
}

/**
 * Template context built from pattern data.
 */
interface TemplateContext {
  name: string;
  pascalName: string;
  slugName: string;
  principles: string[];
  category: string;
  tags: string[];
  accessibility?: {
    notes: string;
    wcag_level?: string;
  };
  code: string | null;
}

/**
 * Generates framework-specific code from a pattern.
 *
 * @param pattern - The design pattern to generate code from
 * @param framework - The target framework
 * @returns Generated code string
 *
 * @example
 * ```typescript
 * const code = generateCode(myPattern, 'react');
 * // Returns React component with pattern principles
 * ```
 */
export function generateCode(pattern: Pattern, framework: Framework): string {
  const template = loadTemplate(framework);

  const context: TemplateContext = {
    name: pattern.name,
    pascalName: toPascalCase(pattern.name),
    slugName: toSlugCase(pattern.name),
    principles: pattern.principles,
    category: pattern.category,
    tags: pattern.tags,
    accessibility: pattern.accessibility,
    code: pattern.code_examples?.[framework] || null,
  };

  return template(context);
}

/**
 * Clears the template cache.
 * Useful for testing or when templates are modified.
 */
export function clearTemplateCache(): void {
  templateCache.clear();
}
