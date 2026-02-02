# Phase 4: Multi-Framework & Documentation - Research

**Researched:** 2026-02-02
**Domain:** Multi-framework code generation, pattern documentation
**Confidence:** HIGH

## Summary

Phase 4 focuses on two main areas: (1) enhancing multi-framework code generation to produce production-quality Vue and vanilla JS/CSS output, and (2) adding comprehensive documentation to patterns. The existing infrastructure is solid - templates exist for all four frameworks, the code generator supports them, and patterns have optional code_examples fields. The work is primarily content and template enhancement rather than architectural changes.

**Primary recommendation:** Enhance existing Handlebars templates with production-quality code structures, extend schema with documentation fields, and systematically update all 14 seed patterns with framework-specific code examples and usage documentation.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Handlebars | ^4.7.x | Template compilation | Already in use, proven reliable |
| Zod | ^3.x | Schema validation | Already in use for pattern validation |
| TypeScript | ^5.x | Type safety | Already configured |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| yaml | ^2.x | YAML parsing | Already in use for pattern storage |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Handlebars | EJS/Mustache | Handlebars already working, no benefit to switching |

**Installation:**
No new dependencies needed - all libraries already installed.

## Architecture Patterns

### Current Project Structure
```
.knowledge/
├── schema/
│   ├── pattern.schema.ts    # Zod schema - needs documentation fields
│   └── categories.ts        # Framework/category enums
├── generator/
│   ├── templates/
│   │   ├── react.hbs        # Needs enhancement
│   │   ├── vue.hbs          # Needs enhancement
│   │   ├── svelte.hbs       # Needs enhancement
│   │   └── vanilla.hbs      # Needs enhancement
│   ├── code-generator.ts    # Template compilation
│   └── framework-detector.ts
├── patterns/
│   ├── layout/              # 3 patterns - need docs + examples
│   ├── navigation/          # 2 patterns - need docs + examples
│   ├── forms/               # 2 patterns - need docs + examples
│   ├── feedback/            # 2 patterns - need docs + examples
│   ├── micro-interactions/  # 2 patterns - need docs + examples
│   ├── data-display/        # 2 patterns - need docs + examples
│   └── authentication/      # 1 pattern - need docs + examples
└── lib/
    └── index.ts             # CRUD operations
```

### Pattern 1: Schema Extension for Documentation

**What:** Add documentation fields to pattern schema
**When to use:** Phase 4 - before updating patterns
**Example:**
```typescript
// Addition to PatternSchema
const DocumentationSchema = z.object({
  description: z.string().min(10).max(500),  // What the pattern does
  usage: z.string().optional(),               // How to use it
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    required: z.boolean().default(true),
    default: z.string().optional(),
  })).optional(),
  best_practices: z.array(z.string()).optional(),
  related_patterns: z.array(z.string()).optional(),
});

const FrameworkCompatibilitySchema = z.object({
  react: z.string().optional(),      // "18.0+"
  vue: z.string().optional(),        // "3.0+"
  svelte: z.string().optional(),     // "4.0+"
  vanilla: z.boolean().optional(),   // true = supported
});
```

### Pattern 2: Enhanced Template Structure

**What:** Production-quality templates with proper component structure
**When to use:** For each framework template

**Vue 3 Composition API (preferred):**
```handlebars
<script setup lang="ts">
/**
 * {{name}}
 * {{#if documentation.description}}{{documentation.description}}{{/if}}
 */
{{#if documentation.parameters}}
interface Props {
{{#each documentation.parameters}}
  /** {{description}} */
  {{name}}{{#unless required}}?{{/unless}}: {{type}};
{{/each}}
}

const props = withDefaults(defineProps<Props>(), {
{{#each documentation.parameters}}
{{#if default}}
  {{name}}: {{default}},
{{/if}}
{{/each}}
});
{{/if}}
</script>

<template>
{{#if code}}{{{code}}}{{else}}
  <div class="{{slugName}}">
    <!-- Component implementation -->
  </div>
{{/if}}
</template>

<style scoped>
/* Styles based on principles */
</style>
```

### Anti-Patterns to Avoid

- **Mixed API styles:** Don't mix Options API and Composition API in Vue templates
- **Hardcoded values:** Use props/parameters, not hardcoded strings
- **Missing types:** All templates should produce typed code
- **Inconsistent naming:** Use consistent naming conventions across frameworks

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Template compilation | Custom parser | Handlebars | Already working, battle-tested |
| YAML parsing | String manipulation | yaml library | Already in use |
| Schema validation | Manual checks | Zod | Already in use |

**Key insight:** This phase is content enhancement, not infrastructure building. Use existing systems.

## Common Pitfalls

### Pitfall 1: Incomplete Framework Examples
**What goes wrong:** Patterns have React example but missing Vue/Svelte/vanilla
**Why it happens:** Time pressure leads to partial implementation
**How to avoid:** Systematic update of all 14 patterns with all framework examples
**Warning signs:** Patterns with code_examples.react but missing others

### Pitfall 2: Documentation Without Parameters
**What goes wrong:** Usage docs exist but parameters aren't documented
**Why it happens:** Copy-paste documentation without adaptation
**How to avoid:** Template for documentation that requires parameter section
**Warning signs:** Documentation that says "accepts props" without listing them

### Pitfall 3: Version Compatibility Assumptions
**What goes wrong:** Code uses features not available in stated version
**Why it happens:** Using latest features without checking version
**How to avoid:** Document minimum versions, test against them
**Warning signs:** Vue 3.4+ features used when stating Vue 3.0+ compatibility

### Pitfall 4: Template/Code Example Mismatch
**What goes wrong:** Template structure differs from code_example structure
**Why it happens:** Template and examples maintained separately
**How to avoid:** code_example takes precedence when present
**Warning signs:** Generated code differs based on whether pattern has code_example

## Code Examples

### Vue 3 Component Structure
```vue
<script setup lang="ts">
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
});
</script>

<template>
  <div :class="['component', `variant-${variant}`]">
    <slot />
  </div>
</template>

<style scoped>
.component {
  /* base styles */
}
.variant-primary {
  /* primary variant */
}
</style>
```

### Svelte 5 Component Structure (with runes)
```svelte
<script lang="ts">
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

let { title, variant = 'primary' }: Props = $props();
</script>

<div class="component variant-{variant}">
  <slot />
</div>

<style>
.component {
  /* base styles */
}
</style>
```

### Vanilla JS/CSS Structure
```javascript
/**
 * ComponentName
 * @param {Object} options
 * @param {string} options.title - Component title
 * @param {'primary'|'secondary'} [options.variant='primary'] - Visual variant
 */
function createComponent(options) {
  const { title, variant = 'primary' } = options;

  const el = document.createElement('div');
  el.className = `component variant-${variant}`;
  el.innerHTML = `<span>${title}</span>`;

  return el;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vue Options API | Vue Composition API with script setup | Vue 3.2 (2021) | Templates should use Composition API |
| Svelte 4 syntax | Svelte 5 runes ($props, $state) | Svelte 5 (2024) | Templates may need runes for latest |
| React Class Components | React Functional + Hooks | React 16.8 (2019) | All React templates use functions |

**Deprecated/outdated:**
- Vue Options API: Still works but Composition API preferred for new code
- Svelte 4 exports: Works but $props() preferred in Svelte 5

## Open Questions

1. **Svelte version support**
   - What we know: Svelte 5 uses runes, Svelte 4 uses exports
   - What's unclear: Should templates support both or just latest?
   - Recommendation: Support Svelte 4 syntax (works in 5), note Svelte 5 runes in docs

2. **Parameter documentation format**
   - What we know: Need to document parameters for each pattern
   - What's unclear: JSDoc vs schema-based vs markdown
   - Recommendation: Schema-based (Zod) with rendering to JSDoc in templates

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis - `.knowledge/` directory structure
- Vue 3 Composition API - standard practice since Vue 3.2
- React functional components - standard since React 16.8

### Secondary (MEDIUM confidence)
- Svelte 5 runes syntax - based on Svelte 5 release notes
- TypeScript interface patterns - standard TypeScript practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - using existing libraries, no changes needed
- Architecture: HIGH - enhancing existing patterns, not rebuilding
- Pitfalls: MEDIUM - based on common documentation anti-patterns

**Research date:** 2026-02-02
**Valid until:** 60 days (stable domain, no fast-moving dependencies)
