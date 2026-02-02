---
name: kui-design
description: Generate beautiful UI code from curated design patterns. Use this skill when the user asks to "generate a component", "get pattern code", "find UI pattern", or wants to apply design patterns to their frontend work. Provides pattern-based code generation with framework auto-detection.
version: 0.1.0
---

# KUI Design

Generate beautiful, elegant UI code from curated design patterns.

## Overview

KUI Design maintains a knowledge base of high-quality design patterns extracted from hand-picked websites. Unlike generic AI code generation, patterns come from curated sources ensuring beautiful, production-ready output.

## When This Skill Applies

This skill activates when the user's request involves:
- Generating UI component code from patterns
- Finding design patterns for specific UI elements
- Applying curated design principles to frontend work
- Getting code snippets for layouts, forms, navigation, etc.

## Available Sub-Commands

- **:generate** — Search patterns and generate framework-specific code
- **:analyze** — Extract design patterns from a website URL
- **:suggest** — Get context-aware pattern suggestions based on task description

## Pattern Categories

- **layout** — Grid systems, flexbox, responsive layouts
- **forms** — Inputs, validation, form patterns
- **navigation** — Navbars, menus, breadcrumbs
- **micro-interactions** — Hover effects, transitions, feedback
- **data-display** — Tables, cards, stats
- **feedback** — Toasts, loaders, skeletons
- **authentication** — Login forms, auth flows

## Framework Support

Auto-detects project framework from package.json:
- React (JSX/TSX)
- Vue (SFC)
- Svelte
- Vanilla (CSS/HTML)

## Knowledge Base

Patterns stored in `.knowledge/patterns/` with:
- Design principles (the "why")
- Code examples (the "how")
- Accessibility notes
- Framework compatibility

## Pattern Extraction

When using :analyze, the extraction pipeline:
1. Renders page with Playwright (full JS execution)
2. Extracts computed CSS styles and stylesheets
3. Analyzes CSS for animations, layouts, interactions
4. Analyzes DOM for component structure
5. Identifies patterns with AI assistance
6. Saves patterns to `.knowledge/patterns/{category}/`
7. Generates case study to `.knowledge/case-studies/`

## Workflow Integration

KUI Design integrates with frontend development workflows:

### Auto-Enhancement Mode

When configured in CLAUDE.md, KUI Design automatically suggests patterns during frontend work:
- Detects component types from task description
- Suggests relevant patterns with relevance scores
- Provides code generation on pattern selection

See `skills/kui-design/hooks/frontend-enhance.md` for setup instructions.

### Sub-Command Orchestration

The main skill routes to sub-commands based on user intent:

| Intent | Command | Example |
|--------|---------|---------|
| Get suggestions | :suggest | "What patterns for a form?" |
| Generate code | :generate | "Generate the login form" |
| Extract patterns | :analyze | "Analyze this website" |

### Integration with frontend-design Skill

When used alongside the frontend-design skill:
1. frontend-design establishes design direction
2. kui-design suggests patterns matching that aesthetic
3. Generated code follows both the pattern and design direction

Configure in CLAUDE.md to enable automatic pattern suggestions during frontend-design workflows.

## Quality Assurance

Patterns are validated on extraction and storage:
- Schema validation ensures correct structure
- Quality gates score completeness and coherence
- Issues are logged but don't block storage (advisory)

Quality factors checked:
- Minimum principles (3+)
- Minimum tags (2+)
- Code example length
- Category-tag coherence
