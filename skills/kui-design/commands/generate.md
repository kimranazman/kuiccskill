---
name: generate
description: Generate code from a design pattern. Searches patterns, lets user select, generates framework-specific code with syntax highlighting, and copies to clipboard.
---

# :generate Command

Generate framework-specific code from curated design patterns.

## Usage

```
/kui-design:generate [search terms]
```

## Workflow

### 1. Search Patterns

Search the pattern knowledge base using provided terms or prompt user for search:

```typescript
import { searchPatterns, filterByCategory, filterByFramework } from '.knowledge/lib';

// Search by tags
const results = await searchPatterns({
  tags: ['grid', 'responsive'],
  category: 'layout'  // optional
});
```

### 2. Present Results

Display matching patterns with numbered selection:

```
Found 3 patterns matching "grid responsive":

1. CSS Grid System
   Category: layout | Tags: grid, responsive, 12-column
   Frameworks: react, vue, svelte, vanilla

2. Responsive Card Grid
   Category: layout | Tags: grid, cards, responsive
   Frameworks: react, vue, svelte, vanilla

3. Flexbox Centering
   Category: layout | Tags: flexbox, centering, responsive
   Frameworks: react, vue, svelte, vanilla

Select pattern (1-3):
```

### 3. Detect Framework

Auto-detect project framework from package.json:

```typescript
import { detectFramework } from '.knowledge/generator';

const framework = await detectFramework();
// Returns: 'react' | 'vue' | 'svelte' | 'vanilla'
```

### 4. Generate Code

Compile pattern through framework template:

```typescript
import { generateCode, outputCode } from '.knowledge/generator';

const code = generateCode(selectedPattern, framework);
await outputCode(code, framework);
```

### 5. Output

Display syntax-highlighted code preview and copy to clipboard:

```
──────────────────────────────────────────────────
/**
 * CSS Grid System
 *
 * Design Principles:
 * - Use CSS Grid for two-dimensional layouts
 * - Define explicit grid areas for complex layouts
 * ...
 */

const Grid = ({ children, cols = 12 }) => (
  <div className={`grid grid-cols-${cols} gap-4`}>
    {children}
  </div>
);
──────────────────────────────────────────────────
Copied to clipboard
```

## Options

- `--framework <name>` — Override auto-detected framework
- `--category <name>` — Filter search to specific category
- `--list` — List all available patterns

## Examples

```bash
# Search and generate
/kui-design:generate button hover

# Filter by category
/kui-design:generate --category forms input

# Force specific framework
/kui-design:generate --framework vue card

# List all patterns
/kui-design:generate --list
```

## Error Handling

- No patterns found: Suggest broader search or list categories
- Clipboard unavailable: Display code for manual copy
- Framework not detected: Default to vanilla, suggest specifying
