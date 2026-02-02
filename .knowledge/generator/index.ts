/**
 * Code Generation Module
 *
 * Generates framework-specific code from design patterns.
 * This module provides:
 * - Framework detection from package.json
 * - Template-based code generation using Handlebars
 * - Output formatting and clipboard operations (to be added)
 */

// Framework detection
export { detectFramework, FRAMEWORK_PACKAGES } from './framework-detector';

// Code generation
export {
  generateCode,
  loadTemplate,
  toPascalCase,
  toSlugCase,
  clearTemplateCache,
} from './code-generator';
