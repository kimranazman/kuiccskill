# KUI Design Skill

## What This Is

A Claude Code skill that generates beautiful, elegant, sleek UI by applying curated design patterns learned from analyzing hand-picked websites. Unlike Claude's general training on thousands of sites of varying quality, this skill draws from a curated knowledge base to prevent generic, templatic output.

## Core Value

Beautiful, elegant, sleek, working UI

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Analyze websites and extract design patterns (`:analyze` sub-command)
- [ ] Store patterns in hybrid format (principles + code examples)
- [ ] Apply patterns when building UI (main skill invocation)
- [ ] Context-aware behavior (brainstorming vs building vs reviewing)
- [ ] Multi-framework support (React, Vue, Svelte, vanilla JS)
- [ ] Cover animation patterns (transitions, motion design, timing, choreography)
- [ ] Cover scroll behaviors (parallax, scroll-triggered animations, smooth scrolling)
- [ ] Cover layout systems (grids, spacing rhythms, responsive breakpoints, composition)
- [ ] Cover interactive micro-interactions (hover, click feedback, state transitions)
- [ ] Knowledge management capabilities (organize, search, update patterns)
- [ ] Pattern discovery assistance (identify what's worth extracting)
- [ ] Auto-enhancement integration (invoked automatically during frontend work)

### Out of Scope

- Backend integration — focuses on frontend aesthetics only, not API/database logic
- Accessibility tooling — won't generate a11y reports or WCAG compliance analysis (can be added later)
- Component framework generation — won't create full component libraries or design systems, focuses on applying patterns to specific builds

## Context

**Environment:**
- Integrates with GSD (Get Shit Done) workflow and conventions
- Works as a Claude Code skill with sub-commands
- Already has source code from several hand-picked reference sites in codebase

**Philosophy:**
- Quality over quantity: hand-picked sites ensure high design standards
- Curated knowledge prevents Claude from defaulting to generic patterns
- Patterns should be framework-agnostic in principle, adaptable in implementation

**User Workflow:**
1. User builds frontend → skill auto-invoked to enhance design
2. User finds inspiring site → `/kui-design:analyze` extracts patterns
3. Patterns stored in knowledge base → available for future builds

## Constraints

- **Integration**: Must work seamlessly with GSD workflow and conventions
- **Performance**: Fast execution - pattern lookups and generation should be quick, not slow down development
- **Tech stack**: Multi-framework (React, Vue, Svelte, vanilla JS, etc.) - patterns must be adaptable
- **Storage**: Patterns stored locally in skill codebase, no external dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid knowledge format (principles + code) | Provides both understanding (why patterns work) and practical implementation (how to use them) | — Pending |
| Auto-enhancement mode | Automatically invoked during frontend work rather than manual each time - seamless integration | — Pending |
| Context-aware behavior | Adapts based on whether user is brainstorming, building, or reviewing - more intelligent assistance | — Pending |
| Multi-framework support | Design patterns transcend specific frameworks - should work anywhere | — Pending |

---
*Last updated: 2026-02-02 after initialization*
