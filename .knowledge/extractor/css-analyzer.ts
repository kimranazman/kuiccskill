/**
 * CSS analysis module for extracting design patterns.
 * Uses CSSTree to parse stylesheets and identify animations, layouts, and interactions.
 */

import * as csstree from 'css-tree';
import type { CssNode, Rule, Declaration, Atrule, SelectorList } from 'css-tree';

/**
 * Represents an animation pattern (keyframes or transition).
 */
export interface AnimationPattern {
  name: string;
  type: 'keyframes' | 'transition';
  duration?: string;
  timingFunction?: string;
  keyframes?: Record<string, Record<string, string>>; // percentage -> properties
}

/**
 * Represents a layout pattern (grid or flexbox).
 */
export interface LayoutPattern {
  type: 'grid' | 'flexbox';
  selector: string;
  properties: Record<string, string>;
}

/**
 * Represents an interaction pattern (hover, focus, active).
 */
export interface InteractionPattern {
  trigger: 'hover' | 'focus' | 'active';
  selector: string;
  effects: Record<string, string>;
}

/**
 * Parses CSS text into an AST.
 *
 * @param cssText - The CSS text to parse
 * @returns The parsed AST
 */
export function parseCss(cssText: string): CssNode {
  try {
    return csstree.parse(cssText, {
      parseRulePrelude: true,
      parseValue: true,
      parseAtrulePrelude: true,
    });
  } catch {
    // Handle malformed CSS - try to parse with error recovery
    return csstree.parse(cssText, {
      parseRulePrelude: false,
      parseValue: false,
      parseAtrulePrelude: false,
    });
  }
}

/**
 * Extracts the selector string from a rule's prelude.
 */
function getSelectorString(prelude: CssNode | null): string {
  if (!prelude) return '';
  return csstree.generate(prelude);
}

/**
 * Extracts the value string from a declaration.
 */
function getValueString(value: CssNode | null): string {
  if (!value) return '';
  return csstree.generate(value);
}

/**
 * Extracts animation patterns from a CSS AST.
 *
 * @param ast - The CSS AST
 * @returns Array of animation patterns
 */
export function extractAnimations(ast: CssNode): AnimationPattern[] {
  const animations: AnimationPattern[] = [];
  const keyframesMap = new Map<string, Record<string, Record<string, string>>>();

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node: Atrule) {
      if (node.name === 'keyframes') {
        const name = node.prelude ? csstree.generate(node.prelude).trim() : 'unnamed';
        const keyframes: Record<string, Record<string, string>> = {};

        if (node.block) {
          csstree.walk(node.block, {
            visit: 'Rule',
            enter(rule: Rule) {
              const percentage = rule.prelude ? getSelectorString(rule.prelude) : '0%';
              const props: Record<string, string> = {};

              if (rule.block) {
                csstree.walk(rule.block, {
                  visit: 'Declaration',
                  enter(decl: Declaration) {
                    props[decl.property] = getValueString(decl.value);
                  },
                });
              }

              keyframes[percentage] = props;
            },
          });
        }

        keyframesMap.set(name, keyframes);
        animations.push({
          name,
          type: 'keyframes',
          keyframes,
        });
      }
    },
  });

  // Find transition properties in regular rules
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node: Rule) {
      if (!node.block) return;

      let hasTransition = false;
      let transition = '';
      let duration = '';
      let timingFunction = '';

      csstree.walk(node.block, {
        visit: 'Declaration',
        enter(decl: Declaration) {
          if (decl.property === 'transition') {
            hasTransition = true;
            transition = getValueString(decl.value);

            // Parse transition shorthand: property duration timing-function
            const parts = transition.split(/\s+/);
            if (parts.length >= 2) {
              duration = parts.find(p => /^\d/.test(p) && /s$/.test(p)) || '';
              timingFunction = parts.find(p =>
                ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'].includes(p) ||
                p.startsWith('cubic-bezier')
              ) || '';
            }
          } else if (decl.property === 'transition-duration') {
            duration = getValueString(decl.value);
            hasTransition = true;
          } else if (decl.property === 'transition-timing-function') {
            timingFunction = getValueString(decl.value);
            hasTransition = true;
          }
        },
      });

      if (hasTransition) {
        animations.push({
          name: transition || 'transition',
          type: 'transition',
          duration: duration || undefined,
          timingFunction: timingFunction || undefined,
        });
      }
    },
  });

  return animations;
}

/**
 * Extracts layout patterns (grid and flexbox) from a CSS AST.
 *
 * @param ast - The CSS AST
 * @returns Array of layout patterns
 */
export function extractLayoutPatterns(ast: CssNode): LayoutPattern[] {
  const layouts: LayoutPattern[] = [];

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node: Rule) {
      if (!node.block) return;

      const selector = getSelectorString(node.prelude);
      const properties: Record<string, string> = {};
      let layoutType: 'grid' | 'flexbox' | null = null;

      csstree.walk(node.block, {
        visit: 'Declaration',
        enter(decl: Declaration) {
          const value = getValueString(decl.value);
          const prop = decl.property;

          // Detect grid or flex display
          if (prop === 'display') {
            if (value === 'grid' || value === 'inline-grid') {
              layoutType = 'grid';
            } else if (value === 'flex' || value === 'inline-flex') {
              layoutType = 'flexbox';
            }
          }

          // Collect grid properties
          if (prop.startsWith('grid-') || prop === 'gap' || prop === 'row-gap' || prop === 'column-gap') {
            properties[prop] = value;
          }

          // Collect flex properties
          if (['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'gap'].includes(prop)) {
            properties[prop] = value;
          }
        },
      });

      if (layoutType && Object.keys(properties).length > 0) {
        layouts.push({
          type: layoutType,
          selector,
          properties,
        });
      }
    },
  });

  return layouts;
}

/**
 * Extracts interaction patterns (hover, focus, active states) from a CSS AST.
 *
 * @param ast - The CSS AST
 * @returns Array of interaction patterns
 */
export function extractInteractions(ast: CssNode): InteractionPattern[] {
  const interactions: InteractionPattern[] = [];

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node: Rule) {
      if (!node.block || !node.prelude) return;

      const selector = getSelectorString(node.prelude);

      // Check for pseudo-class triggers
      let trigger: 'hover' | 'focus' | 'active' | null = null;
      if (selector.includes(':hover')) {
        trigger = 'hover';
      } else if (selector.includes(':focus')) {
        trigger = 'focus';
      } else if (selector.includes(':active')) {
        trigger = 'active';
      }

      if (!trigger) return;

      const effects: Record<string, string> = {};

      // Extract effect properties
      csstree.walk(node.block, {
        visit: 'Declaration',
        enter(decl: Declaration) {
          const prop = decl.property;
          const value = getValueString(decl.value);

          // Collect transform, visual, and animation effects
          if ([
            'transform', 'opacity', 'color', 'background', 'background-color',
            'border', 'border-color', 'box-shadow', 'text-shadow', 'scale',
            'translate', 'rotate', 'filter', 'visibility',
          ].includes(prop)) {
            effects[prop] = value;
          }
        },
      });

      if (Object.keys(effects).length > 0) {
        interactions.push({
          trigger,
          selector,
          effects,
        });
      }
    },
  });

  return interactions;
}

// Validation - run with: npx tsx .knowledge/extractor/css-analyzer.ts
if (require.main === module) {
  const testCss = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .flex-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .button {
      transition: transform 0.2s ease-out;
    }

    .button:hover {
      transform: scale(1.05);
      background-color: #3b82f6;
    }

    .input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }

    .link:active {
      opacity: 0.8;
    }
  `;

  const ast = parseCss(testCss);
  console.log('=== Animations ===');
  console.log(JSON.stringify(extractAnimations(ast), null, 2));
  console.log('\n=== Layouts ===');
  console.log(JSON.stringify(extractLayoutPatterns(ast), null, 2));
  console.log('\n=== Interactions ===');
  console.log(JSON.stringify(extractInteractions(ast), null, 2));
}
