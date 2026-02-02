/**
 * Verification script for Phase 1: Pattern Storage Foundation
 */

import {
  PatternSchema,
  CATEGORIES,
  FRAMEWORKS,
  listPatterns,
  loadPattern,
  searchByTags,
  filterByCategory,
} from '../.knowledge/lib/index';

async function verify() {
  console.log('Verifying Phase 1: Pattern Storage Foundation\n');
  const results: { check: string; passed: boolean; details?: string }[] = [];

  // Check 1: Patterns stored in .knowledge/patterns/ with valid YAML structure
  try {
    const files = await listPatterns();
    const validPatterns = await Promise.all(files.map(loadPattern));
    results.push({
      check: 'Patterns stored with valid YAML structure',
      passed: files.length > 0 && validPatterns.length === files.length,
      details: `${validPatterns.length} patterns validated`,
    });
  } catch (e) {
    results.push({
      check: 'Patterns stored with valid YAML structure',
      passed: false,
      details: String(e),
    });
  }

  // Check 2: Tag-based search returns patterns
  try {
    const gridPatterns = await searchByTags(['grid']);
    const buttonPatterns = await searchByTags(['button']);
    results.push({
      check: 'Tag-based search returns matching patterns',
      passed: gridPatterns.length > 0 && buttonPatterns.length > 0,
      details: `grid: ${gridPatterns.length}, button: ${buttonPatterns.length}`,
    });
  } catch (e) {
    results.push({
      check: 'Tag-based search returns matching patterns',
      passed: false,
      details: String(e),
    });
  }

  // Check 3: YAML validation prevents invalid patterns
  try {
    const invalidPattern = { name: 'x' }; // Missing required fields
    PatternSchema.parse(invalidPattern);
    results.push({
      check: 'YAML validation prevents invalid patterns',
      passed: false,
      details: 'Should have thrown for invalid pattern',
    });
  } catch {
    results.push({
      check: 'YAML validation prevents invalid patterns',
      passed: true,
      details: 'ZodError thrown for invalid pattern',
    });
  }

  // Check 4: 10-20 seed patterns across 5+ categories
  try {
    const files = await listPatterns();
    const patterns = await Promise.all(files.map(loadPattern));
    const categories = new Set(patterns.map((p) => p.category));
    results.push({
      check: '10-20 seed patterns across 5+ categories',
      passed: files.length >= 10 && files.length <= 20 && categories.size >= 5,
      details: `${files.length} patterns, ${categories.size} categories: ${[...categories].join(', ')}`,
    });
  } catch (e) {
    results.push({
      check: '10-20 seed patterns across 5+ categories',
      passed: false,
      details: String(e),
    });
  }

  // Check 5: Each pattern includes required metadata
  try {
    const files = await listPatterns();
    const patterns = await Promise.all(files.map(loadPattern));
    const allHaveMetadata = patterns.every(
      (p) =>
        p.name &&
        p.category &&
        p.tags.length > 0 &&
        p.frameworks.length > 0 &&
        p.principles.length > 0
    );
    const withAccessibility = patterns.filter((p) => p.accessibility).length;
    results.push({
      check: 'Each pattern includes required metadata',
      passed: allHaveMetadata,
      details: `All patterns have name, category, tags, frameworks, principles. ${withAccessibility} have accessibility notes.`,
    });
  } catch (e) {
    results.push({
      check: 'Each pattern includes required metadata',
      passed: false,
      details: String(e),
    });
  }

  // Print results
  console.log('Results:\n');
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? '✓' : '✗';
    console.log(`${icon} ${r.check}`);
    if (r.details) console.log(`  ${r.details}`);
    if (!r.passed) allPassed = false;
  }

  console.log(`\n${allPassed ? 'All checks passed!' : 'Some checks failed.'}`);
  return allPassed;
}

verify()
  .then((passed) => process.exit(passed ? 0 : 1))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
