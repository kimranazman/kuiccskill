/**
 * Context analysis for pattern suggestions.
 * Maps keywords to categories and analyzes task descriptions.
 */

import type { Category, Framework } from '../schema/categories';

/**
 * Keyword-to-category mapping.
 * Each keyword maps to one or more relevant categories.
 */
export const CATEGORY_KEYWORDS: Record<string, Category[]> = {
  // Forms
  form: ['forms'],
  input: ['forms'],
  select: ['forms'],
  checkbox: ['forms'],
  radio: ['forms'],
  textarea: ['forms'],
  validation: ['forms'],
  submit: ['forms'],
  field: ['forms'],
  label: ['forms'],

  // Navigation
  nav: ['navigation'],
  navbar: ['navigation'],
  menu: ['navigation'],
  breadcrumb: ['navigation'],
  sidebar: ['navigation'],
  header: ['navigation'],
  footer: ['navigation'],
  tabs: ['navigation'],
  link: ['navigation'],
  pagination: ['navigation'],

  // Layout
  grid: ['layout'],
  flex: ['layout'],
  container: ['layout'],
  section: ['layout'],
  hero: ['layout'],
  column: ['layout'],
  row: ['layout'],
  responsive: ['layout'],
  layout: ['layout'],
  spacing: ['layout'],

  // Data Display
  table: ['data-display'],
  list: ['data-display'],
  card: ['data-display', 'layout'], // Cards span both
  stat: ['data-display'],
  chart: ['data-display'],
  badge: ['data-display'],
  avatar: ['data-display'],
  data: ['data-display'],

  // Feedback
  loading: ['feedback'],
  spinner: ['feedback'],
  skeleton: ['feedback'],
  toast: ['feedback'],
  alert: ['feedback'],
  notification: ['feedback'],
  progress: ['feedback'],
  error: ['feedback'],
  success: ['feedback'],
  message: ['feedback'],

  // Micro-interactions
  hover: ['micro-interactions'],
  transition: ['micro-interactions'],
  animation: ['micro-interactions'],
  click: ['micro-interactions'],
  ripple: ['micro-interactions'],
  effect: ['micro-interactions'],
  animate: ['micro-interactions'],
  motion: ['micro-interactions'],

  // Authentication
  login: ['authentication', 'forms'],
  signup: ['authentication', 'forms'],
  register: ['authentication', 'forms'],
  password: ['authentication', 'forms'],
  auth: ['authentication'],
  signin: ['authentication'],
  oauth: ['authentication'],
};

/** Analyzed task context */
export interface TaskContext {
  /** Original input text */
  text: string;
  /** Detected categories relevant to the task */
  categories: Category[];
  /** Keywords found that triggered category matches */
  keywords: string[];
  /** Target framework if specified */
  framework?: Framework;
}

/**
 * Extract relevant categories from text.
 * Scans for keywords and maps them to pattern categories.
 *
 * @param text - Task description or search query
 * @returns Array of relevant categories
 */
export function extractCategories(text: string): Category[] {
  // Split into words, filter short words and punctuation
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2);

  const categories = new Set<Category>();

  for (const word of words) {
    const matches = CATEGORY_KEYWORDS[word];
    if (matches) {
      matches.forEach(c => categories.add(c));
    }
  }

  return Array.from(categories);
}

/**
 * Analyze task context from text description.
 * Returns structured context with categories, keywords, and framework.
 *
 * @param text - Task description to analyze
 * @param framework - Optional framework to filter by
 * @returns Analyzed task context
 */
export function analyzeTaskContext(text: string, framework?: Framework): TaskContext {
  const categories = extractCategories(text);

  // Extract matched keywords for transparency
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2);

  const keywords = words.filter(w => CATEGORY_KEYWORDS[w]);

  return {
    text,
    categories,
    keywords,
    framework,
  };
}
