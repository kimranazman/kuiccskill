# Roadmap: KUI Design Skill

## Overview

This roadmap delivers a Claude Code skill that generates beautiful UI by applying curated design patterns from hand-picked websites. Starting with pattern storage foundation and manual curation to establish quality baselines, we progress through code generation (React/Tailwind first), automated pattern extraction via AI analysis, multi-framework expansion, and finally integration with GSD workflows plus performance optimization at scale.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Pattern Storage Foundation** - Knowledge base structure with validated YAML patterns
- [x] **Phase 2: Code Generation Engine** - Generate React code from stored patterns with framework detection
- [x] **Phase 3: Pattern Extraction** - AI-powered analysis extracts patterns from websites automatically
- [x] **Phase 4: Multi-Framework & Documentation** - Vue, Svelte, vanilla JS support with comprehensive docs
- [ ] **Phase 5: Integration & Performance** - GSD workflow integration, auto-enhancement, and scale optimization

## Phase Details

### Phase 1: Pattern Storage Foundation
**Goal**: Establish knowledge base structure with high-quality seed patterns and validation
**Depends on**: Nothing (first phase)
**Requirements**: STOR-01, STOR-02, STOR-03, STOR-04, STOR-05, STOR-06
**Success Criteria** (what must be TRUE):
  1. Patterns stored in `.knowledge/patterns/` with valid YAML structure
  2. Tag-based search returns patterns matching category and tag criteria
  3. YAML validation prevents invalid patterns from being saved
  4. 10-20 seed patterns exist across 5+ categories (Layout, Forms, Navigation, Micro-interactions, Data Display)
  5. Each pattern includes metadata: name, category, tags, framework compatibility, accessibility notes
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Schema foundation (Zod schema, directory structure, dependencies)
- [x] 01-02-PLAN.md — Storage operations (CRUD, validation, search functions)
- [x] 01-03-PLAN.md — Seed patterns (14 patterns across all 7 categories)

### Phase 2: Code Generation Engine
**Goal**: Generate framework-specific code from patterns with auto-detection
**Depends on**: Phase 1
**Requirements**: GEN-01, GEN-02, GEN-03, GEN-06, GEN-07, GEN-08, GEN-09, INT-02, INT-03
**Success Criteria** (what must be TRUE):
  1. User runs `:generate` sub-command and receives syntax-highlighted React code from selected pattern
  2. Framework detection automatically identifies React projects via package.json analysis
  3. Generated code copies to clipboard with confirmation feedback
  4. Template system generates framework-agnostic patterns using Handlebars
  5. Code preview displays before copying to allow user review
**Plans**: 5 plans

Plans:
- [x] 02-01-PLAN.md — Framework detection (detect React/Vue/Svelte/vanilla from package.json)
- [x] 02-02-PLAN.md — Handlebars templates (React, Vue, Svelte, vanilla code generation templates)
- [x] 02-03-PLAN.md — Code generator core (template compilation, pattern context building)
- [x] 02-04-PLAN.md — Output system (syntax highlighting, clipboard copy with feedback)
- [x] 02-05-PLAN.md — Skill integration (KUI Design skill with :generate sub-command)

### Phase 3: Pattern Extraction
**Goal**: Automatically extract design patterns from website HTML/CSS via AI analysis
**Depends on**: Phase 2
**Requirements**: EXTR-01, EXTR-02, EXTR-03, EXTR-04, EXTR-05, EXTR-06, EXTR-07, EXTR-08, EXTR-09
**Success Criteria** (what must be TRUE):
  1. User provides URL via `:analyze` sub-command and receives extracted pattern YAML file
  2. DOM parser converts HTML structure into pattern components automatically
  3. CSS parser extracts styling rules and transforms into pattern format
  4. Extraction identifies animation patterns (transitions, keyframes, timing functions)
  5. Extraction identifies scroll behaviors (parallax, scroll-triggered effects)
  6. Extraction identifies layout systems (grid, spacing, responsive breakpoints)
  7. Extraction identifies micro-interactions (hover states, click feedback, transitions)
  8. Case study Markdown documentation generated with design rationale
  9. Extracted patterns validated against YAML schema before storage
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md — Browser automation (Playwright page fetching, computed styles extraction)
- [x] 03-02-PLAN.md — CSS analyzer (CSSTree parsing, animation/layout/interaction detection)
- [x] 03-03-PLAN.md — DOM analyzer (HTML structure analysis, component identification)
- [x] 03-04-PLAN.md — Pattern identifier (AI-powered pattern recognition, YAML generation)
- [x] 03-05-PLAN.md — Case study generator (Markdown documentation with design rationale)
- [x] 03-06-PLAN.md — Skill integration (:analyze sub-command, orchestration)

### Phase 4: Multi-Framework & Documentation
**Goal**: Expand framework support and complete pattern documentation
**Depends on**: Phase 3
**Requirements**: GEN-04, GEN-05, DOC-01, DOC-02, DOC-03, DOC-04, QUAL-03
**Success Criteria** (what must be TRUE):
  1. User can generate Vue code from any stored pattern
  2. User can generate vanilla JS/CSS from any stored pattern
  3. Each pattern includes usage documentation with parameter descriptions
  4. Each pattern includes code examples for React, Vue, and vanilla implementations
  5. Framework compatibility metadata tracks supported versions (React 18+, Vue 3+)
  6. Case studies document design rationale and best practices for each pattern
**Plans**: 5 plans

Plans:
- [x] 04-01-PLAN.md — Schema extension (documentation fields, framework compatibility)
- [x] 04-02-PLAN.md — Enhanced templates (Vue, Svelte, vanilla production-quality)
- [x] 04-03-PLAN.md — Layout/navigation patterns (documentation + multi-framework examples)
- [x] 04-04-PLAN.md — Forms/feedback patterns (documentation + multi-framework examples)
- [x] 04-05-PLAN.md — Remaining patterns (micro-interactions, data-display, authentication)

### Phase 5: Integration & Performance
**Goal**: Seamless GSD integration with auto-enhancement and optimized performance
**Depends on**: Phase 4
**Requirements**: INT-01, INT-04, INT-05, INT-06, INT-07, INT-08, QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. Skill auto-invoked during frontend work via GSD workflow integration
  2. Context-aware suggestions recommend patterns based on current task (building form vs navigation)
  3. Pattern lookup completes in under 100ms at p95 latency
  4. Tag indexing enables fast search without vector database overhead
  5. Main skill orchestrates sub-skills with context forking (analyze/generate isolation)
  6. Validation gates prevent degraded patterns from being stored
  7. Pattern quality baseline maintained through automated quality checks
**Plans**: 5 plans

Plans:
- [ ] 05-01-PLAN.md — In-memory pattern cache (fast indexed search, <100ms lookups)
- [ ] 05-02-PLAN.md — Quality validation gates (completeness checks, scoring system)
- [ ] 05-03-PLAN.md — Context-aware suggestion engine (keyword analysis, relevance ranking)
- [ ] 05-04-PLAN.md — Suggest command (:suggest sub-command with pattern recommendations)
- [ ] 05-05-PLAN.md — Workflow integration (frontend-design hooks, CLAUDE.md configuration)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Pattern Storage Foundation | 3/3 | Complete | 2026-02-02 |
| 2. Code Generation Engine | 5/5 | Complete | 2026-02-02 |
| 3. Pattern Extraction | 6/6 | Complete | 2026-02-02 |
| 4. Multi-Framework & Documentation | 5/5 | Complete | 2026-02-02 |
| 5. Integration & Performance | 0/5 | Planned | - |
