---
name: suggest
description: Get context-aware pattern suggestions based on what you're building. Analyzes your task description and recommends relevant design patterns with relevance scores and reasoning.
---

# :suggest Command

Get pattern suggestions based on what you're building.

## Usage

```
/kui-design:suggest [task description]
```

## Examples

```bash
# Describe what you're building
/kui-design:suggest I need to build a login form with validation

# Get layout suggestions
/kui-design:suggest hero section with responsive grid

# Feedback patterns
/kui-design:suggest loading states and error handling

# Navigation patterns
/kui-design:suggest navbar with dropdown menu
```

## Workflow

### 1. Analyze Context

Parse the task description to identify relevant categories:

```typescript
import { suggestPatterns } from '.knowledge/integration';

const suggestions = await suggestPatterns({
  text: userDescription,
  framework: await detectFramework(), // Optional: auto-detect project framework
  limit: 5,
  minRelevance: 0.3,
});
```

### 2. Present Suggestions

Display suggestions with relevance scores and reasoning:

```
Pattern Suggestions for "login form with validation"

1. [80%] Login Form
   Category: authentication | Tags: login, form, auth
   Why: matches authentication category; tags match: login, form
   Frameworks: react, vue, svelte, vanilla

2. [80%] Form Validation States
   Category: forms | Tags: validation, error, success
   Why: matches forms category; tags match: form, validation
   Frameworks: react, vue, svelte, vanilla

3. [50%] Floating Label Input
   Category: forms | Tags: input, floating-label, animation
   Why: matches forms category
   Frameworks: react, vue, svelte, vanilla

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To generate code from a pattern:
  /kui-design:generate [pattern name or search terms]
```

### 3. Handle No Matches

If no patterns match the context:

```
No patterns found matching "quantum encryption dashboard"

Try:
- Use more specific terms (form, nav, button, card)
- List all patterns: /kui-design:generate --list
- Add patterns: /kui-design:analyze [url]
```

## Options

- `--category <name>` — Filter to specific category
- `--framework <name>` — Filter by framework compatibility
- `--limit <n>` — Number of suggestions (default: 5)
- `--min-relevance <n>` — Minimum relevance threshold 0-1 (default: 0.3)

## Categories

Available categories for filtering:

- **forms** — Inputs, validation, form patterns
- **navigation** — Navbars, menus, breadcrumbs
- **layout** — Grids, containers, sections
- **data-display** — Tables, cards, stats
- **feedback** — Loading, toasts, alerts
- **micro-interactions** — Hover, transitions, animations
- **authentication** — Login forms, auth flows

## Relevance Scoring

Suggestions are ranked by relevance:

| Factor | Points |
|--------|--------|
| Category match | +50% |
| Tag overlap (each) | +15% |
| Framework match | +10% |

Minimum threshold: 30% (configurable with --min-relevance)

## Integration with :generate

After finding a relevant pattern, use :generate to get the code:

```bash
# Get suggestions
/kui-design:suggest hero section

# Generate code for a specific pattern
/kui-design:generate hero section layout
```

## Keywords Detected

The analyzer recognizes these keywords to identify categories:

**Forms:** form, input, select, checkbox, validation, submit, field
**Navigation:** nav, navbar, menu, breadcrumb, sidebar, header, tabs
**Layout:** grid, flex, container, section, hero, column, responsive
**Data Display:** table, list, card, stat, chart, badge, avatar
**Feedback:** loading, spinner, skeleton, toast, alert, progress
**Micro-interactions:** hover, transition, animation, click, effect
**Authentication:** login, signup, register, password, auth
