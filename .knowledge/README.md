# KUI Design Knowledge Base

This directory contains the pattern knowledge base, code generation engine, and extraction pipeline.

## Directory Structure

```
.knowledge/
├── schema/                 # Type definitions and validation
│   ├── pattern.schema.ts   # Zod schema for patterns
│   └── categories.ts       # Category and framework constants
├── lib/                    # Core library functions
│   ├── storage.ts          # Pattern CRUD operations
│   ├── search.ts           # Search and filtering
│   ├── cache.ts            # Index caching
│   └── index.ts            # Public exports
├── patterns/               # Pattern YAML files (by category)
│   ├── layout/
│   ├── forms/
│   ├── navigation/
│   ├── micro-interactions/
│   ├── data-display/
│   ├── feedback/
│   └── authentication/
├── generator/              # Code generation engine
│   ├── templates/          # Handlebars templates
│   └── generator.ts        # Generation logic
├── extractor/              # Website analysis pipeline
│   ├── css-analyzer.ts     # CSS pattern detection
│   ├── dom-analyzer.ts     # DOM structure analysis
│   └── pipeline.ts         # Full extraction pipeline
└── integration/            # Integration components
    ├── suggestion-engine.ts # Context-aware suggestions
    ├── context-analyzer.ts  # Task analysis
    └── quality-gate.ts      # Pattern validation
```

## Pattern Categories

| Category | Description | Example Patterns |
|----------|-------------|------------------|
| `layout` | Page structure and grids | Hero section, masonry grid, timeline |
| `forms` | Input components | Floating labels, validation states |
| `navigation` | Navigation components | Sticky header, dropdown, hamburger |
| `micro-interactions` | Small animations | Hover effects, typewriter, parallax |
| `data-display` | Data visualization | Tables, cards, badges |
| `feedback` | User feedback | Loaders, progress bars, toasts |
| `authentication` | Auth flows | Login forms |

## Pattern File Format

Each pattern is a YAML file with the following structure:

```yaml
# Required fields
name: "Pattern Name"                    # 3-100 characters
category: layout                        # One of the valid categories
tags: [tag1, tag2, tag3]               # Searchable keywords
frameworks: [react, vue, svelte, vanilla]
principles:
  - "Design principle explaining the why"
  - "Another principle"

# Optional but recommended
accessibility:
  level: AA                            # WCAG level
  notes: "Accessibility considerations"

source:
  url: https://example.com
  extracted: "2026-02-02"

documentation:
  description: "What this pattern does (10-500 chars)"
  usage: "When to use this pattern"
  parameters:
    - name: paramName
      type: string
      default: "defaultValue"          # Must be string
      description: "What this controls"
  best_practices:
    - "Best practice 1"
    - "Best practice 2"

framework_compatibility:
  react: "18+"                         # Version string
  vue: "3+"
  svelte: "4+"
  vanilla: true                        # Boolean for vanilla

code_examples:
  react: |
    // Full React implementation
  vue: |
    <!-- Full Vue SFC -->
  svelte: |
    <!-- Full Svelte component -->
  vanilla: |
    /* HTML */
    /* CSS */
    /* JavaScript */
```

## Usage Examples

### Loading Patterns

```typescript
import { loadPattern, listPatterns } from './lib/storage';

// List all pattern files
const files = await listPatterns();
// => ['.knowledge/patterns/layout/hero-section.yaml', ...]

// List by category
const layoutFiles = await listPatterns('layout');

// Load a pattern
const pattern = await loadPattern(files[0]);
console.log(pattern.name, pattern.principles);
```

### Searching Patterns

```typescript
import { searchPatterns } from './lib/search';

// By tags
const hoverPatterns = await searchPatterns({ tags: ['hover'] });

// By category
const layouts = await searchPatterns({ category: 'layout' });

// By framework
const reactOnly = await searchPatterns({ framework: 'react' });

// Combined
const results = await searchPatterns({
  category: 'micro-interactions',
  tags: ['animation'],
  framework: 'react'
});
```

### Getting Suggestions

```typescript
import { suggestPatterns } from './integration/suggestion-engine';

const suggestions = await suggestPatterns({
  text: 'I need a loading indicator',
  framework: 'react',
  limit: 3,
  minRelevance: 0.3
});

// Returns:
// [
//   { pattern: {...}, relevance: 0.65, reason: "matches feedback category" },
//   ...
// ]
```

### Cache Management

```typescript
import { invalidateCache, getIndex } from './lib/cache';

// Invalidate cache (after adding patterns)
invalidateCache();

// Get pattern index for fast lookups
const index = await getIndex();
console.log(index.byCategory.get('layout')); // Set of pattern IDs
```

## Adding New Patterns

1. **Create the YAML file** in the appropriate category folder
2. **Follow the schema** - all required fields must be present
3. **Include all framework examples** - React, Vue, Svelte, vanilla
4. **Validate the pattern**:
   ```typescript
   import { loadPattern } from './lib/storage';
   const pattern = await loadPattern('path/to/pattern.yaml');
   ```
5. **Invalidate cache** after adding

## Validation Rules

The schema enforces:

- `name`: 3-100 characters
- `category`: Must be one of the defined categories
- `tags`: At least 1 tag
- `frameworks`: At least 1 framework
- `principles`: At least 1 principle
- `documentation.description`: 10-500 characters
- `documentation.parameters[].default`: Must be string type
- `framework_compatibility.react/vue/svelte`: String (version)
- `framework_compatibility.vanilla`: Boolean

## Pattern Quality Guidelines

Good patterns should have:

- **3+ principles** explaining the design decisions
- **3+ tags** for discoverability
- **Complete code examples** that work standalone
- **Accessibility notes** for inclusive design
- **Best practices** to guide usage
- **Source URL** if extracted from a website
