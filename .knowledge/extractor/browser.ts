/**
 * Browser automation module for pattern extraction.
 * Uses Playwright to fetch and render web pages, extracting computed styles and stylesheets.
 */

import { chromium, type Browser, type Page } from 'playwright';

/**
 * Represents extracted computed styles for an element.
 */
export interface ElementStyles {
  selector: string;
  tag: string;
  classes: string[];
  styles: {
    // Layout properties
    display: string;
    position: string;
    gridTemplateColumns: string;
    gridTemplateRows: string;
    gridGap: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    // Animation properties
    transition: string;
    animation: string;
    transform: string;
    // Visual properties
    background: string;
    backgroundColor: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
    opacity: string;
    color: string;
  };
}

/**
 * Represents stylesheet data extracted from a page.
 */
export interface StylesheetData {
  href: string | null;
  content: string;
  isExternal: boolean;
}

/**
 * Result of fetching a page.
 */
export interface FetchPageResult {
  page: Page;
  browser: Browser;
}

/**
 * Fetches and renders a web page using Playwright.
 *
 * @param url - The URL to fetch
 * @returns The page instance and browser for further processing
 */
export async function fetchPage(url: string): Promise<FetchPageResult> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
  } catch (error) {
    await browser.close();
    if (error instanceof Error) {
      throw new Error(`Failed to load page ${url}: ${error.message}`);
    }
    throw error;
  }

  return { page, browser };
}

/**
 * Extracts computed CSS styles from significant elements on the page.
 *
 * @param page - The Playwright page instance
 * @returns Array of element styles with selector paths
 */
export async function extractComputedStyles(page: Page): Promise<ElementStyles[]> {
  const styles = await page.evaluate(() => {
    const significantSelectors = [
      'header', 'nav', 'main', 'footer', 'aside', 'section', 'article',
      'div[class*="container"]', 'div[class*="wrapper"]', 'div[class*="card"]',
      'div[class*="modal"]', 'div[class*="hero"]', 'div[class*="grid"]',
      'button', 'a[class]', 'form', 'input', 'select', 'textarea',
      '[class*="btn"]', '[class*="button"]',
    ];

    const results: ElementStyles[] = [];
    const seen = new Set<Element>();

    for (const selector of significantSelectors) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);

        const computed = getComputedStyle(element);
        const el = element as HTMLElement;

        // Build selector path
        let selectorPath = el.tagName.toLowerCase();
        if (el.id) {
          selectorPath += `#${el.id}`;
        } else if (el.className && typeof el.className === 'string') {
          const classes = el.className.trim().split(/\s+/).filter(Boolean);
          if (classes.length > 0) {
            selectorPath += '.' + classes.slice(0, 2).join('.');
          }
        }

        results.push({
          selector: selectorPath,
          tag: el.tagName.toLowerCase(),
          classes: el.className && typeof el.className === 'string'
            ? el.className.trim().split(/\s+/).filter(Boolean)
            : [],
          styles: {
            // Layout
            display: computed.display,
            position: computed.position,
            gridTemplateColumns: computed.gridTemplateColumns,
            gridTemplateRows: computed.gridTemplateRows,
            gridGap: computed.gap,
            flexDirection: computed.flexDirection,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems,
            // Animation
            transition: computed.transition,
            animation: computed.animation,
            transform: computed.transform,
            // Visual
            background: computed.background,
            backgroundColor: computed.backgroundColor,
            border: computed.border,
            borderRadius: computed.borderRadius,
            boxShadow: computed.boxShadow,
            opacity: computed.opacity,
            color: computed.color,
          },
        });
      });
    }

    return results;
  });

  return styles;
}

/**
 * Extracts all stylesheet content from the page.
 * Handles both inline styles and external stylesheets (with CORS handling).
 *
 * @param page - The Playwright page instance
 * @returns Array of stylesheet data
 */
export async function extractStylesheets(page: Page): Promise<StylesheetData[]> {
  const stylesheets = await page.evaluate(() => {
    const results: StylesheetData[] = [];

    // Extract from document.styleSheets
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      const href = sheet.href;

      try {
        // Try to access cssRules (may fail for cross-origin stylesheets)
        const rules = sheet.cssRules || sheet.rules;
        let content = '';

        for (let j = 0; j < rules.length; j++) {
          content += rules[j].cssText + '\n';
        }

        results.push({
          href,
          content,
          isExternal: !!href,
        });
      } catch {
        // CORS restriction - stylesheet from different origin
        // We'll capture what we can from the href
        results.push({
          href,
          content: '',
          isExternal: true,
        });
      }
    }

    // Also extract inline styles from <style> tags
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach((tag) => {
      if (tag.textContent) {
        // Check if this content is already captured
        const content = tag.textContent;
        const alreadyCaptured = results.some(r => r.content === content);
        if (!alreadyCaptured) {
          results.push({
            href: null,
            content,
            isExternal: false,
          });
        }
      }
    });

    return results;
  });

  // For external stylesheets that couldn't be accessed, try fetching them
  const enhancedStylesheets = await Promise.all(
    stylesheets.map(async (sheet) => {
      if (sheet.isExternal && sheet.href && !sheet.content) {
        try {
          const response = await fetch(sheet.href);
          if (response.ok) {
            sheet.content = await response.text();
          }
        } catch {
          // Fetch failed, keep empty content
        }
      }
      return sheet;
    })
  );

  return enhancedStylesheets;
}

// Validation script - run with: npx tsx .knowledge/extractor/browser.ts
if (require.main === module) {
  (async () => {
    console.log('Testing browser automation...');

    try {
      const { page, browser } = await fetchPage('https://example.com');
      console.log('Page loaded successfully');

      const styles = await extractComputedStyles(page);
      console.log(`Extracted ${styles.length} element styles`);

      const stylesheets = await extractStylesheets(page);
      console.log(`Extracted ${stylesheets.length} stylesheets`);

      const totalCssSize = stylesheets.reduce((sum, s) => sum + s.content.length, 0);
      console.log(`Total CSS size: ${totalCssSize} characters`);

      await browser.close();
      console.log('Browser closed successfully');
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}
