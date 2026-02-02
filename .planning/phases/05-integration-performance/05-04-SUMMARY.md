# Summary: 05-04 :suggest Sub-Command

## Status: Complete

## What Was Built

User-facing :suggest command that exposes the pattern suggestion engine. Users describe what they're building and receive ranked pattern recommendations.

### Key Deliverables

1. **suggest.md** - Command definition
   - Usage: `/kui-design:suggest [task description]`
   - Workflow documentation
   - Options: --category, --framework, --limit, --min-relevance
   - Relevance scoring explanation
   - Keyword detection reference
   - Integration guide with :generate

2. **SKILL.md** - Updated skill definition
   - Added :suggest to Available Sub-Commands list

## Command Usage

```bash
# Describe what you're building
/kui-design:suggest I need to build a login form with validation

# Get layout suggestions
/kui-design:suggest hero section with responsive grid

# Feedback patterns
/kui-design:suggest loading states and error handling
```

## Example Output

```
Pattern Suggestions for "login form with validation"

1. [80%] Login Form
   Category: authentication | Tags: login, form, auth
   Why: matches authentication category; tags match: login, form
   Frameworks: react, vue, svelte, vanilla

2. [80%] Form Validation States
   Category: forms | Tags: validation, error, success
   Why: matches forms category; tags match: form, validation
   Frameworks: react, vue, svelte, vanilla

3. [50%] Floating Label Input
   Category: forms | Tags: input, floating-label, animation
   Why: matches forms category
   Frameworks: react, vue, svelte, vanilla
```

## Commits

| Hash | Message |
|------|---------|
| 362e742 | feat(05-04): create :suggest sub-command definition |
| bc65e70 | feat(05-04): add :suggest to available sub-commands |

## Files Changed

- `skills/kui-design/commands/suggest.md` (created) - 143 lines
- `skills/kui-design/SKILL.md` (modified) - Added :suggest

## Verification

- [x] suggest.md exists in skills/kui-design/commands/
- [x] Command documents usage, workflow, options
- [x] References suggestPatterns from integration module
- [x] SKILL.md lists :suggest as available sub-command
- [x] Output format shows relevance percentages and reasoning
