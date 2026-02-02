# KUI Design Skill

## What This Is

A Claude Code skill that generates beautiful, elegant, sleek UI by applying curated design patterns learned from analyzing hand-picked websites. Unlike Claude's general training on thousands of sites of varying quality, this skill draws from a curated knowledge base to prevent generic, templatic output.

## Core Value

Beautiful, elegant, sleek, working UI

## Current State (v1.0 Shipped)

**Shipped:** 2026-02-02
**Codebase:** 3,486 lines TypeScript, 14 patterns, 4 frameworks
**Tech Stack:** Zod, Handlebars, Playwright, CSSTree, Cheerio

**Capabilities:**
- `:generate [pattern]` — Generate framework-specific code from stored patterns
- `:analyze [url]` — Extract design patterns from website URLs
- `:suggest [context]` — Get context-aware pattern recommendations

**Performance:**
- Pattern lookup: 0.06ms (target was <100ms)
- 14 curated patterns across 7 categories
- Full documentation with multi-framework code examples

## Requirements

### Validated

- Analyze websites and extract design patterns (`:analyze` sub-command) — v1.0
- Store patterns in hybrid format (principles + code examples) — v1.0
- Apply patterns when building UI (main skill invocation) — v1.0
- Context-aware behavior (brainstorming vs building vs reviewing) — v1.0
- Multi-framework support (React, Vue, Svelte, vanilla JS) — v1.0
- Cover animation patterns (transitions, motion design, timing, choreography) — v1.0
- Cover scroll behaviors (parallax, scroll-triggered animations, smooth scrolling) — v1.0
- Cover layout systems (grids, spacing rhythms, responsive breakpoints, composition) — v1.0
- Cover interactive micro-interactions (hover, click feedback, state transitions) — v1.0
- Knowledge management capabilities (organize, search, update patterns) — v1.0
- Pattern discovery assistance (identify what's worth extracting) — v1.0
- Auto-enhancement integration (invoked automatically during frontend work) — v1.0

### Active

(None — v1.0 complete, awaiting next milestone definition)

### Out of Scope

- Backend integration — focuses on frontend aesthetics only, not API/database logic
- Accessibility tooling — won't generate a11y reports or WCAG compliance analysis (can be added later)
- Component framework generation — won't create full component libraries or design systems, focuses on applying patterns to specific builds

## Context

**Environment:**
- Integrates with GSD (Get Shit Done) workflow and conventions
- Works as a Claude Code skill with sub-commands
- Pattern storage in `.knowledge/patterns/` with YAML + Zod validation

**Philosophy:**
- Quality over quantity: hand-picked sites ensure high design standards
- Curated knowledge prevents Claude from defaulting to generic patterns
- Patterns should be framework-agnostic in principle, adaptable in implementation

**User Workflow:**
1. User builds frontend → skill suggests relevant patterns via `:suggest`
2. User finds inspiring site → `/kui-design:analyze` extracts patterns
3. Patterns stored in knowledge base → available for future builds via `:generate`

## Constraints

- **Integration**: Must work seamlessly with GSD workflow and conventions
- **Performance**: Fast execution - pattern lookups and generation should be quick, not slow down development
- **Tech stack**: Multi-framework (React, Vue, Svelte, vanilla JS, etc.) - patterns must be adaptable
- **Storage**: Patterns stored locally in skill codebase, no external dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid knowledge format (principles + code) | Provides both understanding (why patterns work) and practical implementation (how to use them) | ✓ Good — patterns have both principles and code_examples |
| Auto-enhancement mode | Automatically invoked during frontend work rather than manual each time - seamless integration | ✓ Good — documented in hooks/frontend-enhance.md |
| Context-aware behavior | Adapts based on whether user is brainstorming, building, or reviewing - more intelligent assistance | ✓ Good — suggestion engine analyzes task context |
| Multi-framework support | Design patterns transcend specific frameworks - should work anywhere | ✓ Good — React, Vue, Svelte, vanilla all supported |
| In-memory cache for performance | File-based search too slow at scale, O(1) lookups needed | ✓ Good — 0.06ms vs 100ms target |
| Quality gates as advisory | Blocking on quality would frustrate extraction, advisory provides feedback | ✓ Good — scores patterns without blocking |
| Playwright for browser automation | Handles SPAs, captures computed styles, full JS rendering | ✓ Good — works with modern sites |
| Handlebars for templates | Simple, established, no JSX complexity needed | ✓ Good — clean code generation |

---
*Last updated: 2026-02-02 after v1.0 milestone*
