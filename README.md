# KUI Design Skill

A Claude Code skill that generates beautiful, elegant UI code from curated design patterns.

## Overview

KUI Design maintains a knowledge base of high-quality design patterns extracted from hand-picked websites. Unlike generic AI code generation, patterns come from curated sources ensuring beautiful, production-ready output.

## Features

- **32 curated design patterns** across 7 categories
- **Multi-framework support**: React, Vue, Svelte, Vanilla JS
- **Pattern extraction pipeline** for analyzing websites
- **Smart suggestion engine** based on task context
- **Code generation** with framework auto-detection

## Installation

### As a Claude Code Skill

```bash
# Clone the repository
git clone https://github.com/kimranazman/kuiccskill.git

# Create symlink to Claude skills directory
ln -s "$(pwd)/skills/kui-design" ~/.claude/skills/kui-design
```

### Dependencies

```bash
npm install
```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `/kui-design` | Main skill entry point |
| `/kui-design:generate` | Generate code from patterns |
| `/kui-design:analyze` | Extract patterns from a website |
| `/kui-design:suggest` | Get pattern suggestions for a task |

### Example: Generate a Component

```
/kui-design:generate

> What pattern do you need?
> "dropdown menu with animation"

> Framework detected: React
> Generating Animated Dropdown Menu...
```

### Example: Analyze a Website

```
/kui-design:analyze https://example.com

> Analyzing page...
> Found 5 patterns:
> - Hero section with parallax
> - Animated navigation
> - Card grid layout
> ...
```

## Pattern Categories

| Category | Patterns | Description |
|----------|----------|-------------|
| **layout** | 9 | Grid systems, hero sections, masonry, timelines |
| **micro-interactions** | 9 | Hover effects, animations, transitions |
| **navigation** | 5 | Headers, menus, dropdowns, hamburger |
| **feedback** | 5 | Loaders, progress, toasts, skeletons |
| **data-display** | 4 | Tables, cards, badges, comparisons |
| **forms** | 2 | Inputs, validation states |
| **authentication** | 1 | Login forms |

## Project Structure

```
.
├── .knowledge/              # Pattern knowledge base
│   ├── schema/              # Zod schemas and types
│   ├── lib/                 # Storage, search, cache
│   ├── patterns/            # Pattern YAML files
│   ├── generator/           # Code generation engine
│   ├── extractor/           # Website analysis pipeline
│   └── integration/         # Quality gates, suggestions
├── skills/
│   └── kui-design/          # Claude Code skill
│       ├── SKILL.md         # Main skill definition
│       ├── commands/        # Sub-commands
│       └── hooks/           # Auto-enhancement hooks
└── Websites/                # Downloaded sites for analysis
```

## Pattern Schema

Patterns are stored as YAML files with the following structure:

```yaml
name: Pattern Name
category: layout|forms|navigation|micro-interactions|data-display|feedback|authentication
tags:
  - searchable
  - tags
frameworks:
  - react
  - vue
  - svelte
  - vanilla
principles:
  - Design principle 1
  - Design principle 2
accessibility:
  level: AA
  notes: Accessibility considerations
documentation:
  description: What this pattern does
  usage: When to use it
  parameters:
    - name: paramName
      type: string
      default: "value"
      description: What it controls
  best_practices:
    - Best practice 1
code_examples:
  react: |
    // React implementation
  vue: |
    <!-- Vue implementation -->
  svelte: |
    <!-- Svelte implementation -->
  vanilla: |
    /* HTML/CSS/JS implementation */
```

## API Reference

### Storage

```typescript
import { loadPattern, listPatterns, savePattern } from '.knowledge/lib/storage';

// List all patterns
const files = await listPatterns();

// Load a specific pattern
const pattern = await loadPattern('.knowledge/patterns/layout/hero-section.yaml');

// Save a new pattern
await savePattern(patternData);
```

### Search

```typescript
import { searchPatterns } from '.knowledge/lib/search';

// Search by tags
const results = await searchPatterns({ tags: ['hover', 'animation'] });

// Filter by category
const layouts = await searchPatterns({ category: 'layout' });

// Filter by framework
const reactPatterns = await searchPatterns({ framework: 'react' });
```

### Suggestions

```typescript
import { suggestPatterns } from '.knowledge/integration/suggestion-engine';

// Get suggestions for a task
const suggestions = await suggestPatterns({
  text: 'I need a dropdown menu with animation',
  framework: 'react',
  limit: 5
});
```

## Pattern Sources

Patterns have been extracted from:

- **opalcamera.com** - Product showcase, carousels, hero sections
- **mindmarket.com** - Animations, layouts, timelines
- **kprverse.com** - Micro-interactions, terminal UI, hover effects

## Development

### Adding New Patterns

1. Create a YAML file in `.knowledge/patterns/{category}/`
2. Follow the pattern schema
3. Include code examples for all frameworks
4. Run validation: `npx tsx -e "import { loadPattern } from './.knowledge/lib/storage'; ..."`

### Extracting Patterns from Websites

1. Download the website HTML to `Websites/`
2. Run `/kui-design:analyze` or use the extractor directly
3. Review and refine extracted patterns
4. Save to `.knowledge/patterns/`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or improve patterns
4. Submit a pull request

---

Built with Claude Code
