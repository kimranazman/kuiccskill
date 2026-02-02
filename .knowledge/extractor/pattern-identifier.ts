/**
 * AI-powered pattern identification module.
 * Combines extraction data and generates validated design patterns.
 */

import * as yaml from 'yaml';
import { PatternSchema, type Pattern } from '../schema/pattern.schema';
import { CATEGORIES, type Category } from '../schema/categories';
import type { AnimationPattern, LayoutPattern, InteractionPattern } from './css-analyzer';
import type { ComponentHierarchy, DomComponent, StructureAnalysis } from './dom-analyzer';
import type { ElementStyles, StylesheetData } from './browser';

/**
 * Combined extraction data from all sources.
 */
export interface ExtractionData {
  url: string;
  timestamp: string;
  styles: ElementStyles[];
  stylesheets: StylesheetData[];
  animations: AnimationPattern[];
  layouts: LayoutPattern[];
  interactions: InteractionPattern[];
  domHierarchy: ComponentHierarchy;
}

/**
 * Builds a summarized analysis context from extraction data.
 * This context is used to prompt AI for pattern identification.
 *
 * @param data - The extraction data
 * @returns Formatted context string for AI analysis
 */
export function buildAnalysisContext(data: ExtractionData): string {
  const sections: string[] = [];

  // URL and metadata
  sections.push(`## Source\nURL: ${data.url}\nExtracted: ${data.timestamp}\n`);

  // Page structure summary
  const struct = data.domHierarchy.structure;
  sections.push(`## Page Structure
- Header: ${struct.hasHeader ? 'Yes' : 'No'}
- Navigation: ${struct.hasNav ? 'Yes' : 'No'}
- Main content: ${struct.hasMain ? 'Yes' : 'No'}
- Footer: ${struct.hasFooter ? 'Yes' : 'No'}
- Sidebar: ${struct.hasSidebar ? 'Yes' : 'No'}
- Forms: ${struct.formCount}
- Buttons: ${struct.buttonCount}
- Links: ${struct.linkCount}
`);

  // Animation patterns
  if (data.animations.length > 0) {
    sections.push(`## Animations Found (${data.animations.length})`);
    for (const anim of data.animations.slice(0, 10)) {
      if (anim.type === 'keyframes' && anim.keyframes) {
        const steps = Object.keys(anim.keyframes).join(', ');
        sections.push(`- @keyframes ${anim.name}: [${steps}]`);
      } else {
        sections.push(`- Transition: ${anim.name} (${anim.duration || 'default'} ${anim.timingFunction || ''})`);
      }
    }
    sections.push('');
  }

  // Layout patterns
  if (data.layouts.length > 0) {
    sections.push(`## Layout Patterns (${data.layouts.length})`);
    for (const layout of data.layouts.slice(0, 10)) {
      const props = Object.entries(layout.properties)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      sections.push(`- ${layout.selector}: ${layout.type} { ${props} }`);
    }
    sections.push('');
  }

  // Interaction patterns
  if (data.interactions.length > 0) {
    sections.push(`## Interactions (${data.interactions.length})`);
    for (const int of data.interactions.slice(0, 10)) {
      const effects = Object.entries(int.effects)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      sections.push(`- ${int.selector} (${int.trigger}): { ${effects} }`);
    }
    sections.push('');
  }

  // Components found
  if (data.domHierarchy.components.length > 0) {
    sections.push(`## Components (${data.domHierarchy.components.length})`);
    const grouped: Record<string, DomComponent[]> = {};
    for (const comp of data.domHierarchy.components) {
      if (!grouped[comp.type]) {
        grouped[comp.type] = [];
      }
      grouped[comp.type].push(comp);
    }
    for (const type of Object.keys(grouped)) {
      const comps = grouped[type];
      sections.push(`- ${type}: ${comps.map(c => c.selector).slice(0, 5).join(', ')}`);
    }
    sections.push('');
  }

  // Sample computed styles
  if (data.styles.length > 0) {
    sections.push(`## Sample Element Styles (${data.styles.length} total)`);
    for (const style of data.styles.slice(0, 5)) {
      const notable: string[] = [];
      if (style.styles.display !== 'block' && style.styles.display !== 'inline') {
        notable.push(`display: ${style.styles.display}`);
      }
      if (style.styles.transition !== 'all 0s ease 0s' && style.styles.transition !== 'none') {
        notable.push(`transition: ${style.styles.transition.slice(0, 50)}`);
      }
      if (style.styles.animation && style.styles.animation !== 'none') {
        notable.push(`animation: ${style.styles.animation.slice(0, 50)}`);
      }
      if (notable.length > 0) {
        sections.push(`- ${style.selector}: ${notable.join(', ')}`);
      }
    }
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Builds an AI prompt for identifying patterns in a specific category.
 *
 * @param context - The analysis context string
 * @param category - The category to focus on
 * @returns Prompt string for AI pattern identification
 */
export function buildPatternPrompt(context: string, category: Category): string {
  const categoryDescriptions: Record<Category, string> = {
    layout: 'page layouts, grid systems, spacing patterns, responsive structures',
    forms: 'form designs, input styling, validation feedback, form layouts',
    navigation: 'navigation menus, breadcrumbs, tabs, sidebars, pagination',
    'micro-interactions': 'hover effects, click feedback, transitions, animations, state changes',
    'data-display': 'tables, lists, cards, data visualization patterns',
    feedback: 'alerts, toasts, loading states, error messages, success indicators',
    authentication: 'login forms, signup flows, password inputs, social auth buttons',
  };

  return `# Pattern Identification Task

Analyze the following website extraction data and identify design patterns in the "${category}" category.

Category focus: ${categoryDescriptions[category]}

${context}

## Output Format

For each pattern you identify, output valid YAML matching this schema:

\`\`\`yaml
name: "Pattern Name"
category: "${category}"
tags:
  - tag1
  - tag2
frameworks:
  - react
  - vue
  - svelte
  - vanilla
principles:
  - "Design principle 1"
  - "Design principle 2"
accessibility:
  notes: "Accessibility considerations"
  wcag_level: "AA"
source:
  url: "${context.match(/URL: (.+)/)?.[1] || ''}"
  extracted: "AI analysis"
\`\`\`

Identify 1-3 patterns that are clearly present in the data. Focus on quality over quantity.
Only include patterns where you have clear evidence from the extraction data.
`;
}

/**
 * Parses a pattern from YAML text.
 *
 * @param yamlText - The YAML text to parse
 * @returns Parsed pattern or null if invalid
 */
export function parsePatternYaml(yamlText: string): unknown | null {
  try {
    // Extract YAML from code blocks if present
    const codeBlockMatch = yamlText.match(/```yaml\s*([\s\S]*?)\s*```/);
    const cleanYaml = codeBlockMatch ? codeBlockMatch[1] : yamlText;

    return yaml.parse(cleanYaml);
  } catch {
    return null;
  }
}

/**
 * Validates a parsed object against the PatternSchema.
 *
 * @param data - The object to validate
 * @returns Validated Pattern or null
 */
export function validatePattern(data: unknown): Pattern | null {
  const result = PatternSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
}

/**
 * Identifies patterns from extraction data.
 * This function prepares prompts and context - actual AI invocation happens externally.
 *
 * @param data - The extraction data
 * @returns Array of category contexts for AI analysis
 */
export function identifyPatterns(data: ExtractionData): {
  context: string;
  prompts: Array<{ category: Category; prompt: string }>;
} {
  const context = buildAnalysisContext(data);

  // Determine relevant categories based on extraction data
  const relevantCategories: Category[] = [];

  // Always check for micro-interactions if we have animations/interactions
  if (data.animations.length > 0 || data.interactions.length > 0) {
    relevantCategories.push('micro-interactions');
  }

  // Check for layout patterns
  if (data.layouts.length > 0) {
    relevantCategories.push('layout');
  }

  // Check for navigation
  if (data.domHierarchy.structure.hasNav || data.domHierarchy.structure.hasHeader) {
    relevantCategories.push('navigation');
  }

  // Check for forms
  if (data.domHierarchy.structure.formCount > 0) {
    relevantCategories.push('forms');
  }

  // Check for feedback patterns
  const hasFeedback = data.domHierarchy.components.some(c => c.type === 'feedback');
  if (hasFeedback) {
    relevantCategories.push('feedback');
  }

  // Check for data display
  const hasDataDisplay = data.domHierarchy.components.some(c => c.type === 'content');
  if (hasDataDisplay) {
    relevantCategories.push('data-display');
  }

  // Build prompts for relevant categories
  const prompts = relevantCategories.map(category => ({
    category,
    prompt: buildPatternPrompt(context, category),
  }));

  return { context, prompts };
}

/**
 * Generates YAML string from a validated pattern.
 *
 * @param pattern - The validated pattern
 * @returns YAML string
 */
export function generatePatternYaml(pattern: Pattern): string {
  return yaml.stringify(pattern, {
    indent: 2,
    lineWidth: 100,
  });
}

/**
 * Creates a pattern from extraction data with minimal AI inference.
 * Used as a fallback when full AI analysis is not available.
 *
 * @param data - Extraction data
 * @param category - Target category
 * @returns A basic pattern or null
 */
export function createBasicPattern(data: ExtractionData, category: Category): Pattern | null {
  const hostname = new URL(data.url).hostname.replace('www.', '');

  switch (category) {
    case 'micro-interactions': {
      if (data.interactions.length === 0) return null;
      const interaction = data.interactions[0];
      return {
        name: `${hostname} ${interaction.trigger} effect`,
        category,
        tags: ['hover', 'transition', interaction.trigger],
        frameworks: ['react', 'vue', 'svelte', 'vanilla'],
        principles: [
          `Uses ${interaction.trigger} state for visual feedback`,
          `Effects: ${Object.keys(interaction.effects).join(', ')}`,
        ],
        source: { url: data.url, extracted: data.timestamp },
      };
    }

    case 'layout': {
      if (data.layouts.length === 0) return null;
      const layout = data.layouts[0];
      return {
        name: `${hostname} ${layout.type} layout`,
        category,
        tags: [layout.type, 'responsive', 'grid'],
        frameworks: ['react', 'vue', 'svelte', 'vanilla'],
        principles: [
          `Uses CSS ${layout.type} for layout`,
          `Properties: ${Object.keys(layout.properties).join(', ')}`,
        ],
        source: { url: data.url, extracted: data.timestamp },
      };
    }

    default:
      return null;
  }
}

// Validation - run with: npx tsx .knowledge/extractor/pattern-identifier.ts
if (require.main === module) {
  const mockData: ExtractionData = {
    url: 'https://example.com',
    timestamp: new Date().toISOString(),
    styles: [],
    stylesheets: [],
    animations: [
      {
        name: 'fadeIn',
        type: 'keyframes',
        keyframes: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    ],
    layouts: [
      {
        type: 'grid',
        selector: '.container',
        properties: { 'grid-template-columns': 'repeat(3, 1fr)', gap: '1rem' },
      },
    ],
    interactions: [
      {
        trigger: 'hover',
        selector: '.button:hover',
        effects: { transform: 'scale(1.05)', 'background-color': '#3b82f6' },
      },
    ],
    domHierarchy: {
      root: null,
      components: [],
      structure: {
        hasHeader: true,
        hasNav: true,
        hasMain: true,
        hasFooter: true,
        hasSidebar: false,
        formCount: 1,
        buttonCount: 3,
        linkCount: 10,
      },
    },
  };

  console.log('=== Analysis Context ===');
  const context = buildAnalysisContext(mockData);
  console.log(context);

  console.log('\n=== Pattern Identification ===');
  const result = identifyPatterns(mockData);
  console.log(`Relevant categories: ${result.prompts.map(p => p.category).join(', ')}`);

  console.log('\n=== Basic Pattern (fallback) ===');
  const basic = createBasicPattern(mockData, 'micro-interactions');
  if (basic) {
    console.log(generatePatternYaml(basic));
  }
}
