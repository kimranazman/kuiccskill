---
name: analyze
description: Extract design patterns from a website URL. Analyzes HTML/CSS structure, identifies meaningful patterns, and saves them to the knowledge base with case study documentation.
---

# :analyze Command

Extract design patterns from a website using AI-powered analysis.

## Usage

```
/kui-design:analyze <url>
```

## Workflow

### 1. Fetch and Render Page

Use Playwright to render the target page with full JavaScript execution:

```typescript
import { fetchPage, extractComputedStyles, extractStylesheets } from '.knowledge/extractor';

const { page, browser } = await fetchPage(url);
const styles = await extractComputedStyles(page);
const stylesheets = await extractStylesheets(page);
const html = await page.content();
```

### 2. Analyze CSS Patterns

Parse stylesheets and extract pattern data:

```typescript
import { parseCss, extractAnimations, extractLayoutPatterns, extractInteractions } from '.knowledge/extractor';

const animations = [];
const layouts = [];
const interactions = [];

for (const stylesheet of stylesheets) {
  if (stylesheet.content) {
    const ast = parseCss(stylesheet.content);
    animations.push(...extractAnimations(ast));
    layouts.push(...extractLayoutPatterns(ast));
    interactions.push(...extractInteractions(ast));
  }
}
```

### 3. Analyze DOM Structure

Extract page structure and component hierarchy:

```typescript
import { extractHierarchy } from '.knowledge/extractor';

const domHierarchy = extractHierarchy(html);
```

### 4. Build Extraction Data

Combine all extraction results:

```typescript
import type { ExtractionData } from '.knowledge/extractor';

const extractionData: ExtractionData = {
  url,
  timestamp: new Date().toISOString(),
  styles,
  stylesheets,
  animations,
  layouts,
  interactions,
  domHierarchy
};
```

### 5. Identify Patterns

Use AI to identify meaningful patterns from extracted data:

```typescript
import { identifyPatterns, buildAnalysisContext } from '.knowledge/extractor';

const { context, prompts } = identifyPatterns(extractionData);

// Present context to Claude for pattern identification
// Claude analyzes and returns YAML patterns
// Parse and validate patterns against PatternSchema
```

### 6. Save Patterns

Validate and save patterns to knowledge base:

```typescript
import { savePattern } from '.knowledge/lib';
import { validatePattern } from '.knowledge/extractor';

for (const pattern of patterns) {
  const validated = validatePattern(pattern);
  if (validated) {
    const filePath = await savePattern(validated);
    console.log(`Saved: ${filePath}`);
  }
}
```

### 7. Generate Case Study

Create documentation for the extracted patterns:

```typescript
import { generateCaseStudy } from '.knowledge/extractor';
import { writeFile } from 'fs/promises';

const caseStudy = generateCaseStudy(extractionData, patterns);
const slug = new URL(url).hostname.replace(/\./g, '-');
const caseStudyPath = `.knowledge/case-studies/${slug}.md`;
await writeFile(caseStudyPath, caseStudy);
```

### 8. Output

Display summary of extraction results:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pattern Extraction Complete: {siteName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Source: {url}
Patterns Found: {count}

Categories:
- micro-interactions: 2 patterns
- layout: 1 pattern

Saved to:
- .knowledge/patterns/{category}/*.yaml
- .knowledge/case-studies/{hostname}.md

───────────────────────────────────────────────────────────────

Use /kui-design:generate to use these patterns.
```

## Options

- `--category <name>` — Focus extraction on specific category
- `--dry-run` — Preview patterns without saving
- `--no-case-study` — Skip case study generation

## Examples

```bash
# Basic extraction
/kui-design:analyze https://stripe.com

# Focus on specific category
/kui-design:analyze --category micro-interactions https://linear.app

# Preview without saving
/kui-design:analyze --dry-run https://vercel.com
```

## Error Handling

- **Invalid URL**: Show error message with usage hint
- **Page load timeout**: Suggest checking URL or network connection
- **No patterns found**: Suggest trying a different page or category
- **Validation errors**: Show which patterns failed validation and why
- **CORS issues**: Note that some external stylesheets may not be accessible

## Notes

- JavaScript-rendered content is captured (SPAs work)
- External stylesheets may not be accessible due to CORS
- Large sites may take 30-60 seconds to fully analyze
- Patterns are validated against PatternSchema before saving
- Close browser after extraction to free resources

## Technical Details

The extraction pipeline consists of:

1. **Browser Module** (`browser.ts`): Playwright-based page fetching and rendering
2. **CSS Analyzer** (`css-analyzer.ts`): CSSTree-based pattern detection
3. **DOM Analyzer** (`dom-analyzer.ts`): Cheerio-based structure analysis
4. **Pattern Identifier** (`pattern-identifier.ts`): AI context building and validation
5. **Case Study Generator** (`case-study.ts`): Markdown documentation generation

All modules are exported from `.knowledge/extractor/index.ts`.
