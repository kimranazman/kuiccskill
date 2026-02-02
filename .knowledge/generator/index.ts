/**
 * Code Generation Module
 *
 * Generates framework-specific code from design patterns.
 * This module provides:
 * - Framework detection from package.json
 * - Template-based code generation using Handlebars
 * - Output formatting with syntax highlighting
 * - Clipboard operations for code copying
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

// Output operations
export { displayCode, copyToClipboard, outputCode } from './output';
