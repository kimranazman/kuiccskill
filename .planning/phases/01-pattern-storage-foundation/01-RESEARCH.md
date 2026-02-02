# Phase 1: Pattern Storage Foundation - Research

**Researched:** 2026-02-02
**Domain:** YAML file storage, schema validation, tag-based search
**Confidence:** HIGH

## Summary

This phase establishes a file-based knowledge storage system for design patterns using YAML format with Zod validation. The approach is straightforward: patterns are stored as individual YAML files in a hierarchical category structure under `.knowledge/patterns/`, validated against a Zod schema at write time, and indexed in-memory for fast tag-based search.

The standard stack consists of: `yaml` (or `js-yaml`) for YAML parsing, `zod` for TypeScript-first schema validation, and `gray-matter` for YAML front matter if patterns include both metadata and content sections. For search, simple in-memory filtering is sufficient at the 10-20 pattern scale; no search library needed initially.

**Primary recommendation:** Use Zod schemas to define pattern structure, validate on write, store patterns as category-organized YAML files, and implement simple glob-based indexing with in-memory tag filtering.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zod | 3.x or 4.x | Schema validation with TypeScript inference | TypeScript-first, excellent DX, no external dependencies |
| yaml | 2.x | YAML parsing/stringifying | Native TypeScript types, full YAML 1.2 support, maintained |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gray-matter | 4.x | YAML front matter parsing | If patterns have frontmatter + content sections |
| glob | 10.x | File pattern matching | For discovering pattern files |
| fs/promises | (Node built-in) | Async file operations | Standard Node.js file I/O |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| yaml | js-yaml | js-yaml is older, no native TS types, but widely used |
| zod | yup, joi | zod has better TS inference, others have runtime overhead |
| glob | fast-glob | fast-glob is faster but glob is simpler, sufficient for small scale |

**Installation:**
```bash
npm install zod yaml glob
# Optional if using front matter:
npm install gray-matter
```

## Architecture Patterns

### Recommended Project Structure
```
.knowledge/
├── patterns/
│   ├── layout/
│   │   ├── grid-system.yaml
│   │   ├── responsive-breakpoints.yaml
│   │   └── card-layout.yaml
│   ├── forms/
│   │   ├── input-field.yaml
│   │   └── form-validation.yaml
│   ├── navigation/
│   │   ├── navbar.yaml
│   │   └── sidebar.yaml
│   ├── micro-interactions/
│   │   ├── hover-effects.yaml
│   │   └── button-feedback.yaml
│   ├── data-display/
│   │   ├── table.yaml
│   │   └── card-list.yaml
│   ├── feedback/
│   │   └── toast-notification.yaml
│   └── authentication/
│       └── login-form.yaml
├── schema/
│   └── pattern.schema.ts      # Zod schema definition
└── index/
    └── tags.json              # Optional: pre-built tag index for fast lookups
```

### Pattern 1: Single YAML File Per Pattern
**What:** Each pattern is a standalone YAML file with all metadata and content
**When to use:** Always - provides clear organization, easy to edit, version control friendly
**Example:**
```yaml
# .knowledge/patterns/layout/grid-system.yaml
name: CSS Grid System
category: layout
tags:
  - grid
  - responsive
  - layout
  - css
frameworks:
  - react
  - vue
  - svelte
  - vanilla
accessibility:
  notes: "Ensure proper landmark regions, maintain reading order"
  wcag_level: AA

principles:
  - "Use CSS Grid for two-dimensional layouts"
  - "Define explicit grid areas for complex layouts"
  - "Use minmax() for flexible column sizing"

code_examples:
  react: |
    const Grid = ({ children }) => (
      <div className="grid grid-cols-12 gap-4">
        {children}
      </div>
    );
  vanilla: |
    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1rem;
    }

source:
  url: "https://example.com"
  extracted: "2026-01-15"
```

### Pattern 2: Zod Schema as Single Source of Truth
**What:** Define pattern structure once in Zod, derive TypeScript types automatically
**When to use:** Always - prevents schema drift, provides runtime validation
**Example:**
```typescript
// .knowledge/schema/pattern.schema.ts
import { z } from 'zod';

export const PatternSchema = z.object({
  name: z.string().min(3).max(100),
  category: z.enum([
    'layout',
    'forms',
    'navigation',
    'micro-interactions',
    'data-display',
    'feedback',
    'authentication'
  ]),
  tags: z.array(z.string()).min(1),
  frameworks: z.array(z.enum(['react', 'vue', 'svelte', 'vanilla'])),
  accessibility: z.object({
    notes: z.string(),
    wcag_level: z.enum(['A', 'AA', 'AAA']).optional()
  }).optional(),
  principles: z.array(z.string()).min(1),
  code_examples: z.record(z.string()).optional(),
  source: z.object({
    url: z.string().url().optional(),
    extracted: z.string().optional()
  }).optional()
});

export type Pattern = z.infer<typeof PatternSchema>;
```

### Pattern 3: Lazy Index Loading
**What:** Build index on first query, cache in memory, invalidate on write
**When to use:** For tag-based search at small scale (< 100 patterns)
**Example:**
```typescript
// Simple in-memory index
let patternIndex: Map<string, Pattern[]> | null = null;

async function getPatternsByTag(tag: string): Promise<Pattern[]> {
  if (!patternIndex) {
    patternIndex = await buildIndex();
  }
  return patternIndex.get(tag) || [];
}

function invalidateIndex() {
  patternIndex = null;
}
```

### Anti-Patterns to Avoid
- **Storing patterns in a database:** Overkill for 10-100 patterns, adds dependency
- **Using JSON instead of YAML:** YAML is more readable for multiline content (principles, code)
- **Splitting metadata and content:** Keep everything in one file per pattern
- **Regex-based YAML parsing:** Always use a proper parser (yaml library)
- **Storing code examples as separate files:** Inline in YAML is simpler, keeps context together

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML parsing | Custom parser | `yaml` library | Edge cases (multiline, escaping, anchors) |
| Schema validation | if/else checks | Zod schemas | Type inference, error messages, composability |
| File globbing | fs.readdir recursion | `glob` library | Cross-platform, ignore patterns, performance |
| Front matter parsing | Regex extraction | `gray-matter` | Handles edge cases, delimiter variations |

**Key insight:** YAML parsing has many edge cases (multiline strings, special characters, anchors/aliases). The `yaml` library handles all of these; hand-rolling leads to bugs.

## Common Pitfalls

### Pitfall 1: Schema Validation at Read Time Only
**What goes wrong:** Invalid patterns get saved, discovered later when loading fails
**Why it happens:** Only validating when reading patterns, not when writing
**How to avoid:** Validate with Zod before every write operation
**Warning signs:** TypeScript errors when loading patterns, runtime crashes

### Pitfall 2: Category/Tag Inconsistency
**What goes wrong:** Same concept tagged differently ("button", "buttons", "btn")
**Why it happens:** No controlled vocabulary, free-form tagging
**How to avoid:** Use Zod enum for categories, provide tag suggestions in documentation
**Warning signs:** Search returns incomplete results, duplicate patterns

### Pitfall 3: Multiline YAML String Issues
**What goes wrong:** Code examples lose formatting, unexpected newlines
**Why it happens:** YAML multiline syntax is subtle (|, >, |-, >-, etc.)
**How to avoid:** Use `|` (literal block scalar) for code, preserve newlines exactly
**Warning signs:** Code examples have wrong indentation when rendered

### Pitfall 4: Large Index Memory Usage
**What goes wrong:** Slow startup, memory bloat
**Why it happens:** Loading all patterns into memory on startup
**How to avoid:** Lazy loading - build index on first query, not on startup
**Warning signs:** Noticeable delay when skill first invoked

## Code Examples

Verified patterns from official sources:

### Loading and Validating a Pattern
```typescript
// Source: Zod docs + yaml library
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { PatternSchema, type Pattern } from './schema/pattern.schema';

async function loadPattern(filePath: string): Promise<Pattern> {
  const content = await readFile(filePath, 'utf-8');
  const parsed = parse(content);
  return PatternSchema.parse(parsed); // Throws ZodError if invalid
}
```

### Saving a Pattern with Validation
```typescript
// Source: Zod docs + yaml library
import { stringify } from 'yaml';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { PatternSchema, type Pattern } from './schema/pattern.schema';

async function savePattern(pattern: Pattern, filePath: string): Promise<void> {
  // Validate BEFORE writing
  PatternSchema.parse(pattern);

  await mkdir(dirname(filePath), { recursive: true });
  const yamlContent = stringify(pattern);
  await writeFile(filePath, yamlContent, 'utf-8');
}
```

### Tag-Based Search
```typescript
// Simple in-memory search
import { glob } from 'glob';

async function searchByTags(tags: string[]): Promise<Pattern[]> {
  const files = await glob('.knowledge/patterns/**/*.yaml');
  const patterns = await Promise.all(files.map(loadPattern));

  return patterns.filter(pattern =>
    tags.every(tag => pattern.tags.includes(tag))
  );
}
```

### Category-Based Filtering
```typescript
async function getPatternsByCategory(category: string): Promise<Pattern[]> {
  const files = await glob(`.knowledge/patterns/${category}/*.yaml`);
  return Promise.all(files.map(loadPattern));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JSON Schema | Zod schemas | ~2022 | TypeScript-first, no schema duplication |
| js-yaml | yaml (eemeli) | ~2020 | Better TS support, YAML 1.2 |
| Callback file I/O | fs/promises | Node 14+ | Cleaner async code |
| Manual globbing | glob library | Always | Cross-platform reliability |

**Deprecated/outdated:**
- `js-yaml` still works but `yaml` has better TypeScript support
- JSON Schema with ajv works but requires separate type definitions

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal tag vocabulary**
   - What we know: Categories are defined (Layout, Forms, etc.)
   - What's unclear: Which tags should be controlled vs free-form
   - Recommendation: Start with free-form, add controlled vocabulary in v2 if inconsistency becomes a problem

2. **Search performance threshold**
   - What we know: Simple filtering works for 10-100 patterns
   - What's unclear: At what scale does MiniSearch become necessary?
   - Recommendation: Start simple, add search library only if performance degrades

## Sources

### Primary (HIGH confidence)
- [Zod GitHub](https://github.com/colinhacks/zod) - Schema definition, validation, TypeScript inference
- [yaml npm](https://www.npmjs.com/package/yaml) - YAML parsing documentation
- [gray-matter GitHub](https://github.com/jonschlinkert/gray-matter) - Front matter parsing

### Secondary (MEDIUM confidence)
- [MiniSearch](https://github.com/lucaong/minisearch) - In-memory search if needed at scale
- [TypeScript YAML parsing article](https://medium.com/@sangimed/typescript-parsing-a-yaml-file-the-right-way-0240b75917af) - Best practices

### Tertiary (LOW confidence)
- General knowledge base organization patterns - applied to file-based systems

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Zod and yaml are well-established, widely used
- Architecture: HIGH - File-based pattern storage is proven approach
- Pitfalls: MEDIUM - Based on general YAML/validation experience

**Research date:** 2026-02-02
**Valid until:** 60 days (stable domain, libraries don't change rapidly)
