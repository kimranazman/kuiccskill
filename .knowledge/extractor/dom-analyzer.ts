/**
 * DOM analysis module for extracting structural patterns from HTML.
 * Uses Cheerio to parse HTML and identify component hierarchies.
 */

import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';

// DOM element type for cheerio
type CheerioElement = ReturnType<CheerioAPI>[0] & {
  tagName?: string;
  attribs?: Record<string, string>;
};

/**
 * Component type classification.
 */
export type ComponentType = 'layout' | 'navigation' | 'form' | 'interactive' | 'content' | 'feedback';

/**
 * Represents a DOM component with its structure.
 */
export interface DomComponent {
  type: ComponentType;
  tag: string;
  selector: string;
  classes: string[];
  attributes: Record<string, string>;
  children: DomComponent[];
  depth: number;
}

/**
 * Analysis of page structure.
 */
export interface StructureAnalysis {
  hasHeader: boolean;
  hasNav: boolean;
  hasMain: boolean;
  hasFooter: boolean;
  hasSidebar: boolean;
  formCount: number;
  buttonCount: number;
  linkCount: number;
}

/**
 * Complete component hierarchy with structure analysis.
 */
export interface ComponentHierarchy {
  root: DomComponent | null;
  components: DomComponent[];
  structure: StructureAnalysis;
}

/**
 * Class patterns that indicate component types.
 */
const CLASS_PATTERNS: Record<ComponentType, RegExp[]> = {
  layout: [/container/i, /wrapper/i, /section/i, /hero/i, /grid/i, /row/i, /col/i],
  navigation: [/nav/i, /menu/i, /sidebar/i, /header/i, /footer/i, /breadcrumb/i],
  form: [/form/i, /input/i, /search/i, /login/i, /signup/i, /subscribe/i],
  interactive: [/btn/i, /button/i, /cta/i, /link/i, /toggle/i, /dropdown/i, /modal/i],
  content: [/card/i, /article/i, /post/i, /content/i, /text/i, /image/i, /media/i],
  feedback: [/alert/i, /toast/i, /notification/i, /message/i, /error/i, /success/i, /loading/i],
};

/**
 * Semantic tags mapped to component types.
 */
const SEMANTIC_TAGS: Record<string, ComponentType> = {
  header: 'navigation',
  nav: 'navigation',
  footer: 'navigation',
  aside: 'layout',
  main: 'layout',
  section: 'layout',
  article: 'content',
  form: 'form',
  button: 'interactive',
  a: 'interactive',
  input: 'form',
  select: 'form',
  textarea: 'form',
};

/**
 * Classifies an element based on its tag and classes.
 *
 * @param tag - The HTML tag name
 * @param classes - Array of CSS classes
 * @returns The component type
 */
function classifyElement(tag: string, classes: string[]): ComponentType {
  // Check semantic tags first
  if (SEMANTIC_TAGS[tag]) {
    return SEMANTIC_TAGS[tag];
  }

  // Check class patterns
  for (const cls of classes) {
    for (const [type, patterns] of Object.entries(CLASS_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(cls))) {
        return type as ComponentType;
      }
    }
  }

  // Default based on tag
  if (['div', 'section', 'article'].includes(tag)) {
    return 'layout';
  }

  return 'content';
}

/**
 * Builds a CSS selector for an element.
 *
 * @param element - The cheerio element
 * @param $ - The cheerio API
 * @returns CSS selector string
 */
function buildSelector(element: CheerioElement, $: CheerioAPI): string {
  const el = $(element);
  const tag = element.tagName?.toLowerCase() || 'unknown';

  const id = el.attr('id');
  if (id) {
    return `${tag}#${id}`;
  }

  const classes = (el.attr('class') || '').trim().split(/\s+/).filter(Boolean);
  if (classes.length > 0) {
    return `${tag}.${classes.slice(0, 2).join('.')}`;
  }

  return tag;
}

/**
 * Checks if an element is significant for component detection.
 *
 * @param element - The cheerio element
 * @param $ - The cheerio API
 * @returns Whether the element is significant
 */
function isSignificantElement(element: CheerioElement, $: CheerioAPI): boolean {
  const tag = element.tagName?.toLowerCase();
  if (!tag) return false;

  // Always include semantic elements
  if (SEMANTIC_TAGS[tag]) {
    return true;
  }

  // Include elements with meaningful classes
  const classes = ($(element).attr('class') || '').trim().split(/\s+/).filter(Boolean);
  if (classes.length > 0) {
    for (const patterns of Object.values(CLASS_PATTERNS)) {
      if (classes.some(cls => patterns.some(p => p.test(cls)))) {
        return true;
      }
    }
  }

  // Include divs with multiple children (likely containers)
  if (tag === 'div' && $(element).children().length >= 2) {
    return true;
  }

  return false;
}

/**
 * Analyzes the DOM structure of HTML content.
 *
 * @param html - The HTML content to analyze
 * @returns Structure analysis results
 */
export function analyzeDomStructure(html: string): StructureAnalysis {
  const $ = cheerio.load(html);

  return {
    hasHeader: $('header').length > 0,
    hasNav: $('nav').length > 0,
    hasMain: $('main').length > 0,
    hasFooter: $('footer').length > 0,
    hasSidebar: $('aside').length > 0 || $('[class*="sidebar"]').length > 0,
    formCount: $('form').length,
    buttonCount: $('button').length + $('[type="submit"]').length + $('[class*="btn"]').length,
    linkCount: $('a').length,
  };
}

/**
 * Identifies component boundaries in HTML content.
 *
 * @param html - The HTML content to analyze
 * @returns Array of identified components
 */
export function identifyComponents(html: string): DomComponent[] {
  const $ = cheerio.load(html);
  const components: DomComponent[] = [];

  // Selectors for significant components
  const selectors = [
    'header', 'nav', 'main', 'footer', 'aside', 'section', 'article',
    '[class*="container"]', '[class*="wrapper"]', '[class*="card"]',
    '[class*="modal"]', '[class*="hero"]', '[class*="nav"]',
    'form', 'button', '[class*="btn"]',
  ];

  const seen = new Set<CheerioElement>();

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const element = el as CheerioElement;
      if (seen.has(element)) return;
      seen.add(element);

      const $el = $(element);
      const tag = element.tagName?.toLowerCase() || 'unknown';
      const classes = ($el.attr('class') || '').trim().split(/\s+/).filter(Boolean);

      // Get attributes (excluding common ones)
      const attributes: Record<string, string> = {};
      const attrs = element.attribs || {};
      for (const [key, value] of Object.entries(attrs)) {
        if (!['class', 'style'].includes(key) && value) {
          attributes[key] = String(value);
        }
      }

      components.push({
        type: classifyElement(tag, classes),
        tag,
        selector: buildSelector(element, $),
        classes,
        attributes,
        children: [],
        depth: $el.parents().length,
      });
    });
  }

  // Sort by depth (shallower first)
  return components.sort((a, b) => a.depth - b.depth);
}

/**
 * Extracts the complete component hierarchy from HTML.
 *
 * @param html - The HTML content to analyze
 * @returns Complete component hierarchy
 */
export function extractHierarchy(html: string): ComponentHierarchy {
  const $ = cheerio.load(html);
  const structure = analyzeDomStructure(html);
  const components = identifyComponents(html);

  // Build a simple tree from body
  const body = $('body')[0];
  let root: DomComponent | null = null;

  if (body) {
    const tag = 'body';
    const classes = ($(body).attr('class') || '').trim().split(/\s+/).filter(Boolean);

    root = {
      type: 'layout',
      tag,
      selector: 'body',
      classes,
      attributes: {},
      children: [],
      depth: 0,
    };

    // Add top-level components as children
    const topLevel = components.filter(c => c.depth <= 3);
    root.children = topLevel.slice(0, 10); // Limit to prevent huge trees
  }

  return {
    root,
    components,
    structure,
  };
}

// Validation - run with: npx tsx .knowledge/extractor/dom-analyzer.ts
if (require.main === module) {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <header class="site-header">
        <nav class="main-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>
        <section class="hero">
          <h1>Welcome</h1>
          <button class="cta-button">Get Started</button>
        </section>
        <section class="features">
          <div class="card">Feature 1</div>
          <div class="card">Feature 2</div>
        </section>
      </main>
      <footer>
        <form class="newsletter">
          <input type="email" placeholder="Email">
          <button type="submit">Subscribe</button>
        </form>
      </footer>
    </body>
    </html>
  `;

  console.log('=== Structure Analysis ===');
  console.log(JSON.stringify(analyzeDomStructure(testHtml), null, 2));

  console.log('\n=== Components ===');
  const components = identifyComponents(testHtml);
  console.log(JSON.stringify(components.map(c => ({
    type: c.type,
    tag: c.tag,
    selector: c.selector,
    classes: c.classes,
  })), null, 2));

  console.log('\n=== Hierarchy Summary ===');
  const hierarchy = extractHierarchy(testHtml);
  console.log(`Root: ${hierarchy.root?.selector}`);
  console.log(`Total components: ${hierarchy.components.length}`);
  console.log(`Structure: header=${hierarchy.structure.hasHeader}, nav=${hierarchy.structure.hasNav}, main=${hierarchy.structure.hasMain}, footer=${hierarchy.structure.hasFooter}`);
}
