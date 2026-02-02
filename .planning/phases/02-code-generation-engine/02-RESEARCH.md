# Phase 2: Code Generation Engine - Research

**Researched:** 2026-02-02
**Domain:** Template-based code generation, CLI output, framework detection
**Confidence:** HIGH

## Summary

Phase 2 builds the code generation engine that transforms stored patterns into framework-specific code. The established approach uses Handlebars as the template engine (v4.7.8, includes TypeScript types), clipboardy for clipboard operations (v5.1.0, ESM-only), and cli-highlight for syntax highlighting in terminal output.

Framework detection is straightforward: analyze `package.json` for React/Vue/Svelte dependencies. The skill will expose a `:generate` sub-command that searches patterns, presents matches, generates code via templates, displays syntax-highlighted preview, and copies to clipboard.

**Primary recommendation:** Use Handlebars for templating (mature, well-typed, handles partial templates gracefully), clipboardy for clipboard (cross-platform, actively maintained), cli-highlight for syntax highlighting (highlight.js-based, works with TypeScript).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| handlebars | 4.7.8 | Template compilation | 5M+ dependents, built-in TS types, Mustache-compatible, precompilation support |
| clipboardy | 5.1.0 | Clipboard read/write | Cross-platform (macOS, Windows, Linux/Wayland), maintained by sindresorhus |
| cli-highlight | 2.1.11 | Terminal syntax highlighting | highlight.js-based, 200+ languages, custom themes |
| chalk | 5.4.1 | Terminal styling | De facto standard for CLI coloring |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| highlight.js | 11.9+ | Syntax parsing for cli-highlight | Already a dependency of cli-highlight |
| ora | 8.0+ | Terminal spinners | When showing loading states during generation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Handlebars | EJS | EJS allows JS in templates but less separation of concerns |
| Handlebars | Tagged template literals | Native but requires manual escaping, no partials |
| cli-highlight | prism-cli | Prism better for web, highlight.js better for CLI |
| clipboardy | @napi-rs/clipboard | Native bindings more complex, clipboardy simpler |

**Installation:**
```bash
npm install handlebars clipboardy cli-highlight chalk
```

**Note:** clipboardy v5+ is ESM-only. Ensure `"type": "module"` in package.json or use dynamic import.

## Architecture Patterns

### Recommended Project Structure
```
.knowledge/
├── schema/           # Existing - Pattern schema
├── lib/              # Existing - Storage and search
├── patterns/         # Existing - YAML patterns
└── generator/        # NEW - Code generation
    ├── index.ts              # Public API
    ├── templates/            # Handlebars templates
    │   ├── react.hbs
    │   ├── vue.hbs
    │   ├── svelte.hbs
    │   └── vanilla.hbs
    ├── framework-detector.ts # Project framework detection
    ├── code-generator.ts     # Template compilation
    └── output.ts             # Clipboard + syntax highlight
```

### Pattern 1: Framework Detection
**What:** Detect project framework from package.json dependencies
**When to use:** Before generating code, to auto-select correct template
**Example:**
```typescript
// Detection priority (check in order)
const FRAMEWORK_INDICATORS = {
  react: ['react', 'react-dom', 'next', '@remix-run/react'],
  vue: ['vue', 'nuxt', '@vue/cli-service'],
  svelte: ['svelte', '@sveltejs/kit'],
  vanilla: [] // Fallback
} as const;

function detectFramework(packageJson: object): Framework {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  for (const [framework, indicators] of Object.entries(FRAMEWORK_INDICATORS)) {
    if (indicators.some(pkg => pkg in deps)) {
      return framework as Framework;
    }
  }
  return 'vanilla';
}
```

### Pattern 2: Template Compilation with Handlebars
**What:** Compile pattern data into framework-specific code
**When to use:** After pattern selection, before output
**Example:**
```typescript
import Handlebars from 'handlebars';

// Register helpers for code formatting
Handlebars.registerHelper('indent', (text: string, spaces: number) => {
  const indent = ' '.repeat(spaces);
  return text.split('\n').map(line => indent + line).join('\n');
});

// Compile template once, execute many times
const templates = new Map<Framework, HandlebarsTemplateDelegate>();

function loadTemplate(framework: Framework): HandlebarsTemplateDelegate {
  if (!templates.has(framework)) {
    const source = readFileSync(`templates/${framework}.hbs`, 'utf-8');
    templates.set(framework, Handlebars.compile(source));
  }
  return templates.get(framework)!;
}

function generateCode(pattern: Pattern, framework: Framework): string {
  const template = loadTemplate(framework);
  return template({
    name: pattern.name,
    principles: pattern.principles,
    code: pattern.code_examples?.[framework] || '',
  });
}
```

### Pattern 3: Syntax Highlighted Output
**What:** Display generated code with colors before copying
**When to use:** Always show preview before clipboard copy
**Example:**
```typescript
import { highlight } from 'cli-highlight';
import clipboard from 'clipboardy';
import chalk from 'chalk';

async function outputCode(code: string, language: string): Promise<void> {
  // Map framework to highlight.js language
  const langMap: Record<Framework, string> = {
    react: 'typescript',
    vue: 'html',
    svelte: 'html',
    vanilla: 'css'
  };

  // Display highlighted preview
  console.log(chalk.dim('─'.repeat(50)));
  console.log(highlight(code, { language: langMap[language] || 'typescript' }));
  console.log(chalk.dim('─'.repeat(50)));

  // Copy to clipboard
  await clipboard.write(code);
  console.log(chalk.green('✓ Copied to clipboard'));
}
```

### Anti-Patterns to Avoid
- **String concatenation for code generation:** Use templates, not `+` operators. Maintainability nightmare.
- **Sync clipboard in async context:** Use `clipboard.write()` not `writeSync()` to avoid blocking.
- **Hardcoded framework detection:** Always check package.json, don't assume React.
- **Template compilation on every call:** Pre-compile and cache templates.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Template rendering | Custom string interpolation | Handlebars | Escaping, partials, helpers, precompilation |
| Clipboard access | child_process pbcopy/xclip | clipboardy | Cross-platform, Wayland support, fallbacks |
| Code syntax coloring | ANSI codes manually | cli-highlight | 200+ languages, themeable, maintained |
| Terminal colors | Raw escape sequences | chalk | Detects color support, chainable API |

**Key insight:** These utilities have years of cross-platform edge case handling. Rolling your own will miss Windows PowerShell restrictions, Wayland session detection, terminal capability detection, etc.

## Common Pitfalls

### Pitfall 1: ESM Import Issues
**What goes wrong:** `clipboardy` v5+ is ESM-only, mixing with CommonJS causes import errors
**Why it happens:** Project uses `"type": "commonjs"` (current package.json)
**How to avoid:** Either:
1. Change to `"type": "module"` in package.json
2. Use dynamic import: `const clipboard = await import('clipboardy')`
3. Downgrade to clipboardy v3 (CommonJS compatible, but older)
**Warning signs:** `ERR_REQUIRE_ESM` error at runtime

### Pitfall 2: Missing Code Examples in Patterns
**What goes wrong:** Pattern has `frameworks: ['react', 'vue']` but `code_examples` only has `react`
**Why it happens:** Schema allows partial code_examples (by design for Phase 1)
**How to avoid:** Generator must gracefully handle missing examples:
```typescript
const code = pattern.code_examples?.[framework];
if (!code) {
  // Fall back to principles-based generation or show message
  return generateFromPrinciples(pattern, framework);
}
```
**Warning signs:** Undefined/empty output for valid pattern-framework combos

### Pitfall 3: Clipboard Security Context
**What goes wrong:** Clipboard write fails silently in some environments
**Why it happens:** SSH sessions, certain containers, Wayland without wl-clipboard
**How to avoid:**
1. Catch clipboard errors and show fallback message
2. Print code to terminal as backup
3. Test in target environments
**Warning signs:** "Copied to clipboard" but paste returns nothing

### Pitfall 4: Template XSS in Preview
**What goes wrong:** User-provided pattern data could inject terminal escape sequences
**Why it happens:** Raw pattern content passed to chalk/highlight without sanitization
**How to avoid:** Handlebars HTML-escapes by default (use `{{variable}}` not `{{{variable}}}`)
**Warning signs:** Garbled terminal output, cursor position changes

## Code Examples

Verified patterns from official sources and best practices:

### Handlebars Template for React Component
```handlebars
{{!-- templates/react.hbs --}}
/**
 * {{name}}
 *
 * Principles:
{{#each principles}}
 * - {{this}}
{{/each}}
 */

{{#if code}}
{{{code}}}
{{else}}
// TODO: Implement based on principles above
const {{pascalCase name}} = () => {
  return (
    <div>
      {/* Apply: {{principles.[0]}} */}
    </div>
  );
};

export default {{pascalCase name}};
{{/if}}
```

### Framework Detection Implementation
```typescript
// Source: Best practice from ecosystem research
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Framework } from '../schema/categories';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const FRAMEWORK_PACKAGES: Record<Framework, string[]> = {
  react: ['react', 'react-dom', 'next', '@remix-run/react', 'gatsby'],
  vue: ['vue', 'nuxt', '@vue/cli-service', 'vite-plugin-vue'],
  svelte: ['svelte', '@sveltejs/kit', '@sveltejs/adapter-auto'],
  vanilla: []
};

export async function detectFramework(projectDir: string = '.'): Promise<Framework> {
  try {
    const pkgPath = join(projectDir, 'package.json');
    const content = await readFile(pkgPath, 'utf-8');
    const pkg: PackageJson = JSON.parse(content);

    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const [framework, packages] of Object.entries(FRAMEWORK_PACKAGES)) {
      if (packages.some(p => p in allDeps)) {
        return framework as Framework;
      }
    }
  } catch {
    // No package.json or parse error - default to vanilla
  }

  return 'vanilla';
}
```

### Clipboard with Fallback
```typescript
// Source: clipboardy GitHub + error handling best practices
import chalk from 'chalk';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    const clipboard = await import('clipboardy');
    await clipboard.default.write(text);
    return true;
  } catch (error) {
    console.log(chalk.yellow('⚠ Could not copy to clipboard'));
    console.log(chalk.dim('Code printed above - copy manually'));
    return false;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CommonJS requires | ESM imports | Node 18+ (2022) | clipboardy v5 ESM-only |
| X11 clipboard | Wayland-aware | 2023-2024 | clipboardy auto-detects Wayland |
| Raw ANSI codes | chalk/cli-highlight | 2020+ | Better terminal support detection |
| EJS for code gen | Handlebars/tagged templates | 2023+ | Better separation of concerns |

**Deprecated/outdated:**
- `clipboardy` v3 and below: Still works but missing Wayland support
- `@types/handlebars`: No longer needed, types bundled with handlebars
- Manual terminal color codes: Use chalk for compatibility

## Open Questions

Things that couldn't be fully resolved:

1. **Template complexity for generated components**
   - What we know: Simple Handlebars templates work for single-file output
   - What's unclear: Complex components may need multiple files (component + styles + types)
   - Recommendation: Start with single-file output, add multi-file in Phase 4 if needed

2. **User confirmation before clipboard write**
   - What we know: Most CLI tools auto-copy without confirmation
   - What's unclear: Should we ask or auto-copy?
   - Recommendation: Auto-copy with preview (standard UX pattern)

## Sources

### Primary (HIGH confidence)
- [Handlebars.js GitHub](https://github.com/handlebars-lang/handlebars.js) - Version, TypeScript types, API
- [clipboardy GitHub](https://github.com/sindresorhus/clipboardy) - v5.1.0 API, ESM requirements
- [cli-highlight GitHub](https://github.com/felixfbecker/cli-highlight) - API, theme support
- [handlebarsjs.com/guide](https://handlebarsjs.com/guide/) - Templates, helpers, partials

### Secondary (MEDIUM confidence)
- Framework detection patterns from Bliss Framework docs
- WebSearch results cross-verified with GitHub sources

### Tertiary (LOW confidence)
- None - all key claims verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official repos/docs
- Architecture: HIGH - Patterns based on established CLI tool design
- Pitfalls: HIGH - ESM/clipboard issues documented in library issues

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - libraries are stable)
