# Phase 3: Pattern Extraction - Research

**Researched:** 2026-02-02
**Domain:** Web scraping, CSS/HTML parsing, AI-powered pattern analysis
**Confidence:** MEDIUM

## Summary

Phase 3 implements automated pattern extraction from websites via the `:analyze` sub-command. The system needs to fetch web pages, parse HTML/CSS structure, identify design patterns (layouts, animations, micro-interactions), and output validated YAML files matching the existing pattern schema.

The recommended approach uses **Playwright** for browser automation (to capture computed styles and dynamic content), **CSSTree** for CSS parsing, and **Cheerio** for HTML structure analysis. AI analysis (Claude) interprets the extracted data to identify meaningful patterns.

**Primary recommendation:** Use Playwright to render pages and extract computed styles, then pipe structured data through Claude for pattern identification and YAML generation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| playwright | ^1.50+ | Browser automation, page rendering | Cross-browser, maintained by Microsoft, captures computed styles |
| csstree | ^3.0+ | CSS parsing and analysis | W3C spec compliant, fast, detailed AST |
| cheerio | ^1.0+ | HTML parsing (fallback/hybrid) | Fast, jQuery-like API, well-maintained |
| yaml | ^2.3+ | YAML serialization | Already used in Phase 1-2 for pattern storage |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| postcss | ^8.4+ | CSS transformation | When needing to modify CSS before analysis |
| zod | ^3.22+ | Schema validation | Already installed - validate extracted patterns |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright | Puppeteer | Puppeteer is Chrome-only, less cross-browser |
| CSSTree | PostCSS | PostCSS treats values as strings, less structured |
| Cheerio | JSDOM | JSDOM heavier, Cheerio sufficient for parsing |

**Installation:**
```bash
npm install playwright csstree
```

Note: `cheerio`, `yaml`, and `zod` already installed from Phase 1-2.

## Architecture Patterns

### Recommended Project Structure
```
.knowledge/
├── extractor/           # NEW - Pattern extraction module
│   ├── browser.ts       # Playwright page fetching
│   ├── css-analyzer.ts  # CSS parsing and style extraction
│   ├── dom-analyzer.ts  # HTML structure analysis
│   ├── pattern-identifier.ts  # AI-powered pattern detection
│   ├── case-study.ts    # Markdown documentation generator
│   └── index.ts         # Orchestrates extraction pipeline
├── generator/           # Existing - code generation
├── lib/                 # Existing - storage operations
├── patterns/            # Existing - pattern files
└── schema/              # Existing - Zod schemas
```

### Pattern 1: Browser-Based Extraction
**What:** Use Playwright to render the full page, then extract computed styles
**When to use:** Always - ensures dynamic content and CSS is captured
**Example:**
```typescript
// Source: Playwright docs
import { chromium } from 'playwright';

async function extractPageStyles(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  // Extract computed styles for all elements
  const styles = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    return Array.from(elements).map(el => ({
      tag: el.tagName,
      classes: Array.from(el.classList),
      computedStyles: {
        display: getComputedStyle(el).display,
        position: getComputedStyle(el).position,
        // ... relevant properties
      }
    }));
  });

  await browser.close();
  return styles;
}
```

### Pattern 2: CSS Rule Extraction
**What:** Parse stylesheets to find keyframes, transitions, grid definitions
**When to use:** When analyzing animation and layout patterns
**Example:**
```typescript
// Source: CSSTree docs
import * as csstree from 'csstree';

function extractAnimations(cssText: string) {
  const ast = csstree.parse(cssText);
  const animations: Animation[] = [];

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.name === 'keyframes') {
        // Extract keyframe definition
        animations.push(parseKeyframes(node));
      }
    }
  });

  return animations;
}
```

### Pattern 3: AI-Powered Analysis Pipeline
**What:** Feed structured extraction data to Claude for pattern identification
**When to use:** Converting raw CSS/HTML data into meaningful design patterns
**Example:**
```typescript
// Pass extracted data to Claude for interpretation
const extractedData = {
  layout: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' },
  animations: [{ name: 'fadeIn', duration: '0.3s' }],
  interactions: [{ trigger: ':hover', transform: 'scale(1.05)' }]
};

// Claude analyzes and generates YAML pattern
// (Invoked via skill execution context)
```

### Anti-Patterns to Avoid
- **Static HTML fetch only:** Misses JavaScript-rendered content and computed styles
- **Manual CSS string parsing:** Use proper AST parser (CSSTree) instead
- **Extracting everything:** Focus on patterns matching existing categories
- **Skipping validation:** Always validate against PatternSchema before storage

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS parsing | Regex patterns | CSSTree | Edge cases in CSS syntax are countless |
| Browser automation | HTTP fetch + JSDOM | Playwright | Need computed styles, dynamic content |
| Keyframe detection | String matching | CSSTree AST walk | Nested rules, vendor prefixes |
| Grid layout detection | Manual parsing | getComputedStyle | Browser resolves grid-template properly |

**Key insight:** CSS parsing has decades of edge cases. Use battle-tested parsers.

## Common Pitfalls

### Pitfall 1: Missing Computed Styles
**What goes wrong:** Static CSS analysis misses browser-computed values
**Why it happens:** CSS variables, calc(), responsive values only resolve at runtime
**How to avoid:** Always use Playwright + getComputedStyle for final values
**Warning signs:** Pattern has `var(--color)` instead of actual hex value

### Pitfall 2: SPA/Dynamic Content
**What goes wrong:** Page content loads after initial HTML
**Why it happens:** React/Vue apps render via JavaScript
**How to avoid:** Use `waitUntil: 'networkidle'` in Playwright navigation
**Warning signs:** Empty containers, missing elements

### Pitfall 3: Overly Generic Patterns
**What goes wrong:** Extracting `display: flex` as a "pattern"
**Why it happens:** No filtering for meaningful design patterns
**How to avoid:** AI analysis phase identifies significant patterns, not basic CSS
**Warning signs:** Patterns that are just CSS property values

### Pitfall 4: Cross-Origin Stylesheets
**What goes wrong:** Can't access CSS rules from external domains
**Why it happens:** CORS prevents reading cross-origin stylesheet content
**How to avoid:** Use Playwright's network interception or computed styles
**Warning signs:** `cssRules` returns null for external stylesheets

### Pitfall 5: Animation State Capture
**What goes wrong:** Missing animation definitions
**Why it happens:** Animations defined in external files or via JS
**How to avoid:** Intercept all stylesheet responses, use document.styleSheets
**Warning signs:** Elements have animation CSS but no keyframes found

## Code Examples

Verified patterns from official sources:

### Playwright Page Data Extraction
```typescript
// Source: Playwright docs
const page = await browser.newPage();
await page.goto(url);

// Get all stylesheets content
const stylesheets = await page.evaluate(() => {
  return Array.from(document.styleSheets)
    .filter(sheet => {
      try { return sheet.cssRules; } catch { return false; }
    })
    .map(sheet =>
      Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')
    );
});
```

### CSSTree Animation Extraction
```typescript
// Source: CSSTree GitHub examples
import * as csstree from 'csstree';

function findKeyframes(css: string) {
  const ast = csstree.parse(css);
  const keyframes: Record<string, string[]> = {};

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.name === 'keyframes' && node.prelude) {
        const name = csstree.generate(node.prelude);
        keyframes[name] = [];
        // Process keyframe blocks...
      }
    }
  });

  return keyframes;
}
```

### Pattern Schema Validation
```typescript
// Existing code - .knowledge/schema/pattern.schema.ts
import { PatternSchema } from '../schema/pattern.schema';

function validateExtractedPattern(data: unknown) {
  const result = PatternSchema.safeParse(data);
  if (!result.success) {
    console.error('Invalid pattern:', result.error.format());
    return null;
  }
  return result.data;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Puppeteer-only | Playwright | 2020+ | Better cross-browser, auto-wait |
| Manual CSS parsing | CSSTree/PostCSS | 2018+ | Reliable AST parsing |
| Static analysis | Computed styles | Always | Accurate runtime values |

**Deprecated/outdated:**
- CSSOM library: Marked unmaintained (April 2023), use CSSTree
- PhantomJS: Abandoned, use Playwright

## Open Questions

Things that couldn't be fully resolved:

1. **Scroll behavior detection**
   - What we know: Can detect `scroll-behavior: smooth` and IntersectionObserver usage
   - What's unclear: Reliably detecting custom parallax implementations
   - Recommendation: Focus on CSS-detectable patterns, note JS-based as "requires manual review"

2. **Pattern quality threshold**
   - What we know: Need to filter meaningful patterns from basic CSS
   - What's unclear: Exact criteria for "worth extracting"
   - Recommendation: Use AI judgment with prompts specifying quality bar

3. **Multi-element patterns**
   - What we know: Some patterns span multiple DOM elements
   - What's unclear: Best way to represent parent-child pattern relationships
   - Recommendation: Include context in extraction, let AI determine boundaries

## Sources

### Primary (HIGH confidence)
- [Playwright Documentation](https://playwright.dev/) - Browser automation, page evaluation
- [CSSTree GitHub](https://github.com/csstree/csstree) - CSS parsing API
- [MDN getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) - Computed styles

### Secondary (MEDIUM confidence)
- [Cheerio Documentation](https://cheerio.js.org/) - HTML parsing
- Web scraping best practices articles (verified with official docs)

### Tertiary (LOW confidence)
- Community patterns for CSS animation detection (needs validation during implementation)

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Playwright/CSSTree well-documented, integration approach needs validation
- Architecture: MEDIUM - Pipeline structure clear, exact interfaces TBD
- Pitfalls: HIGH - Well-documented browser automation challenges

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - stable domain)
