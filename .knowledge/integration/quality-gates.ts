/**
 * Quality validation gates for design patterns.
 * Scores patterns on completeness and coherence.
 */

import type { Pattern } from '../schema/pattern.schema';
import type { Category } from '../schema/categories';

/** Issue severity levels */
export type Severity = 'error' | 'warning' | 'info';

/** A single quality issue found during validation */
export interface QualityIssue {
  field: string;
  severity: Severity;
  message: string;
  suggestion?: string;
}

/** Result of quality validation */
export interface QualityResult {
  level: 'passed' | 'warning' | 'failed';
  score: number; // 0-100
  issues: QualityIssue[];
  summary: string;
}

/** Minimum thresholds for quality checks */
const THRESHOLDS = {
  MIN_PRINCIPLES: 3,
  MIN_TAGS: 2,
  MIN_DESCRIPTION_LENGTH: 50,
  MIN_CODE_EXAMPLE_LENGTH: 100,
};

/** Category-related tag keywords for coherence checking */
const CATEGORY_TAG_KEYWORDS: Record<Category, string[]> = {
  layout: ['grid', 'flex', 'layout', 'responsive', 'container', 'spacing'],
  forms: ['form', 'input', 'validation', 'field', 'submit', 'textarea'],
  navigation: ['nav', 'menu', 'breadcrumb', 'tabs', 'sidebar', 'link'],
  'micro-interactions': ['hover', 'animation', 'transition', 'click', 'state'],
  'data-display': ['table', 'list', 'card', 'data', 'grid', 'display'],
  feedback: ['alert', 'toast', 'loading', 'error', 'success', 'notification'],
  authentication: ['login', 'auth', 'password', 'signup', 'social', 'oauth'],
};

/**
 * Validate pattern quality and return a scored result.
 *
 * @param pattern - The pattern to validate
 * @returns Quality result with score and issues
 */
export function validateQuality(pattern: Pattern): QualityResult {
  const issues: QualityIssue[] = [];

  // ===== Completeness Checks (warning level) =====

  // Check principles count
  if (pattern.principles.length < THRESHOLDS.MIN_PRINCIPLES) {
    issues.push({
      field: 'principles',
      severity: 'warning',
      message: `Only ${pattern.principles.length} principles (recommend ${THRESHOLDS.MIN_PRINCIPLES}+)`,
      suggestion: 'Add more design principles for better pattern documentation',
    });
  }

  // Check tags count
  if (pattern.tags.length < THRESHOLDS.MIN_TAGS) {
    issues.push({
      field: 'tags',
      severity: 'warning',
      message: `Only ${pattern.tags.length} tag(s) (recommend ${THRESHOLDS.MIN_TAGS}+)`,
      suggestion: 'Add more tags for better searchability',
    });
  }

  // Check documentation description length
  if (pattern.documentation?.description) {
    if (pattern.documentation.description.length < THRESHOLDS.MIN_DESCRIPTION_LENGTH) {
      issues.push({
        field: 'documentation.description',
        severity: 'warning',
        message: `Description is only ${pattern.documentation.description.length} chars (recommend ${THRESHOLDS.MIN_DESCRIPTION_LENGTH}+)`,
        suggestion: 'Provide a more detailed description',
      });
    }
  }

  // Check for code examples if frameworks are specified
  if (pattern.frameworks.length > 0 && !pattern.code_examples) {
    issues.push({
      field: 'code_examples',
      severity: 'warning',
      message: 'No code examples provided despite framework support',
      suggestion: 'Add code examples for at least one framework',
    });
  }

  // ===== Code Example Checks (warning level) =====

  if (pattern.code_examples) {
    const examples = pattern.code_examples;

    // Check each code example for minimum length
    for (const [framework, code] of Object.entries(examples)) {
      if (code && code.length < THRESHOLDS.MIN_CODE_EXAMPLE_LENGTH) {
        issues.push({
          field: `code_examples.${framework}`,
          severity: 'warning',
          message: `${framework} example is only ${code.length} chars (may be a stub)`,
          suggestion: 'Provide a more complete code example',
        });
      }
    }

    // React examples should contain JSX
    if (examples.react && !examples.react.includes('<') && !examples.react.includes('>')) {
      issues.push({
        field: 'code_examples.react',
        severity: 'warning',
        message: 'React example appears to lack JSX markup',
        suggestion: 'Include JSX in React code examples',
      });
    }

    // Vue examples should contain template or setup
    if (examples.vue && !examples.vue.includes('template') && !examples.vue.includes('setup')) {
      issues.push({
        field: 'code_examples.vue',
        severity: 'warning',
        message: 'Vue example appears to lack template or setup section',
        suggestion: 'Include template or Composition API setup in Vue examples',
      });
    }
  }

  // ===== Coherence Checks (info level) =====

  // Check category matches at least one tag
  const categoryKeywords = CATEGORY_TAG_KEYWORDS[pattern.category];
  const lowerTags = pattern.tags.map(t => t.toLowerCase());
  const hasRelevantTag = categoryKeywords.some(keyword =>
    lowerTags.some(tag => tag.includes(keyword))
  );

  if (!hasRelevantTag) {
    issues.push({
      field: 'tags',
      severity: 'info',
      message: `No tags relate to the "${pattern.category}" category`,
      suggestion: `Consider adding tags like: ${categoryKeywords.slice(0, 3).join(', ')}`,
    });
  }

  // Check frameworks in code_examples match declared frameworks
  if (pattern.code_examples) {
    const declaredFrameworks = new Set(pattern.frameworks);
    const exampleFrameworks = Object.keys(pattern.code_examples).filter(
      k => pattern.code_examples![k as keyof typeof pattern.code_examples]
    );

    for (const fw of exampleFrameworks) {
      if (!declaredFrameworks.has(fw as any)) {
        issues.push({
          field: 'frameworks',
          severity: 'info',
          message: `Code example exists for "${fw}" but it's not in frameworks array`,
          suggestion: `Add "${fw}" to the frameworks array`,
        });
      }
    }
  }

  // ===== Calculate Score =====

  let score = 100;
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const issue of issues) {
    switch (issue.severity) {
      case 'error':
        score -= 30;
        errorCount++;
        break;
      case 'warning':
        score -= 10;
        warningCount++;
        break;
      case 'info':
        score -= 5;
        infoCount++;
        break;
    }
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: QualityResult['level'];
  if (score >= 80) {
    level = 'passed';
  } else if (score >= 60) {
    level = 'warning';
  } else {
    level = 'failed';
  }

  // Generate summary
  let summary: string;
  if (issues.length === 0) {
    summary = 'Pattern passes all quality checks';
  } else {
    const parts: string[] = [];
    if (errorCount > 0) parts.push(`${errorCount} error${errorCount > 1 ? 's' : ''}`);
    if (warningCount > 0) parts.push(`${warningCount} warning${warningCount > 1 ? 's' : ''}`);
    if (infoCount > 0) parts.push(`${infoCount} info`);
    summary = `Pattern has ${issues.length} issue${issues.length > 1 ? 's' : ''} (${parts.join(', ')})`;
  }

  return {
    level,
    score,
    issues,
    summary,
  };
}
