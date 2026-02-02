/**
 * Performance benchmark comparing file-based vs cached search.
 * Run: npx tsx .knowledge/lib/benchmark.ts
 */

import { searchPatterns } from './search';
import { searchFast, getIndex, invalidateCache } from './cache';
import type { Category, Framework } from '../schema/categories';

async function benchmark() {
  console.log('Pattern Search Benchmark\n');
  console.log('='.repeat(50));

  // Warm up / build index
  invalidateCache();
  const indexStart = performance.now();
  const index = await getIndex();
  const indexTime = performance.now() - indexStart;
  console.log(`\nIndex build: ${indexTime.toFixed(2)}ms (${index.byId.size} patterns)\n`);

  // Test searches
  const tests: Array<{
    tags?: string[];
    category?: Category;
    framework?: Framework;
  }> = [
    { tags: ['grid'] },
    { tags: ['hover', 'animation'] },
    { category: 'forms' },
    { framework: 'react' },
    { category: 'layout', framework: 'vue' },
    { tags: ['responsive'], category: 'navigation' },
  ];

  console.log('Search Results:');
  console.log('-'.repeat(50));

  for (const opts of tests) {
    // Old search (file-based)
    const oldStart = performance.now();
    const oldResults = await searchPatterns(opts);
    const oldTime = performance.now() - oldStart;

    // New search (cached)
    const newStart = performance.now();
    const newIds = await searchFast(opts);
    const newTime = performance.now() - newStart;

    // Calculate speedup safely
    const speedup = newTime > 0 ? (oldTime / newTime).toFixed(1) : 'N/A';

    console.log(`\nSearch: ${JSON.stringify(opts)}`);
    console.log(`  File-based: ${oldTime.toFixed(2)}ms (${oldResults.length} results)`);
    console.log(`  Cached:     ${newTime.toFixed(2)}ms (${newIds.length} IDs)`);
    console.log(`  Speedup:    ${speedup}x`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('Benchmark complete.');
}

benchmark().catch(console.error);
