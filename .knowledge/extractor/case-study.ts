/**
 * Case study documentation generator.
 * Creates Markdown documentation for extracted design patterns.
 */

import type { Pattern } from '../schema/pattern.schema';
import type { ExtractionData } from './pattern-identifier';
import type { StructureAnalysis } from './dom-analyzer';

/**
 * Metadata for a case study document.
 */
export interface CaseStudyMetadata {
  url: string;
  siteName: string;
  extractedAt: string;
  patternCount: number;
  categories: string[];
}

/**
 * Extracts site name from URL.
 */
function getSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. prefix and get domain
    const domain = hostname.replace(/^www\./, '');
    // Capitalize first letter
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Unknown Site';
  }
}

/**
 * Generates an overview section for the site.
 *
 * @param data - The extraction data
 * @returns Markdown overview section
 */
export function generateSiteOverview(data: ExtractionData): string {
  const siteName = getSiteName(data.url);
  const struct = data.domHierarchy.structure;

  const lines: string[] = [];

  // Structure summary
  const structures: string[] = [];
  if (struct.hasHeader) structures.push('header');
  if (struct.hasNav) structures.push('navigation');
  if (struct.hasMain) structures.push('main content area');
  if (struct.hasSidebar) structures.push('sidebar');
  if (struct.hasFooter) structures.push('footer');

  lines.push(`${siteName} features a ${structures.length > 0 ? structures.join(', ') : 'basic'} layout structure.`);

  // Interactive elements
  const interactiveNotes: string[] = [];
  if (struct.buttonCount > 0) {
    interactiveNotes.push(`${struct.buttonCount} button${struct.buttonCount > 1 ? 's' : ''}`);
  }
  if (struct.linkCount > 0) {
    interactiveNotes.push(`${struct.linkCount} link${struct.linkCount > 1 ? 's' : ''}`);
  }
  if (struct.formCount > 0) {
    interactiveNotes.push(`${struct.formCount} form${struct.formCount > 1 ? 's' : ''}`);
  }

  if (interactiveNotes.length > 0) {
    lines.push(`The page contains ${interactiveNotes.join(', ')}.`);
  }

  // Animation/interaction summary
  if (data.animations.length > 0 || data.interactions.length > 0) {
    const animCount = data.animations.filter(a => a.type === 'keyframes').length;
    const transCount = data.animations.filter(a => a.type === 'transition').length;
    const interCount = data.interactions.length;

    const effects: string[] = [];
    if (animCount > 0) effects.push(`${animCount} keyframe animation${animCount > 1 ? 's' : ''}`);
    if (transCount > 0) effects.push(`${transCount} transition${transCount > 1 ? 's' : ''}`);
    if (interCount > 0) effects.push(`${interCount} interaction effect${interCount > 1 ? 's' : ''}`);

    if (effects.length > 0) {
      lines.push(`Design includes ${effects.join(', ')}.`);
    }
  }

  // Layout summary
  if (data.layouts.length > 0) {
    const gridCount = data.layouts.filter(l => l.type === 'grid').length;
    const flexCount = data.layouts.filter(l => l.type === 'flexbox').length;

    const layoutTypes: string[] = [];
    if (gridCount > 0) layoutTypes.push(`CSS Grid (${gridCount} instance${gridCount > 1 ? 's' : ''})`);
    if (flexCount > 0) layoutTypes.push(`Flexbox (${flexCount} instance${flexCount > 1 ? 's' : ''})`);

    if (layoutTypes.length > 0) {
      lines.push(`Layout system uses ${layoutTypes.join(' and ')}.`);
    }
  }

  return lines.join(' ');
}

/**
 * Formats a pattern section for the case study.
 *
 * @param pattern - The pattern to format
 * @returns Markdown pattern section
 */
export function formatPatternSection(pattern: Pattern): string {
  const lines: string[] = [];

  // Header with category
  lines.push(`### ${pattern.name}`);
  lines.push('');
  lines.push(`**Category:** ${pattern.category}`);
  lines.push(`**Tags:** ${pattern.tags.join(', ')}`);
  lines.push(`**Frameworks:** ${pattern.frameworks.join(', ')}`);
  lines.push('');

  // Design principles
  lines.push('#### Design Principles');
  lines.push('');
  for (const principle of pattern.principles) {
    lines.push(`- ${principle}`);
  }
  lines.push('');

  // Accessibility notes
  if (pattern.accessibility) {
    lines.push('#### Accessibility');
    lines.push('');
    lines.push(`${pattern.accessibility.notes}`);
    if (pattern.accessibility.wcag_level) {
      lines.push(`WCAG Level: ${pattern.accessibility.wcag_level}`);
    }
    lines.push('');
  }

  // Code example (if available)
  if (pattern.code_examples) {
    const example = pattern.code_examples.react ||
      pattern.code_examples.vue ||
      pattern.code_examples.svelte ||
      pattern.code_examples.vanilla;

    if (example) {
      lines.push('#### Example Code');
      lines.push('');
      lines.push('```tsx');
      lines.push(example);
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Generates design rationale based on patterns and structure.
 *
 * @param patterns - Array of patterns
 * @param structure - Page structure analysis
 * @returns Markdown design rationale section
 */
export function generateDesignRationale(patterns: Pattern[], structure: StructureAnalysis): string {
  const lines: string[] = [];

  // UX considerations
  const uxPoints: string[] = [];

  if (structure.hasNav && structure.hasFooter) {
    uxPoints.push('Consistent navigation with header and footer improves wayfinding');
  }

  const hasInteractions = patterns.some(p => p.category === 'micro-interactions');
  if (hasInteractions) {
    uxPoints.push('Micro-interactions provide visual feedback for user actions');
  }

  const hasAnimations = patterns.some(p =>
    p.tags.includes('animation') || p.tags.includes('transition')
  );
  if (hasAnimations) {
    uxPoints.push('Subtle animations create a polished, modern feel');
  }

  if (structure.formCount > 0) {
    uxPoints.push('Forms enable user input and conversion actions');
  }

  if (uxPoints.length > 0) {
    lines.push('**User Experience:**');
    for (const point of uxPoints) {
      lines.push(`- ${point}`);
    }
    lines.push('');
  }

  // Visual design considerations
  const visualPoints: string[] = [];

  const hasLayout = patterns.some(p => p.category === 'layout');
  if (hasLayout) {
    visualPoints.push('Grid-based layouts create visual harmony and alignment');
  }

  if (hasInteractions) {
    visualPoints.push('Hover states communicate interactivity');
  }

  if (visualPoints.length > 0) {
    lines.push('**Visual Design:**');
    for (const point of visualPoints) {
      lines.push(`- ${point}`);
    }
    lines.push('');
  }

  // When to use these patterns
  lines.push('**When to Use:**');
  const categories = Array.from(new Set(patterns.map(p => p.category)));
  for (const category of categories) {
    const recommendation = getUsageRecommendation(category);
    if (recommendation) {
      lines.push(`- ${recommendation}`);
    }
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Gets a usage recommendation for a pattern category.
 */
function getUsageRecommendation(category: string): string | null {
  const recommendations: Record<string, string> = {
    layout: 'Use grid layouts for content-heavy pages requiring visual organization',
    'micro-interactions': 'Apply micro-interactions to buttons and links for better feedback',
    navigation: 'Implement consistent navigation for sites with multiple pages',
    forms: 'Use form patterns for user input, signup flows, and data collection',
    feedback: 'Add feedback patterns for system status and error communication',
    'data-display': 'Apply data display patterns for lists, tables, and cards',
    authentication: 'Use auth patterns for login, signup, and password recovery',
  };
  return recommendations[category] || null;
}

/**
 * Generates a complete case study document.
 *
 * @param data - The extraction data
 * @param patterns - Array of extracted patterns
 * @returns Complete Markdown case study
 */
export function generateCaseStudy(data: ExtractionData, patterns: Pattern[]): string {
  const siteName = getSiteName(data.url);
  const categories = Array.from(new Set(patterns.map(p => p.category)));

  const lines: string[] = [];

  // Title and metadata
  lines.push(`# Case Study: ${siteName}`);
  lines.push('');
  lines.push(`**Source:** ${data.url}`);
  lines.push(`**Analyzed:** ${new Date(data.timestamp).toLocaleDateString()}`);
  lines.push(`**Patterns Found:** ${patterns.length}`);
  lines.push(`**Categories:** ${categories.join(', ') || 'None'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Overview section
  lines.push('## Overview');
  lines.push('');
  lines.push(generateSiteOverview(data));
  lines.push('');

  // Design rationale
  if (patterns.length > 0) {
    lines.push('## Design Rationale');
    lines.push('');
    lines.push(generateDesignRationale(patterns, data.domHierarchy.structure));
  }

  // Patterns extracted
  if (patterns.length > 0) {
    lines.push('## Patterns Extracted');
    lines.push('');

    for (const pattern of patterns) {
      lines.push(formatPatternSection(pattern));
    }
  }

  // Summary
  lines.push('## Summary');
  lines.push('');

  if (patterns.length === 0) {
    lines.push('No specific patterns were extracted from this site.');
  } else {
    lines.push(`This analysis identified ${patterns.length} design pattern${patterns.length > 1 ? 's' : ''} from ${siteName}.`);

    const keyTakeaways: string[] = [];

    if (categories.includes('micro-interactions')) {
      keyTakeaways.push('Interactive elements use subtle animations for feedback');
    }
    if (categories.includes('layout')) {
      keyTakeaways.push('Modern CSS layout techniques create responsive designs');
    }
    if (categories.includes('navigation')) {
      keyTakeaways.push('Clear navigation structure supports user wayfinding');
    }

    if (keyTakeaways.length > 0) {
      lines.push('');
      lines.push('**Key Takeaways:**');
      for (const takeaway of keyTakeaways) {
        lines.push(`- ${takeaway}`);
      }
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*Generated by KUI Design Pattern Extraction*`);

  return lines.join('\n');
}

// Validation - run with: npx tsx .knowledge/extractor/case-study.ts
if (require.main === module) {
  const mockPattern: Pattern = {
    name: 'Hero Section Layout',
    category: 'layout',
    tags: ['hero', 'landing', 'responsive'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    principles: [
      'Full viewport height for impactful first impression',
      'Centered content with max-width constraint',
      'Clear CTA button hierarchy',
    ],
    accessibility: {
      notes: 'Ensure sufficient color contrast on overlay text',
      wcag_level: 'AA',
    },
  };

  const mockData: ExtractionData = {
    url: 'https://example.com',
    timestamp: new Date().toISOString(),
    styles: [],
    stylesheets: [],
    animations: [
      { name: 'fadeIn', type: 'keyframes', keyframes: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } },
    ],
    layouts: [
      { type: 'grid', selector: '.container', properties: { 'grid-template-columns': '1fr 1fr' } },
    ],
    interactions: [
      { trigger: 'hover', selector: '.btn', effects: { transform: 'scale(1.05)' } },
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

  const caseStudy = generateCaseStudy(mockData, [mockPattern]);
  console.log(caseStudy);
}
