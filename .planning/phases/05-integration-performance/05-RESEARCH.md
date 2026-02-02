# Phase 5: Integration & Performance - Research

**Researched:** 2026-02-02
**Domain:** Claude Code skill integration, performance optimization, workflow automation
**Confidence:** HIGH (based on existing codebase analysis and Claude Code skill conventions)

## Summary

Phase 5 focuses on three main areas: (1) integrating KUI Design with the existing frontend-design skill workflow for auto-enhancement during frontend development, (2) optimizing pattern lookup performance to achieve sub-100ms p95 latency, and (3) implementing quality validation gates to maintain pattern integrity.

The existing codebase already has functional pattern storage (14 patterns), search operations, and code generation. The primary work involves:
- Creating a skill integration layer that hooks into the frontend-design workflow
- Building a context analyzer that recommends patterns based on current task
- Implementing an in-memory tag index for fast lookups (current search reads all YAML files)
- Adding quality validation beyond the existing Zod schema

**Primary recommendation:** Focus on lightweight integration patterns that leverage existing infrastructure rather than rebuilding.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zod | ^3.x | Schema validation | Already used for pattern validation |
| yaml | ^2.x | YAML parsing | Already used for pattern storage |
| glob | ^10.x | File pattern matching | Already used for pattern discovery |
| handlebars | ^4.x | Template compilation | Already used for code generation |

### Supporting (May Need to Add)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lru-cache | ^10.x | In-memory caching | For fast pattern lookup caching |
| chokidar | ^3.x | File watching | For cache invalidation on pattern changes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| In-memory index | SQLite/better-sqlite3 | Overkill for 14-100 patterns, adds complexity |
| File watching | Polling | Less responsive but simpler |
| LRU cache | Map | Map works fine for small dataset, LRU adds eviction |

**Installation:**
```bash
npm install lru-cache@10 chokidar@3
```

## Architecture Patterns

### Recommended Project Structure

The skill integration should follow Claude Code's skill conventions:

```
skills/kui-design/
├── SKILL.md              # Main skill definition (exists)
├── commands/
│   ├── generate.md       # :generate command (exists)
│   ├── analyze.md        # :analyze command (exists)
│   └── suggest.md        # NEW: :suggest command for context-aware suggestions
└── hooks/
    └── frontend-enhance.md  # NEW: Hook for frontend-design integration

.knowledge/
├── lib/
│   ├── index.ts          # Barrel export (add new exports)
│   ├── storage.ts        # Pattern CRUD (exists)
│   ├── search.ts         # Pattern search (exists)
│   └── cache.ts          # NEW: In-memory pattern index
├── integration/          # NEW: Integration module
│   ├── context-analyzer.ts  # Analyze current task context
│   ├── suggestion-engine.ts # Generate context-aware suggestions
│   └── quality-gates.ts     # Pattern quality validation
└── ...
```

### Pattern 1: Skill Integration via Hooks

**What:** Claude Code skills can be invoked by other skills through explicit references in SKILL.md

**When to use:** When one skill needs to enhance another skill's workflow

**Example:**

The frontend-design skill workflow is:
1. User asks to build UI
2. frontend-design analyzes context, commits to aesthetic
3. Implements code

KUI Design integrates by:
1. Being mentioned in frontend-design's SKILL.md or user's CLAUDE.md
2. Providing pattern suggestions when frontend-design is building
3. Auto-suggesting during specific phases (form building, navigation, etc.)

```markdown
# In ~/.claude/CLAUDE.md or project CLAUDE.md

When building frontend components, check if kui-design skill has relevant patterns:
- Before building forms, run `/kui-design:suggest forms`
- Before building navigation, run `/kui-design:suggest navigation`
- Before building layouts, run `/kui-design:suggest layout`
```

### Pattern 2: Context-Aware Suggestion Engine

**What:** Analyze current task to determine relevant pattern categories

**When to use:** When providing proactive pattern suggestions

**Example:**
```typescript
interface TaskContext {
  fileType: 'tsx' | 'vue' | 'svelte' | 'html' | 'css';
  componentName?: string;
  keywords: string[];  // Extracted from file content or task description
}

interface PatternSuggestion {
  pattern: Pattern;
  relevance: number;  // 0-1 score
  reason: string;     // Why this pattern matches
}

function analyzeContext(context: TaskContext): PatternSuggestion[] {
  // Map keywords to categories
  const categoryHints: Record<string, Category[]> = {
    'form': ['forms'],
    'input': ['forms'],
    'button': ['forms', 'micro-interactions'],
    'nav': ['navigation'],
    'menu': ['navigation'],
    'grid': ['layout'],
    'card': ['layout', 'data-display'],
    'table': ['data-display'],
    'loading': ['feedback'],
    'toast': ['feedback'],
    'login': ['authentication'],
  };

  // Score patterns by keyword match
  // Return top suggestions with explanations
}
```

### Pattern 3: In-Memory Pattern Index

**What:** Preload pattern metadata into memory with tag indexing for O(1) lookups

**When to use:** When search latency must be under 100ms

**Example:**
```typescript
interface PatternIndex {
  byId: Map<string, PatternMetadata>;
  byTag: Map<string, Set<string>>;       // tag -> pattern IDs
  byCategory: Map<Category, Set<string>>; // category -> pattern IDs
  byFramework: Map<Framework, Set<string>>;
}

// Build index on startup (or first access)
async function buildIndex(): Promise<PatternIndex> {
  const files = await listPatterns();
  const index: PatternIndex = {
    byId: new Map(),
    byTag: new Map(),
    byCategory: new Map(),
    byFramework: new Map(),
  };

  for (const file of files) {
    const pattern = await loadPattern(file);
    const id = pattern.name;

    // Index by ID
    index.byId.set(id, { file, ...extractMetadata(pattern) });

    // Index by tags
    for (const tag of pattern.tags) {
      if (!index.byTag.has(tag)) index.byTag.set(tag, new Set());
      index.byTag.get(tag)!.add(id);
    }

    // ... similar for category, framework
  }

  return index;
}

// Fast search using index
function searchIndexed(index: PatternIndex, options: SearchOptions): string[] {
  let results: Set<string> | null = null;

  if (options.tags) {
    for (const tag of options.tags) {
      const tagResults = index.byTag.get(tag.toLowerCase()) || new Set();
      results = results ? intersection(results, tagResults) : tagResults;
    }
  }

  // ... intersect with category, framework filters

  return Array.from(results || index.byId.keys());
}
```

### Pattern 4: Quality Gates

**What:** Multi-level validation beyond Zod schema

**When to use:** When storing new patterns (from extraction or manual creation)

**Quality levels:**
1. **Schema validation** (existing) - Structure is correct
2. **Completeness check** - All expected fields have meaningful content
3. **Code quality** - Generated code compiles, follows best practices
4. **Pattern coherence** - Principles align with code examples

**Example:**
```typescript
interface QualityResult {
  level: 'passed' | 'warning' | 'failed';
  score: number;  // 0-100
  issues: QualityIssue[];
}

interface QualityIssue {
  field: string;
  severity: 'error' | 'warning';
  message: string;
}

async function validateQuality(pattern: Pattern): Promise<QualityResult> {
  const issues: QualityIssue[] = [];

  // Completeness checks
  if (pattern.principles.length < 3) {
    issues.push({
      field: 'principles',
      severity: 'warning',
      message: 'Patterns should have at least 3 principles',
    });
  }

  if (!pattern.documentation?.description || pattern.documentation.description.length < 50) {
    issues.push({
      field: 'documentation.description',
      severity: 'warning',
      message: 'Description should be at least 50 characters',
    });
  }

  // Code example checks
  if (pattern.code_examples) {
    for (const [framework, code] of Object.entries(pattern.code_examples)) {
      if (code && code.length < 100) {
        issues.push({
          field: `code_examples.${framework}`,
          severity: 'warning',
          message: `${framework} code example seems too short`,
        });
      }
    }
  }

  const score = calculateScore(issues);
  return {
    level: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
    score,
    issues,
  };
}
```

### Anti-Patterns to Avoid

- **Over-engineering the cache:** For 14-100 patterns, a simple Map is fine. Don't add Redis or SQLite.
- **Blocking startup:** Build index asynchronously, return cached results while building.
- **Tight coupling to frontend-design:** Use loose integration via CLAUDE.md hooks, not direct code dependencies.
- **Premature optimization:** Measure actual latency before adding complexity.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| In-memory caching | Custom Map wrapper | lru-cache | Handles eviction, TTL, size limits |
| File watching | setInterval polling | chokidar | Cross-platform, efficient, handles edge cases |
| Keyword extraction | Regex patterns | Existing pattern.tags | Tags already capture searchable keywords |
| Framework detection | New detector | Existing detectFramework() | Already implemented in generator |

**Key insight:** The existing codebase is well-structured. Phase 5 adds integration layers, not rewrites.

## Common Pitfalls

### Pitfall 1: Synchronous Index Building Blocks Startup

**What goes wrong:** Loading 100+ YAML files synchronously delays skill availability.
**Why it happens:** Assuming small dataset stays small.
**How to avoid:** Build index lazily on first search, cache in memory.
**Warning signs:** Skill takes >1s to respond on first invocation.

### Pitfall 2: Cache Invalidation on Pattern Changes

**What goes wrong:** Index becomes stale when patterns are added/modified.
**Why it happens:** No file watching or manual cache invalidation.
**How to avoid:** Use chokidar to watch .knowledge/patterns/ directory.
**Warning signs:** Newly added patterns don't appear in search.

### Pitfall 3: Over-Suggesting Patterns

**What goes wrong:** Interrupting workflow with irrelevant suggestions.
**Why it happens:** Aggressive matching on common keywords.
**How to avoid:** High relevance threshold (>0.7), limit to top 3 suggestions.
**Warning signs:** User ignores or disables suggestions.

### Pitfall 4: GSD Integration Breaking Skill Isolation

**What goes wrong:** KUI Design expects GSD context that doesn't exist in standalone use.
**Why it happens:** Tight coupling to GSD workflow.
**How to avoid:** Skill should work standalone AND enhance GSD workflows.
**Warning signs:** Errors when running outside GSD context.

### Pitfall 5: Quality Gates Too Strict

**What goes wrong:** Valid patterns rejected due to overly strict rules.
**Why it happens:** Treating warnings as errors.
**How to avoid:** Separate levels (error blocks, warning informs), allow override.
**Warning signs:** Extraction produces no patterns due to quality failures.

## Code Examples

Verified patterns from existing codebase:

### Current Search Implementation (to be optimized)
```typescript
// Source: .knowledge/lib/search.ts
export async function searchPatterns(options: SearchOptions): Promise<Pattern[]> {
  // Currently reads all files, then filters
  const files = options.category
    ? await listPatterns(options.category)
    : await listPatterns();

  if (files.length === 0) {
    return [];
  }

  let patterns = await Promise.all(files.map(loadPattern));

  if (options.tags && options.tags.length > 0) {
    patterns = patterns.filter((pattern) =>
      options.tags!.every((tag) =>
        pattern.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    );
  }

  if (options.framework) {
    patterns = patterns.filter((pattern) =>
      pattern.frameworks.includes(options.framework!)
    );
  }

  return patterns;
}
```

### Optimized Search with Index
```typescript
// Source: New implementation for .knowledge/lib/cache.ts
import { LRUCache } from 'lru-cache';

// Full pattern cache (for returning complete patterns)
const patternCache = new LRUCache<string, Pattern>({ max: 100 });

// Index cache (rebuilt when patterns change)
let index: PatternIndex | null = null;
let indexBuilding = false;

export async function getIndex(): Promise<PatternIndex> {
  if (index) return index;
  if (indexBuilding) {
    // Wait for in-progress build
    while (indexBuilding) await new Promise(r => setTimeout(r, 10));
    return index!;
  }

  indexBuilding = true;
  index = await buildIndex();
  indexBuilding = false;
  return index;
}

export async function searchFast(options: SearchOptions): Promise<Pattern[]> {
  const idx = await getIndex();
  const ids = searchIndexed(idx, options);

  // Load full patterns (cached)
  const patterns: Pattern[] = [];
  for (const id of ids) {
    let pattern = patternCache.get(id);
    if (!pattern) {
      const meta = idx.byId.get(id)!;
      pattern = await loadPattern(meta.file);
      patternCache.set(id, pattern);
    }
    patterns.push(pattern);
  }

  return patterns;
}
```

### Context Analysis for Suggestions
```typescript
// Source: New implementation for .knowledge/integration/context-analyzer.ts
const CATEGORY_KEYWORDS: Record<string, Category[]> = {
  // Forms
  'form': ['forms'],
  'input': ['forms'],
  'select': ['forms'],
  'checkbox': ['forms'],
  'radio': ['forms'],
  'textarea': ['forms'],
  'validation': ['forms'],
  'submit': ['forms'],

  // Navigation
  'nav': ['navigation'],
  'menu': ['navigation'],
  'breadcrumb': ['navigation'],
  'sidebar': ['navigation'],
  'header': ['navigation'],
  'footer': ['navigation'],

  // Layout
  'grid': ['layout'],
  'flex': ['layout'],
  'container': ['layout'],
  'section': ['layout'],
  'hero': ['layout'],
  'column': ['layout'],

  // Data Display
  'table': ['data-display'],
  'list': ['data-display'],
  'card': ['data-display', 'layout'],
  'stat': ['data-display'],
  'chart': ['data-display'],

  // Feedback
  'loading': ['feedback'],
  'spinner': ['feedback'],
  'skeleton': ['feedback'],
  'toast': ['feedback'],
  'alert': ['feedback'],
  'notification': ['feedback'],

  // Micro-interactions
  'hover': ['micro-interactions'],
  'transition': ['micro-interactions'],
  'animation': ['micro-interactions'],
  'click': ['micro-interactions'],

  // Authentication
  'login': ['authentication'],
  'signup': ['authentication'],
  'password': ['authentication'],
  'auth': ['authentication'],
};

export function extractCategories(text: string): Category[] {
  const words = text.toLowerCase().split(/\W+/);
  const categories = new Set<Category>();

  for (const word of words) {
    const matches = CATEGORY_KEYWORDS[word];
    if (matches) {
      matches.forEach(c => categories.add(c));
    }
  }

  return Array.from(categories);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vector databases for search | Tag-based indexing | 2024+ | Simpler for small datasets, no embedding overhead |
| Monolithic skills | Sub-command skills | Claude Code 2.x | Better composability and isolation |
| Manual skill invocation | CLAUDE.md workflow hooks | 2025+ | Automatic enhancement in workflows |

**Deprecated/outdated:**
- Using SQLite for <1000 records - in-memory is faster and simpler
- Complex NLP for keyword extraction - simple keyword matching is sufficient

## Open Questions

Things that couldn't be fully resolved:

1. **Frontend-design skill integration mechanism**
   - What we know: Skills can be mentioned in CLAUDE.md for workflow integration
   - What's unclear: Exact syntax for conditional skill invocation
   - Recommendation: Create CLAUDE.md template with hooks, test empirically

2. **Pattern quality scoring weights**
   - What we know: Need to balance completeness, code quality, coherence
   - What's unclear: Optimal weights for each factor
   - Recommendation: Start with equal weights, tune based on feedback

3. **Index rebuild trigger**
   - What we know: Need to invalidate cache when patterns change
   - What's unclear: File watching overhead vs polling frequency
   - Recommendation: Use chokidar with debounce (1s), fallback to rebuild on search miss

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `.knowledge/lib/search.ts`, `.knowledge/schema/pattern.schema.ts`
- Claude Code skill conventions: `skills/kui-design/SKILL.md`, `/Users/khairul/.claude/skills/kdesign.md`
- Frontend-design plugin: `/Users/khairul/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/`

### Secondary (MEDIUM confidence)
- LRU cache patterns: npm lru-cache documentation
- File watching patterns: chokidar npm documentation

### Tertiary (LOW confidence)
- Quality gate scoring: No established standard, needs empirical validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing project dependencies
- Architecture: HIGH - Based on Claude Code skill conventions
- Performance optimization: MEDIUM - 100ms target needs validation
- Quality gates: LOW - Scoring weights need tuning

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - stable domain)
