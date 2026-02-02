# Architecture Research

**Domain:** Claude Code Skills with Design Pattern Knowledge Systems
**Researched:** 2026-02-02
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  Main Skill     │  │  Sub-Skill      │  │  Sub-Skill      │         │
│  │  (Orchestrator) │  │  :analyze       │  │  :generate      │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │ invokes            │ invokes            │                   │
├───────────┴────────────────────┴────────────────────┴───────────────────┤
│                         CORE ENGINE LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │  Analysis Engine     │  │  Generation Engine   │  │  Framework   │  │
│  │  (Pattern Extract)   │  │  (Code Synthesis)    │  │  Adapter     │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └──────┬───────┘  │
│             │                         │                      │           │
│             │ writes                  │ reads                │ transforms│
│             ↓                         ↓                      ↓           │
├─────────────────────────────────────────────────────────────────────────┤
│                       KNOWLEDGE BASE LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Pattern Knowledge Base                       │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │     │
│  │  │  Patterns    │  │  Case Studies│  │  Examples    │         │     │
│  │  │  (YAML/MD)   │  │  (Markdown)  │  │  (Code)      │         │     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │     │
│  └────────────────────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────────────┤
│                    INTEGRATION LAYER (GSD)                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │  GSD Hooks    │  │  Subagents    │  │  Project      │               │
│  │  Integration  │  │  (Context7)   │  │  Context      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Main Skill (Orchestrator) | Routes user requests, invokes sub-skills, coordinates workflow | SKILL.md with routing logic and invocation |
| Sub-Skill :analyze | Pattern extraction from websites, DOM analysis, CSS parsing | SKILL.md with WebFetch/Bash tools, context: fork |
| Sub-Skill :generate | Code generation from stored patterns, multi-framework output | SKILL.md with Read/Write tools, template system |
| Analysis Engine | Extracts design patterns from live websites using AST/DOM parsing | Python/JS scripts bundled with skill |
| Generation Engine | Synthesizes code from pattern templates with framework adapters | Template engine + code generator scripts |
| Framework Adapter | Transforms generic patterns to framework-specific code | Adapter pattern with React/Vue/Svelte/vanilla variants |
| Pattern Knowledge Base | Local markdown/YAML storage of pattern library | `.knowledge/patterns/` directory structure |
| Case Studies | Detailed markdown documentation of pattern sources | `.knowledge/case-studies/` markdown files |
| GSD Integration | Hooks into GSD workflow for automatic pattern application | GSD hooks, project detection |

## Recommended Project Structure

```
skill/
├── .claude/
│   └── skills/
│       ├── design-patterns/                  # Main skill directory
│       │   ├── SKILL.md                       # Main orchestrator skill
│       │   ├── scripts/                       # Supporting scripts
│       │   │   ├── analyze.py                 # Website analysis engine
│       │   │   ├── generate.py                # Code generation engine
│       │   │   └── adapters/                  # Framework adapters
│       │   │       ├── react.py
│       │   │       ├── vue.py
│       │   │       └── vanilla.py
│       │   └── templates/                     # Code templates
│       │       ├── animation.template
│       │       ├── layout.template
│       │       └── component.template
│       ├── design-patterns:analyze/           # Sub-skill for analysis
│       │   ├── SKILL.md                       # Analysis workflow
│       │   └── scripts/
│       │       ├── scrape.js                  # DOM scraper
│       │       └── extract-patterns.py        # Pattern extractor
│       └── design-patterns:generate/          # Sub-skill for generation
│           └── SKILL.md                       # Generation workflow
├── .knowledge/                                 # Pattern knowledge base
│   ├── patterns/                              # Structured pattern library
│   │   ├── animations/
│   │   │   ├── mask-reveal.yaml               # Pattern definition
│   │   │   ├── hover-transform.yaml
│   │   │   └── scroll-trigger.yaml
│   │   ├── layouts/
│   │   │   ├── grid-system.yaml
│   │   │   └── fluid-spacing.yaml
│   │   └── components/
│   │       ├── button.yaml
│   │       └── card.yaml
│   ├── case-studies/                          # Source documentation
│   │   ├── kprverse-animations.md
│   │   ├── mind-market-design.md
│   │   └── opal-tadpole-product.md
│   └── examples/                              # Reference implementations
│       ├── react/
│       ├── vue/
│       └── vanilla/
└── docs/
    ├── patterns-guide.md                      # Usage documentation
    └── architecture.md                        # This document
```

### Structure Rationale

- **`.claude/skills/`**: Claude Code standard location for skills. Main skill + sub-skills pattern enables modular orchestration
- **`scripts/`**: Bundled executable code for heavy-lifting (analysis, generation) separate from skill instructions
- **`.knowledge/`**: Separate knowledge base directory keeps pattern data distinct from skill logic, enables versioning and sharing
- **`patterns/*.yaml`**: YAML format for structured pattern definitions with metadata, enables validation and query
- **`case-studies/*.md`**: Rich markdown documentation preserves context and rationale for patterns
- **`templates/`**: Reusable code templates with variable substitution for generation engine
- **`adapters/`**: Framework-specific transformation logic implements adapter pattern

## Architectural Patterns

### Pattern 1: Main Skill + Sub-Skills Orchestration

**What:** Main skill acts as router/orchestrator, delegates to specialized sub-skills using naming convention (`skill:subskill`)

**When to use:** When a skill has multiple distinct workflows that shouldn't all load into context simultaneously

**Trade-offs:**
- ✅ Modular, focused sub-skills with clear responsibilities
- ✅ Context efficiency - only load relevant sub-skill
- ✅ Easier to maintain and extend
- ❌ Requires orchestration logic in main skill
- ❌ More files to manage

**Example:**
```yaml
---
# Main skill: design-patterns/SKILL.md
name: design-patterns
description: Store and apply design patterns from beautiful websites
---

# Design Patterns Skill

Routes to specialized sub-skills based on task.

## Sub-Skills Available

- **:analyze** - Extract patterns from websites
- **:generate** - Generate code from stored patterns

## Routing Logic

**Pattern Analysis Keywords:** "analyze", "extract", "scrape", "study"
→ Invoke `design-patterns:analyze`

**Code Generation Keywords:** "generate", "create", "build", "apply pattern"
→ Invoke `design-patterns:generate`

**Browse/Query Keywords:** "show patterns", "list", "what patterns"
→ Read and display from `.knowledge/patterns/`
```

### Pattern 2: Knowledge Base Separation

**What:** Pattern storage lives outside skill directory in dedicated `.knowledge/` directory

**When to use:** When pattern library grows beyond a few dozen patterns, or when patterns should be shared/versioned independently

**Trade-offs:**
- ✅ Clear separation of concerns (code vs data)
- ✅ Easier to version control pattern library separately
- ✅ Enables pattern sharing across projects
- ✅ Simpler skill updates without touching data
- ❌ Two directories to manage
- ❌ Skills must reference external path

**Example:**
```yaml
---
# Sub-skill: design-patterns:analyze/SKILL.md
name: design-patterns:analyze
description: Extract design patterns from website
context: fork
agent: Explore
allowed-tools: Bash(python *), Write
disable-model-invocation: true
---

# Pattern Analysis Workflow

Analyze $ARGUMENTS and extract design patterns.

## Process

1. Run analysis script: `python ~/.claude/skills/design-patterns/scripts/analyze.py $ARGUMENTS`
2. Extract patterns to YAML format
3. Write to `.knowledge/patterns/[category]/[pattern-name].yaml`
4. Update case study in `.knowledge/case-studies/[site-name].md`

## Pattern YAML Schema

```yaml
name: pattern-name
category: animations|layouts|components
source: website-url
description: What this pattern does
code:
  html: |
    <div>...</div>
  css: |
    .element { ... }
  js: |
    // Optional JavaScript
frameworks:
  - vanilla
  - react
  - vue
performance: 1-5 rating
accessibility: notes
```
```

### Pattern 3: Framework Adapter Pipeline

**What:** Generic pattern definitions transformed through framework-specific adapters during generation

**When to use:** Supporting multiple frameworks from single pattern source

**Trade-offs:**
- ✅ Single source of truth for patterns
- ✅ Framework support extends without duplicating patterns
- ✅ Adapters encapsulate framework-specific logic
- ❌ Adapter complexity increases with framework differences
- ❌ Generic patterns may not leverage framework-specific features

**Example:**
```python
# scripts/adapters/react.py
class ReactAdapter:
    """Transform generic pattern to React component."""

    def transform(self, pattern: dict) -> str:
        """Generate React component from pattern."""
        return f"""
import React from 'react';

export function {pattern['name'].title().replace('-', '')}() {{
  return (
    <div className="{pattern['name']}">
      {self._transform_html(pattern['code']['html'])}
    </div>
  );
}}

// Styles
const styles = `
{pattern['code']['css']}
`;
"""

    def _transform_html(self, html: str) -> str:
        """Convert HTML to JSX."""
        # className transformation, camelCase attributes, etc.
        return html.replace('class=', 'className=')
```

### Pattern 4: Sub-Skill Context Forking

**What:** Sub-skills run in isolated subagent context using `context: fork`

**When to use:** For heavy operations (analysis, research) that shouldn't pollute main conversation context

**Trade-offs:**
- ✅ Isolated execution preserves main context
- ✅ Can use different agent types (Explore for research)
- ✅ Parallel execution possible
- ❌ No access to conversation history
- ❌ Results must be summarized back
- ❌ Slightly higher latency

**Example:**
```yaml
---
# design-patterns:analyze/SKILL.md
name: design-patterns:analyze
context: fork
agent: Explore
allowed-tools: Bash(python *), Write, Read
---

Research and extract patterns from $ARGUMENTS:

1. Use WebFetch or Bash to analyze website
2. Run pattern extraction: `python scripts/extract-patterns.py $ARGUMENTS`
3. Write patterns to `.knowledge/patterns/`
4. Summarize findings with pattern names and categories
```

### Pattern 5: Dynamic Context Injection

**What:** Use `!`command`` syntax to inject live data into skill prompt before Claude sees it

**When to use:** When skill needs current state (existing patterns, project config) at invocation time

**Trade-offs:**
- ✅ Skill sees actual current state, not stale data
- ✅ No manual context preparation
- ✅ Works with any shell command
- ❌ Command must execute quickly (blocks skill loading)
- ❌ Command failures prevent skill execution

**Example:**
```yaml
---
name: design-patterns:generate
description: Generate code from stored patterns
---

# Current Pattern Library

Available patterns:
!`ls .knowledge/patterns/*/*.yaml | xargs -I {} basename {} .yaml`

Current project framework: !`cat package.json | jq -r '.dependencies | keys[]' | grep -E '^(react|vue|svelte)' | head -1`

## Your Task

Generate $ARGUMENTS using appropriate patterns from the library above.
```

### Pattern 6: Hybrid Knowledge Representation

**What:** Combine structured YAML (patterns) with rich Markdown (case studies) and code examples

**When to use:** When patterns need both machine-readable metadata and human-readable context

**Trade-offs:**
- ✅ YAML enables querying, validation, generation
- ✅ Markdown preserves rich context and rationale
- ✅ Code examples show real usage
- ✅ Best of all formats
- ❌ Three formats to maintain
- ❌ Consistency across formats required

**Example Structure:**
```
.knowledge/
├── patterns/animations/mask-reveal.yaml    # Structured definition
├── case-studies/kprverse-animations.md     # Rich context
└── examples/react/MaskReveal.jsx           # Working code
```

**YAML Pattern:**
```yaml
name: mask-reveal
category: animations
source: https://kprverse.com
description: Nested mask-based directional reveal using GPU transforms
performance: 5
accessibility: prefers-reduced-motion support required
frameworks: [vanilla, react, vue, svelte]
code:
  html: |
    <div class="mask-wrapper">
      <div class="mask-inner">
        <h1>Content</h1>
      </div>
    </div>
  css: |
    .mask-wrapper {
      overflow: hidden;
    }
    .mask-inner {
      transform: translateY(100%);
      transition: transform 0.6s ease;
    }
    .revealed .mask-inner {
      transform: translateY(0);
    }
```

**Markdown Case Study:**
```markdown
# KPRverse Animation System

Source: https://kprverse.com

## Mask-Based Reveals

KPRverse uses a nested mask pattern for all entrance animations...

### Why It Works
- GPU-accelerated transforms
- Directional flexibility
- Proven at scale (20+ instances)
...
```

## Data Flow

### Pattern Analysis Flow

```
User Request → Main Skill → :analyze Sub-Skill
    ↓
[Context Fork: Explore Agent]
    ↓
WebFetch/Bash → Website DOM
    ↓
analyze.py → AST/CSS Parsing
    ↓
Pattern Extraction → YAML Generation
    ↓
Write to .knowledge/patterns/[category]/[name].yaml
    ↓
Update .knowledge/case-studies/[site].md
    ↓
Return Summary → Main Conversation
```

### Pattern Generation Flow

```
User Request → Main Skill → :generate Sub-Skill
    ↓
!`ls patterns` → Inject Available Patterns
    ↓
Read Pattern YAML → Load Pattern Definition
    ↓
Detect Framework → Project package.json/config
    ↓
Select Adapter → Framework-specific transformer
    ↓
generate.py + adapter → Code Synthesis
    ↓
Apply Template → Insert pattern code
    ↓
Framework Transformation → React/Vue/Svelte/vanilla
    ↓
Write Code → Project files
    ↓
Return Implementation → Main Conversation
```

### Pattern Query Flow

```
User: "What patterns exist for animations?"
    ↓
Main Skill (no sub-skill needed)
    ↓
!`find .knowledge/patterns/animations -name "*.yaml"` → List patterns
    ↓
Read YAML files → Pattern metadata
    ↓
Format Response → Display patterns with descriptions
```

### Key Data Flows

1. **Website → Knowledge Base:** Analysis engine extracts patterns from DOM/CSS → YAML storage
2. **Knowledge Base → Code:** Generation engine reads YAML → Adapter transforms → Framework code
3. **User → Sub-Skill:** Main skill routes request → Sub-skill handles specialized workflow
4. **Sub-Skill → Main:** Forked context returns summary → Main conversation continues

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-50 patterns | Single `.knowledge/patterns/` directory, simple YAML files, inline scripts |
| 50-200 patterns | Category subdirectories, pattern indexing, separate script files, basic caching |
| 200+ patterns | Database or search index, pattern tagging/metadata, async generation, CDN for examples |

### Scaling Priorities

1. **First bottleneck:** Pattern discovery becomes slow with 100+ files
   - **Fix:** Add pattern index (`.knowledge/patterns/INDEX.yaml`) with metadata
   - **Fix:** Category-based organization with subdirectories
   - **Fix:** Tag-based search instead of filesystem traversal

2. **Second bottleneck:** Generation latency with complex patterns
   - **Fix:** Cache generated code by pattern + framework combination
   - **Fix:** Pre-compile templates for common patterns
   - **Fix:** Parallel generation for multiple patterns

3. **Third bottleneck:** Skill context size with many patterns
   - **Fix:** Lazy-load patterns only when needed
   - **Fix:** Pattern descriptions in main skill, full YAML only in sub-skills
   - **Fix:** Use `context: fork` for pattern-heavy operations

## Anti-Patterns

### Anti-Pattern 1: Monolithic Skill File

**What people do:** Put all logic (analysis, generation, pattern storage) in single SKILL.md

**Why it's wrong:**
- Entire skill loads into context even for simple queries
- Hard to maintain as skill grows
- Mixing concerns makes debugging difficult
- Can't run analysis and generation in parallel

**Do this instead:** Use main skill + sub-skills architecture with clear separation

### Anti-Pattern 2: Hard-Coded Patterns in Skill

**What people do:** Embed pattern code directly in SKILL.md instructions

**Why it's wrong:**
- Skill file grows unbounded
- Can't share patterns across skills/projects
- Hard to update patterns without editing skill
- No structured querying possible

**Do this instead:** External `.knowledge/` directory with YAML pattern definitions

### Anti-Pattern 3: Framework-Specific Pattern Duplication

**What people do:** Create separate pattern files for React, Vue, Svelte versions

**Why it's wrong:**
- Maintenance nightmare (update pattern → update 4 files)
- Patterns drift out of sync
- Pattern library appears smaller than it is
- Violates DRY principle

**Do this instead:** Generic pattern YAML + framework adapters for transformation

### Anti-Pattern 4: No Pattern Validation

**What people do:** Write patterns as free-form markdown or unstructured YAML

**Why it's wrong:**
- Can't validate pattern completeness
- Generation code fragile to missing fields
- No schema enforcement
- Inconsistent pattern quality

**Do this instead:** Define YAML schema, validate patterns on write, enforce required fields

### Anti-Pattern 5: Ignoring Existing Patterns

**What people do:** Generate code without checking if pattern already exists

**Why it's wrong:**
- Duplicates effort
- Inconsistent implementations
- Misses proven patterns
- Knowledge base underutilized

**Do this instead:** Always query knowledge base first, use `!`command`` to inject available patterns

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Websites (analysis) | WebFetch + scraping | Rate limiting required, respect robots.txt |
| Package managers | Bash(npm/yarn/pnpm) | Detect framework from package.json |
| Git | Bash(git *) | Track pattern library changes |
| Context7 | MCP tool | Verify pattern compatibility with library docs |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Main Skill ↔ Sub-Skills | Skill tool invocation | Arguments via `$ARGUMENTS`, results via return |
| Skill ↔ Scripts | Bash tool execution | Scripts output JSON/YAML for parsing |
| Scripts ↔ Knowledge Base | File I/O (Read/Write) | YAML for patterns, Markdown for case studies |
| Generation ↔ Adapters | Python imports | Adapter pattern with common interface |
| Skill ↔ GSD | Hooks, project detection | Auto-apply patterns in GSD execute phases |

### GSD Integration Opportunities

**Hooks for Pattern Application:**
```yaml
# In main skill SKILL.md
hooks:
  before_phase_execute:
    - Check if phase involves UI components
    - Query pattern library for relevant patterns
    - Suggest patterns before implementation
  after_phase_execute:
    - Scan implemented code for patterns
    - Offer to document new patterns if found
```

**Project Context Detection:**
```yaml
# Dynamic framework detection
context_detection: !`
  if [ -f package.json ]; then
    cat package.json | jq -r '.dependencies | keys[]' | grep -E '^(react|vue|svelte)' | head -1
  fi
`
```

## Build Order Recommendations

Based on dependencies between components, suggested implementation order:

### Phase 1: Foundation (Core Knowledge Base)
1. **`.knowledge/` directory structure** - Establish storage pattern
2. **Pattern YAML schema** - Define data model
3. **Sample patterns** - Seed with 3-5 initial patterns for testing

**Why first:** Other components depend on this structure

### Phase 2: Core Skill Structure
4. **Main skill orchestrator** - Routing and delegation logic
5. **Pattern query functionality** - Read and display patterns
6. **Manual pattern addition** - Write patterns without analysis

**Why second:** Enables manual use before automation

### Phase 3: Generation Engine
7. **Vanilla code generation** - Simplest case, no framework
8. **Template system** - Reusable code templates
9. **React adapter** - First framework support
10. **Vue/Svelte adapters** - Additional frameworks

**Why third:** Provides value (code generation) before complex analysis

### Phase 4: Analysis Engine
11. **:analyze sub-skill** - Analysis workflow
12. **DOM scraping script** - Extract HTML/CSS from websites
13. **Pattern extraction logic** - Convert DOM → YAML
14. **Case study generation** - Markdown documentation

**Why fourth:** Most complex component, builds on all previous

### Phase 5: Integration
15. **GSD hooks** - Auto-suggest patterns
16. **Framework detection** - Auto-select adapter
17. **Pattern validation** - Schema enforcement
18. **Caching/optimization** - Performance tuning

**Why last:** Refinement and integration with broader ecosystem

## Sources

### Official Claude Code Documentation
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Official skill structure, frontmatter, sub-skills, context forking
- [Extend Claude with skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) - Skill creation guide

### Claude Code Ecosystem
- [Claude Code customization guide](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/) - Skills vs commands vs subagents
- [Inside Claude Code Skills: Structure, prompts, invocation](https://mikhail.io/2025/10/claude-code-skills/) - Skill invocation patterns
- [awesome-claude-skills GitHub](https://github.com/travisvn/awesome-claude-skills) - Community patterns and examples

### Architecture Patterns
- [Software Architecture Patterns 2026](https://www.sayonetech.com/blog/software-architecture-patterns/) - Modern architecture patterns
- [Google's Multi-Agent Design Patterns](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/) - Agent orchestration patterns
- [Hexagonal Architecture](https://refactoring.guru/design-patterns/adapter) - Adapter pattern for multi-framework support

### Code Generation & AI
- [GenAI Development Workflow 2026](https://microservices.io/post/architecture/2026/01/29/about-idea-to-code.html) - AI-powered code generation patterns
- [AST Parsing at Scale](https://www.dropstone.io/blog/ast-parsing-tree-sitter-40-languages) - Code understanding via AST
- [OXC AST Parser MCP Server](https://skywork.ai/skypage/en/oxc-ast-parser-ai-engineer/1981245331309776896) - AI-driven code analysis

### Pattern Extraction & Analysis
- [Best Web Scraping Tools 2026](https://scrapfly.io/blog/posts/best-web-scraping-tools-in-2026) - Modern scraping architecture
- [Self-Correcting Parser Pattern](https://medium.com/@hasdata/how-to-build-an-e-commerce-scraper-that-survives-a-website-redesign-86216e96cbd9) - Adaptive pattern extraction
- [Pattern Matching-based scraping](https://www.researchgate.net/publication/344832472_Pattern_Matching-based_scraping_of_news_websites) - Academic approach

### Knowledge Base Architecture
- [Knowledge Base Architecture 2026 Guide](https://www.bolddesk.com/blogs/knowledge-base-architecture) - Storage and retrieval patterns
- [JSON Schema for File Systems](https://json-schema.org/learn/file-system) - Structured data modeling
- [MarkdownDB](https://github.com/datopian/markdowndb) - Markdown to structured database

---
*Architecture research for: Claude Code Skills with Design Pattern Knowledge Systems*
*Researched: 2026-02-02*
