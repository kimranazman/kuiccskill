# Frontend Enhancement Hook

Integration guide for auto-invoking KUI Design during frontend development.

## Overview

KUI Design can be automatically invoked when building frontend components to suggest relevant design patterns. This integration works with the frontend-design skill or any frontend development workflow.

## Setup: CLAUDE.md Configuration

Add the following to your project's `.claude/CLAUDE.md` or global `~/.claude/CLAUDE.md`:

### Basic Auto-Suggestion

```markdown
## Frontend Development

When building frontend components:
1. Before implementing forms, check for patterns: `/kui-design:suggest forms`
2. Before implementing navigation, check for patterns: `/kui-design:suggest navigation`
3. Before implementing layouts, check for patterns: `/kui-design:suggest layout`
```

### Full Integration

```markdown
## Frontend Workflow Integration

When I start building any frontend component or page:

1. **Analyze Context**: Identify what I'm building (form, navigation, layout, etc.)
2. **Check Patterns**: Run `/kui-design:suggest [component type]` for relevant patterns
3. **Review Suggestions**: Present pattern suggestions with relevance scores
4. **Apply Patterns**: If user selects a pattern, run `/kui-design:generate [pattern]`

### Pattern Trigger Keywords

Automatically suggest patterns when task mentions:
- **Forms**: form, input, validation, submit, field
- **Navigation**: nav, menu, sidebar, header, tabs
- **Layout**: grid, container, section, hero, responsive
- **Feedback**: loading, spinner, toast, alert, notification
- **Data**: table, card, list, chart, stats

### Integration with frontend-design

When frontend-design skill is building components:
1. After design direction is chosen
2. Before implementation begins
3. Suggest patterns that match the aesthetic direction
```

## Workflow Examples

### Example 1: Building a Login Page

```
User: Build a login page for my SaaS app

Claude (with integration):
1. Recognizes: login, form, authentication keywords
2. Auto-runs: /kui-design:suggest login form authentication
3. Presents: 3-5 relevant patterns (login forms, validation states)
4. User selects: "Floating Label Input" pattern
5. Generates: React code with pattern applied
6. Continues: Building the rest of the page
```

### Example 2: Dashboard Layout

```
User: Create a dashboard with stats and data tables

Claude (with integration):
1. Recognizes: dashboard, stats, table, layout keywords
2. Auto-runs: /kui-design:suggest layout data-display
3. Presents: Grid patterns, stat cards, table patterns
4. User reviews: Pattern suggestions
5. Applies: Selected patterns to implementation
```

### Example 3: Navigation System

```
User: Add a responsive navigation bar with dropdown menus

Claude (with integration):
1. Recognizes: navigation, navbar, dropdown, responsive keywords
2. Auto-runs: /kui-design:suggest navigation responsive
3. Presents: Navbar patterns, dropdown patterns
4. User selects: Patterns to apply
5. Generates: Framework-specific navigation code
```

## Context Isolation

KUI Design sub-commands operate in isolation:

- **:suggest** - Read-only, queries pattern index
- **:generate** - Read patterns, outputs code
- **:analyze** - Read URLs, writes new patterns

Each command can be invoked independently without affecting the main conversation context significantly.

## Performance Notes

- Pattern suggestions use in-memory index (sub-100ms)
- Framework detection is cached
- Pattern loading is lazy (only loads selected patterns)
- First run builds index, subsequent runs are instant

## Disabling Auto-Enhancement

To disable auto-suggestions in a project, add to CLAUDE.md:

```markdown
## Frontend Development

Do NOT auto-invoke KUI Design patterns. Only use when explicitly requested.
```

## Manual Invocation

Even without auto-enhancement, patterns are always available:

```bash
# Get suggestions
/kui-design:suggest [what you're building]

# Generate code
/kui-design:generate [pattern name]

# Analyze a website
/kui-design:analyze [url]
```
