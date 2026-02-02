/**
 * Pattern extraction module exports.
 * Re-exports all extractor functions for easy importing.
 */

// Browser automation
export { fetchPage, extractComputedStyles, extractStylesheets } from './browser';
export type { ElementStyles, StylesheetData, FetchPageResult } from './browser';
