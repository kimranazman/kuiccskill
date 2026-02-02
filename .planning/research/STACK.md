# Stack Research

**Domain:** Claude Code Skills + Design Pattern Knowledge Systems
**Researched:** 2026-02-02
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | 5.5+ | Type-safe skill development | Industry standard for reliable Node.js development. Claude Code skills follow Agent Skills standard which emphasizes TypeScript for type safety. Essential for AST manipulation and schema validation. |
| Node.js | 20 LTS | Runtime environment | Current LTS with ESM support. Required for Claude Code skill execution and MCP server compatibility. |
| Agent Skills Standard | 2025 spec | Skill file format | Open standard adopted by 25+ AI coding tools (Claude Code, Cursor, GitHub Copilot, Gemini CLI). Ensures portability across platforms. Uses `SKILL.md` with YAML frontmatter. |

### Pattern Storage & Knowledge Organization

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Markdown | CommonMark | Pattern documentation format | Agent Skills standard uses markdown for all skill content. gray-matter parses frontmatter, markdown-it renders content. Battle-tested by Gatsby, Astro, VitePress, TinaCMS. |
| gray-matter | 4.0.3 | Frontmatter parsing | Used by Eleventy, Gatsby, Astro for parsing YAML/JSON frontmatter. Faster than regex parsers, handles edge cases reliably. 2.9M weekly downloads. |
| markdown-it | 14.1.0 | Markdown parsing & rendering | CommonMark compliant with plugin ecosystem. Used by npm registry docs. 100% spec compliance, safe by default. 7.4M weekly downloads. |
| Zod | 3.25+ | Schema validation | TypeScript-first validation with static type inference. Required peer dependency for MCP SDK. Zero dependencies, 2kb core. Validates skill frontmatter and pattern metadata. |

### Code Analysis & AST Manipulation

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| ts-morph | 27.0.2 | TypeScript AST manipulation | Wraps TypeScript Compiler API for easier AST navigation and code generation. 7.3M weekly downloads. Industry standard for TypeScript code analysis. |
| TypeScript Compiler API | 5.5+ | Low-level AST access | Native AST access with full type resolution. ts-morph built on top of this. Direct access needed for framework detection and pattern matching. |
| @babel/parser | 7.25+ | Multi-framework parsing | Parses JSX, Vue, React, modern JS/TS. Better JSX support than TS compiler alone. Critical for multi-framework pattern extraction. |

### MCP Integration (Optional)

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| @modelcontextprotocol/sdk | 1.24.1+ | MCP server development | If exposing patterns via MCP protocol. Latest implements MCP spec 2025-11-25. Use if integrating with Claude Desktop or other MCP clients. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| handlebars | 4.7+ | Template engine for code generation | 5-7x faster than Mustache. More expressive with helpers, partials, block expressions. Use for generating framework-specific code from patterns. |
| fast-glob | 3.3+ | File system pattern matching | Faster than native glob. Use for discovering pattern files and analyzing codebases. |
| chalk | 5.3+ | Terminal output styling | Better DX for CLI feedback during pattern extraction/application. ESM-only in v5+. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | 9.23+ | Linting | TypeScript support built-in as of v9.18. Use @typescript-eslint for advanced rules. |
| Prettier | 3.8.0 | Code formatting | Opinionated formatter. v3.7+ has better TS class/interface consistency. |
| Vitest | 4.0+ | Testing framework | Vite-native, Jest-compatible API. Browser mode stable in v4.0. Faster than Jest for ESM projects. |
| fast-check | 3.24+ | Property-based testing | Validates pattern application logic across many inputs. Trusted by Jest, Ramda, query-string. |

## Installation

```bash
# Core dependencies
npm install gray-matter markdown-it zod ts-morph

# Code generation
npm install handlebars fast-glob

# MCP integration (optional)
npm install @modelcontextprotocol/sdk

# Dev dependencies
npm install -D typescript @types/node vitest @vitest/ui fast-check
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier chalk
```

## Alternatives Considered

| Category | Recommended | Alternative | When to Use Alternative |
|----------|-------------|-------------|-------------------------|
| Frontmatter parser | gray-matter | front-matter | Never. gray-matter handles edge cases better and is faster. |
| Markdown parser | markdown-it | marked | If you need streaming parsing (marked has better streaming). Otherwise markdown-it's plugin ecosystem wins. |
| AST manipulation | ts-morph | TypeScript Compiler API directly | Direct API if you need absolute control or minimal dependencies. ts-morph simplifies 95% of use cases. |
| Template engine | handlebars | mustache | If cross-language consistency matters (Mustache has more implementations). Handlebars is strictly better for JS/TS. |
| Template engine | handlebars | ejs | If you need embedded JS in templates (EJS allows full JS). Handlebars' logic-less philosophy prevents template complexity. |
| Schema validation | zod | ajv | If you need JSON Schema compatibility or fastest possible validation (ajv is faster). Zod's TypeScript integration is unmatched. |
| Testing | vitest | jest | If you're on legacy Webpack/CJS project. Vitest is faster and better for ESM. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| typescript-parser (npm) | Archived package, last updated 2019 | ts-morph or TypeScript Compiler API |
| Custom regex parsing for frontmatter | Edge cases break, slower than gray-matter | gray-matter |
| Vector databases (Pinecone, Qdrant, etc.) | Overkill for local pattern lookup. Adds latency and complexity. Patterns should be indexed by tags/categories in simple JSON. | Flat file structure with fast-glob + tag-based indexing |
| LLM embeddings for pattern search | Slow (100ms+ per embedding), requires API calls or large models. Defeats "fast execution" constraint. | Keyword/tag-based search with fuzzy matching |
| Heavy frameworks (NestJS, Next.js) | Skills need to be lightweight and fast-loading. Claude Code loads skill content into context dynamically. | Plain TypeScript with minimal dependencies |
| Jest | Slow ESM support, verbose config for TypeScript | Vitest (Jest-compatible API, Vite-native) |

## Stack Patterns by Variant

**If building standalone skill (no MCP):**
- Use Agent Skills standard (SKILL.md format)
- Store patterns as markdown in `patterns/` directory
- Use gray-matter + markdown-it for pattern parsing
- Use ts-morph for code analysis
- Deploy as Claude Code plugin or `.claude/skills/` directory

**If exposing patterns via MCP:**
- Build MCP server with @modelcontextprotocol/sdk
- Implement `resources` protocol for pattern browsing
- Implement `tools` protocol for pattern application
- Use stdio transport for local Claude Desktop integration
- Skills become thin wrappers that call MCP tools

**If supporting multiple frameworks:**
- Use @babel/parser for JSX/Vue/Svelte parsing
- Maintain framework detection logic (detect imports: 'react', 'vue', '@sveltejs/kit')
- Store framework-specific pattern variants
- Use handlebars for framework-agnostic templates with conditional sections

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| @modelcontextprotocol/sdk@1.24+ | zod@3.25+ | SDK imports from zod/v4 but compatible with Zod v3.25+. Zod is required peer dependency. |
| ts-morph@27+ | typescript@5.0-5.9 | ts-morph wraps TypeScript Compiler API. Update together. |
| vitest@4+ | typescript@5.0+ | Native ESM, requires Node.js 18+. |
| chalk@5+ | Node.js 18+ | v5 is ESM-only. Use v4 if stuck on CommonJS. |
| @typescript-eslint@8+ | eslint@8.57+ or ^9.0.0 | ESLint v9+ has native TS config support. |

## Architecture Decisions

### Why NOT Vector Search?

**Constraint:** "Fast execution - pattern lookups should be quick"

Vector search adds 100ms+ latency per query:
1. Embed query text (50-200ms depending on model/API)
2. Vector similarity search (10-50ms)
3. Fetch pattern content (10-20ms)

Tag-based indexing is instant:
1. Read `patterns-index.json` (< 1ms cached)
2. Filter by tags/framework (< 1ms)
3. Return matching patterns (< 1ms)

For 50-200 patterns, flat file search is faster than any database.

### Why Markdown Over JSON/YAML?

Agent Skills standard uses markdown because:
- **Human-readable**: Designers can contribute patterns without dev setup
- **Git-friendly**: Diffs are readable, conflicts are resolvable
- **Rich formatting**: Code blocks, links, images embedded naturally
- **Frontmatter for metadata**: gray-matter extracts structured data + freeform content
- **Ecosystem alignment**: All AI coding tools (Claude Code, Cursor, Gemini CLI) use markdown skills

### Why NOT Custom DSL?

Considered creating custom DSL for patterns. Rejected because:
- **Learning curve**: Team must learn DSL syntax
- **Tooling overhead**: Need parser, validator, formatter, LSP
- **Migration barrier**: Markdown patterns portable to other tools
- **Complexity**: DSL adds indirection without meaningful benefit

Markdown with strict schema validation (Zod) gives structure without custom language.

### Framework Detection Strategy

**Approach:** AST-based import detection, not string matching

```typescript
// ✅ Correct: Parse imports
import { parse } from '@babel/parser';
const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
// Traverse imports, detect 'react', 'vue', '@sveltejs/kit'

// ❌ Wrong: Regex matching
if (code.includes('import React')) // Breaks on comments, strings
```

Why AST-based:
- Handles all import styles (default, named, namespace)
- Ignores comments and string literals
- Detects framework even if imported indirectly

## Confidence Assessment

| Technology | Confidence | Source |
|------------|-----------|--------|
| Agent Skills standard | HIGH | Official Claude Code docs, 25+ tools adopt standard |
| TypeScript/ts-morph | HIGH | 7.3M weekly downloads, official MS compiler API |
| gray-matter | HIGH | 2.9M weekly downloads, used by Gatsby/Astro/Eleventy |
| markdown-it | HIGH | 7.4M weekly downloads, 100% CommonMark spec |
| Zod | HIGH | Official docs, MCP SDK peer dependency |
| MCP SDK | HIGH | Official Anthropic SDK, spec 2025-11-25 |
| handlebars | MEDIUM | Community consensus but limited 2025-specific research |
| Vector search rejection | HIGH | Latency math verified, constraint analysis sound |

## Sources

### Official Documentation (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Agent Skills format, SKILL.md structure
- [Agent Skills Standard](https://agentskills.io) - Open standard specification
- [TypeScript-ESLint Releases](https://typescript-eslint.io/users/releases/) - Version compatibility
- [Model Context Protocol](https://modelcontextprotocol.io/development/roadmap) - MCP spec updates
- [Zod Documentation](https://zod.dev/) - Schema validation

### Package Registries (HIGH confidence)
- [ts-morph on npm](https://www.npmjs.com/package/ts-morph) - Version 27.0.2, 7.3M weekly downloads
- [gray-matter on npm](https://www.npmjs.com/package/gray-matter) - Version 4.0.3, 2.9M weekly downloads
- [markdown-it on npm](https://www.npmjs.com/package/markdown-it) - Version 14.1.0, 7.4M weekly downloads
- [@modelcontextprotocol/sdk on npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Version 1.24.1
- [Vitest 4.0 Release](https://vitest.dev/blog/vitest-4) - December 2025
- [Prettier 3.7 Release](https://prettier.io/blog/2025/11/27/3.7.0) - November 2025

### Comparison Research (MEDIUM confidence)
- [Handlebars vs Mustache Comparison](https://www.slant.co/versus/181/183/~handlebars-js_vs_mustache-js) - Performance benchmarks
- [Vector Databases for TypeScript 2025](https://lakefs.io/blog/best-vector-databases/) - Ecosystem survey
- [Embedding Models Guide](https://artsmart.ai/blog/top-embedding-models-in-2025/) - Local model options

### Community Examples (MEDIUM confidence)
- [Anthropic Skills Repository](https://github.com/anthropics/skills) - Reference implementations
- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills) - Community patterns
- [Claude Code Best Practices](https://www.eesel.ai/blog/claude-code-best-practices) - Production patterns

---
*Stack research for: Claude Code Skills + Design Pattern Knowledge Systems*
*Researched: 2026-02-02*
