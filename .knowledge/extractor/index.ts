/**
 * Pattern extraction module exports.
 * Re-exports all extractor functions for easy importing.
 */

import type { Pattern } from '../schema/pattern.schema';

// Browser automation
export { fetchPage, extractComputedStyles, extractStylesheets } from './browser';
export type { ElementStyles, StylesheetData, FetchPageResult } from './browser';

// CSS analysis
export { parseCss, extractAnimations, extractLayoutPatterns, extractInteractions } from './css-analyzer';
export type { AnimationPattern, LayoutPattern, InteractionPattern } from './css-analyzer';

// DOM analysis
export { analyzeDomStructure, identifyComponents, extractHierarchy } from './dom-analyzer';
export type { DomComponent, StructureAnalysis, ComponentHierarchy, ComponentType } from './dom-analyzer';

// Pattern identification
export {
  buildAnalysisContext,
  buildPatternPrompt,
  parsePatternYaml,
  validatePattern,
  identifyPatterns,
  generatePatternYaml,
  createBasicPattern,
} from './pattern-identifier';
export type { ExtractionData } from './pattern-identifier';

// Case study generation
export {
  generateSiteOverview,
  formatPatternSection,
  generateDesignRationale,
  generateCaseStudy,
} from './case-study';
export type { CaseStudyMetadata } from './case-study';

// Re-import for orchestration function
import { fetchPage, extractComputedStyles, extractStylesheets } from './browser';
import { parseCss, extractAnimations, extractLayoutPatterns, extractInteractions } from './css-analyzer';
import { extractHierarchy } from './dom-analyzer';
import { identifyPatterns as getPatternPrompts, createBasicPattern } from './pattern-identifier';
import { generateCaseStudy } from './case-study';
import type { ExtractionData } from './pattern-identifier';
import type { AnimationPattern, LayoutPattern, InteractionPattern } from './css-analyzer';

/**
 * Result of the full extraction pipeline.
 */
export interface ExtractionResult {
  patterns: Pattern[];
  caseStudy: string;
  extractionData: ExtractionData;
}

/**
 * High-level orchestration function for pattern extraction.
 * Runs the complete extraction pipeline from URL to patterns.
 *
 * @param url - The URL to extract patterns from
 * @returns Extraction results with patterns and case study
 */
export async function extractPatternsFromUrl(url: string): Promise<ExtractionResult> {
  // 1. Fetch page
  const { page, browser } = await fetchPage(url);

  try {
    // 2. Extract data
    const styles = await extractComputedStyles(page);
    const stylesheets = await extractStylesheets(page);
    const html = await page.content();

    // 3. Analyze CSS
    const animations: AnimationPattern[] = [];
    const layouts: LayoutPattern[] = [];
    const interactions: InteractionPattern[] = [];

    for (const ss of stylesheets) {
      if (ss.content) {
        const ast = parseCss(ss.content);
        animations.push(...extractAnimations(ast));
        layouts.push(...extractLayoutPatterns(ast));
        interactions.push(...extractInteractions(ast));
      }
    }

    // 4. Analyze DOM
    const domHierarchy = extractHierarchy(html);

    // 5. Build extraction data
    const extractionData: ExtractionData = {
      url,
      timestamp: new Date().toISOString(),
      styles,
      stylesheets,
      animations,
      layouts,
      interactions,
      domHierarchy,
    };

    // 6. Identify patterns (basic fallback - full AI analysis done externally)
    // This provides the prompts for external AI analysis
    const { prompts } = getPatternPrompts(extractionData);

    // Create basic patterns as fallback
    const patterns: Pattern[] = [];

    // Try to create basic patterns for detected categories
    const categories = prompts.map(p => p.category);
    for (const category of categories) {
      const basic = createBasicPattern(extractionData, category);
      if (basic) {
        patterns.push(basic);
      }
    }

    // 7. Generate case study
    const caseStudy = generateCaseStudy(extractionData, patterns);

    return { patterns, caseStudy, extractionData };
  } finally {
    await browser.close();
  }
}

/**
 * Gets AI prompts for pattern identification without running extraction.
 * Use this when you have already extracted data.
 *
 * @param data - The extraction data
 * @returns Prompts for AI pattern identification
 */
export function getPatternIdentificationPrompts(data: ExtractionData) {
  return getPatternPrompts(data);
}
