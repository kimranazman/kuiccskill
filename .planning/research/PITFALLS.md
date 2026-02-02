# Pitfalls Research

**Domain:** Claude Code Skills & Design Pattern Libraries
**Researched:** 2026-02-02
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Pattern Quality Degradation Through Iterative AI Generation

**What goes wrong:**
AI-generated UI patterns degrade in quality over iterative refinement. Research shows a 37.6% increase in critical vulnerabilities after just 5 iterations of AI-driven "improvements". Patterns become overengineered, introduce unnecessary complexity, recreate legacy anti-patterns, or use outdated approaches from older training data.

**Why it happens:**
LLMs are extremely sensitive to prompt design - slight lexical or structural variations drastically change output quality. Without explicit security/quality prompts, models recreate familiar but deprecated patterns. AI generates surface-level correctness (code that looks right) but skips control-flow protections, null checks, early returns, and comprehensive exception logic.

**How to avoid:**
- Implement validation gates after each pattern generation/update
- Use structured prompting with explicit quality criteria (accessibility, performance, maintainability)
- Apply context-driven optimization with API docs, prior patterns, state variables
- Require human code review between iterations - don't chain AI refinements
- Version all patterns and track quality metrics over time
- Include anti-pattern detection in pattern storage validation

**Warning signs:**
- Patterns becoming more complex without clear value
- Increased use of deprecated APIs or libraries
- Missing null checks, error boundaries, or edge case handling
- Cryptographic library misuse or incorrect API usage
- Pattern drift toward generic defaults vs. project conventions

**Phase to address:**
Phase 1 (Pattern Storage MVP) - Build quality validation into storage layer
Phase 2 (Code Generation Engine) - Implement prompt engineering patterns with quality gates

---

### Pitfall 2: State Management Amnesia in MCP Skills

**What goes wrong:**
MCP server architecture mistakes kill 90% of agentic AI projects before production. Building stateless servers creates "complete amnesia" where every request arrives as if it's the first interaction. Pattern lookups lose context, can't maintain UI state across requests, and can't build complex multi-step UI generation workflows.

**Why it happens:**
Developers default to stateless FaaS architecture preventing persistence of local file artifacts across invocations. Without proper session management, tools requiring state (building UI progressively, tracking pattern selections, maintaining design token context) become impossible.

**How to avoid:**
- Design MCP servers as stateful services with explicit session management
- Implement proper memory management - retain right state, evict stale context
- Use cryptographic signatures for context provenance verification
- Cache pattern lookups with session-scoped TTL
- Document state requirements clearly in skill frontmatter
- Test skills for multi-turn conversation flows, not just single requests

**Warning signs:**
- Users repeatedly specifying same preferences or context
- Pattern selections not persisting across tool invocations
- Cannot build complex UIs requiring multiple refinement rounds
- Session state lost between skill invocations
- Higher latency and costs from repeated context processing

**Phase to address:**
Phase 1 (Pattern Storage MVP) - Design with state management from start
Phase 3 (Skill Integration) - Implement session-aware skill architecture

---

### Pitfall 3: Knowledge Base Staleness and Token Drift

**What goes wrong:**
Design drift is the "silent killer" of design systems. Pattern catalogs accumulate inconsistencies: duplicated tokens, competing naming conventions, eight button sizes, three shades of "primary blue". Outdated patterns become more frustrating than no patterns at all. AI agent knowledge bases suffer from "freshness as the silent killer" - stale patterns lead to generated UI using deprecated components or outdated frameworks.

**Why it happens:**
Without regular audits, designers hard-code hex values, override styles, and detach instances for "quick fixes". Tokens drift from original purpose. Multiple designers use different tokens for same purpose. Framework updates make patterns incompatible. No automated detection of duplication or naming drift.

**How to avoid:**
- Implement automated staleness detection with content verification workflows
- Assign clear ownership to pattern categories with quarterly review cycles
- Track token usage and flag unused or drifting tokens
- Use AI to automatically flag token duplication, naming drift, structural inconsistencies
- Scan files for detached instances and hard-coded overrides
- Check patterns quarterly for outdated screenshots, deprecated features, broken links
- Version design tokens with framework compatibility metadata
- Make updates easy - high friction means drift accelerates

**Warning signs:**
- Multiple similar but slightly different tokens/patterns
- Patterns referencing deprecated framework APIs
- Hard-coded values appearing in generated code
- Naming conventions inconsistent across pattern catalog
- Community reporting "this pattern doesn't work anymore"
- Growing gap between pattern last-updated date and framework version

**Phase to address:**
Phase 1 (Pattern Storage MVP) - Build automated drift detection
Phase 4 (Maintenance & Evolution) - Implement governance automation

---

### Pitfall 4: LLM Hallucination Generating Invalid UI Patterns

**What goes wrong:**
LLMs hallucinate non-existent APIs, incorrect component props, invalid framework syntax, and imaginary design tokens. Generated patterns contain task requirement conflicts (ignoring specified constraints), factual knowledge conflicts (wrong API usage), and project context conflicts (incompatible with actual framework version). Hallucinations lead to security vulnerabilities, unexpected errors, and poor performance.

**Why it happens:**
Four root causes: poor training data quality, weak intention understanding capacity, limited knowledge acquisition capacity, and insufficient repository-level context awareness. Repetitive patterns in generated code indicate lower quality and facilitate hallucinations. Models lack access to current framework documentation or project-specific conventions.

**How to avoid:**
- Implement RAG-based mitigation pulling current framework docs
- Use HalluCode-style benchmarks to evaluate pattern generation quality
- Detect knowledge conflicts with 100% precision through validation
- Auto-correct identified hallucinations (77% success rate demonstrated)
- Validate generated patterns against actual framework APIs
- Include framework version metadata in prompts
- Test generated patterns in actual runtime environment
- Build confidence scoring into pattern storage (flag LOW confidence patterns)

**Warning signs:**
- Generated code referencing non-existent imports or APIs
- Component props that don't exist in framework
- Patterns that look correct but fail at runtime
- Repetitive/boilerplate code patterns (indicates quality issues)
- Missing framework-specific conventions (className vs class, etc.)
- Generated code mixing framework paradigms (React + Vue syntax)

**Phase to address:**
Phase 2 (Code Generation Engine) - Build hallucination detection/correction
Phase 3 (Skill Integration) - Implement RAG with current framework docs

---

### Pitfall 5: Framework Compatibility Fragmentation

**What goes wrong:**
Patterns work in React 18 but fail in Next.js 14. SSR breaks patterns designed for client-only. Framework updates introduce breaking changes that invalidate entire pattern categories. Supporting multiple frameworks (React, Vue, Svelte) creates maintenance burden where each pattern needs 3+ versions.

**Why it happens:**
In 2026, developers demand TypeScript support, WCAG accessibility, dark/light theming, SSR compatibility, and React 18+ features. Modern frameworks evolve rapidly with breaking changes. Patterns don't specify framework version constraints. No automated testing against multiple framework versions.

**How to avoid:**
- Version patterns with explicit framework compatibility metadata
- Test patterns against framework matrix (React 17/18, Next.js 13/14/15, SSR/CSR)
- Use framework-agnostic abstractions where possible (Web Components, CSS-only)
- Document SSR/hydration requirements in pattern metadata
- Implement automated compatibility testing in CI/CD
- Prioritize single framework initially, expand deliberately
- Track framework deprecation schedules and migration paths

**Warning signs:**
- Patterns failing in SSR contexts
- Hydration mismatches in server-rendered apps
- TypeScript errors in generated code
- Accessibility violations (WCAG failures)
- Theming broken in dark mode
- Community requesting same pattern for different frameworks

**Phase to address:**
Phase 1 (Pattern Storage MVP) - Store framework compatibility metadata
Phase 2 (Code Generation Engine) - Generate framework-specific variants
Phase 4 (Maintenance & Evolution) - Automated compatibility testing

---

### Pitfall 6: Premature Abstraction and Over-Engineering

**What goes wrong:**
Making patterns generic before understanding variation needs. Creating extensibility mechanisms never used. Building flexible pattern composition systems that add complexity without proven benefit. Wrong abstractions are harder to fix than duplication - they affect every dependent module.

**Why it happens:**
Engineers with "special place in their hearts for unnecessary abstractions" show prolific use of design patterns and make everything extensible in advance. Trying to predict future needs leads to wasted resources, unnecessary complexity, worse maintainability. YAGNI principle violated.

**How to avoid:**
- Wait for patterns to emerge - abstract on third repetition (WET principle)
- Duplication is cheaper than wrong abstraction - it's easy to delete duplicates
- Wait until there's pain, bugs, or maintenance burden before abstracting
- Identify concrete duplication, not superficial similarity
- Start simple - single use case working perfectly
- Resist urge to build "the ultimate pattern library"
- MVP: 10-20 high-quality patterns > 100 mediocre abstracted patterns

**Warning signs:**
- Patterns with configuration objects accepting 15+ options
- "Flexible" patterns nobody actually uses
- Pattern composition systems more complex than patterns themselves
- Documentation spending more time on extensibility than usage
- Community asking "how do I just make a simple button?"
- Code reviews discussing future hypothetical use cases

**Phase to address:**
Phase 1 (Pattern Storage MVP) - Start with simple, concrete patterns
Avoid building extensibility mechanisms until Phase 4

---

### Pitfall 7: Pattern Lookup Performance Degradation

**What goes wrong:**
Pattern lookups slow builds as catalog grows. Loading entire pattern library into memory on each request. No caching strategy leads to repeated database queries. Vector embeddings for pattern search cause high latency. Pattern matching becomes bottleneck as catalog exceeds 100+ patterns.

**Why it happens:**
Naive implementations load all patterns eagerly. No data locality optimization - patterns scattered across memory. Cache invalidation strategy missing or incorrect. Vector similarity search not optimized for production workloads. No consideration for build-time vs. runtime performance.

**How to avoid:**
- Implement lazy loading - only load patterns actually used
- Use pattern indexing with category/tag filters
- Cache patterns with intelligent replacement policies (LRU, LFRU)
- Optimize data locality - keep related patterns contiguous in memory
- Separate build-time patterns (loaded once) from runtime patterns (frequently accessed)
- Use machine learning-enhanced cache management for pattern recognition
- Profile pattern lookup performance with realistic catalog sizes (1K+ patterns)
- Consider compilation step - pre-generate code for common pattern combinations

**Warning signs:**
- Build times increasing linearly with pattern count
- Memory usage growing unbounded
- Pattern search taking >100ms
- Cache hit rate <80%
- Hot reload times exceeding 5 seconds
- Database query count scaling with pattern catalog size

**Phase to address:**
Phase 2 (Code Generation Engine) - Build caching and indexing
Phase 4 (Maintenance & Evolution) - Optimize for scale (1000+ patterns)

---

### Pitfall 8: Context Window Overload and Prompt Bloating

**What goes wrong:**
Dumping large llms.txt files or entire pattern catalogs into context crowds the context window, leading to poor performance, higher costs, and LLM "distraction" by stale or off-topic patterns. Including conflicting instructions between MCP servers and skills causes unpredictable behavior.

**Why it happens:**
Developers default to including everything "just in case". No pruning of irrelevant patterns for specific UI generation tasks. Pattern descriptions overly verbose. Using larger context windows increases latency and costs. No clear division of labor between MCP instructions (how to use tools) and skill instructions (workflow logic).

**How to avoid:**
- Use context-aware prompting - inject only relevant patterns based on task
- Prune pattern descriptions to essential information
- Separate MCP instructions (tool usage) from skill instructions (workflow)
- Implement pattern filtering based on UI requirements before LLM invocation
- Use prompt chaining - decompose complex UI generation into focused subtasks
- Track context usage and optimize for token efficiency
- Build pattern selection intelligence - don't send all patterns to LLM

**Warning signs:**
- Context usage consistently >80% of available window
- Generation latency increasing with catalog size
- Higher API costs without quality improvement
- LLM generating patterns that don't match requirements
- Conflicting or contradictory generated code
- Skills failing when multiple MCP servers active

**Phase to address:**
Phase 2 (Code Generation Engine) - Implement intelligent pattern filtering
Phase 3 (Skill Integration) - Optimize skill prompts for context efficiency

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-coding design tokens instead of variable references | Faster initial pattern creation | Token drift, inconsistency, difficult updates | Never - establishes bad precedent |
| Skipping framework version metadata | Simpler pattern storage schema | Cannot detect compatibility issues | Never in production patterns |
| No validation on pattern submission | Faster pattern addition workflow | Quality degradation, hallucinated patterns in catalog | Only in early Phase 1 prototype |
| Loading entire pattern catalog into context | Simpler implementation | Context bloat, high costs, poor performance | Only for catalogs <10 patterns |
| Single framework targeting only | Faster MVP development | Community fragmentation when multi-framework needed | Acceptable for Phase 1-2, plan migration for Phase 3 |
| Manual pattern quality reviews instead of automated | Lower upfront infrastructure cost | Quality inconsistency, review bottleneck | Acceptable until 50+ patterns, then automate |
| Storing patterns as plain text vs. structured data | Easier to get started | Difficult to query, filter, validate, or version | Only for initial prototype |
| No caching layer for pattern lookups | Simpler architecture | Performance degradation, database overload | Only for <100 pattern lookups/day |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Framework documentation APIs | Scraping docs without rate limiting or caching | Use RAG with cached, versioned framework docs; respect rate limits |
| Design system exports (Figma, etc.) | Polling for updates continuously | Webhook-based updates with change detection |
| Component registries (npm, etc.) | Hardcoding package versions | Dynamic version resolution with semver constraints |
| LLM APIs (Claude, GPT-4) | Sending full pattern catalog in every request | Context filtering with relevant pattern selection |
| Git repositories for pattern storage | No locking mechanism for concurrent edits | Optimistic locking or operational transformation |
| Vector databases for pattern search | Using cosine similarity without normalization | Normalized embeddings with hybrid search (vector + keyword) |
| CDN for pattern assets | No cache invalidation strategy | Cache keys tied to pattern version hash |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Sequential pattern loading | Slow startup times | Parallel loading, lazy loading, indexing | >50 patterns |
| No pattern result caching | Repeated identical API calls | LRU cache with 80%+ hit rate target | >100 requests/hour |
| Eager pattern validation | All patterns validated on every request | Lazy validation, validate on use | >200 patterns |
| Full-text pattern search | Search latency increasing | Vector embeddings + keyword index | >500 patterns |
| Synchronous code generation | UI blocks during generation | Async generation with streaming results | Generation >2 seconds |
| In-memory pattern storage only | Memory usage growing unbounded | Persistent storage with memory cache | >1000 patterns or >100MB |
| No build-time optimization | Every request regenerates common patterns | Pre-compile common pattern combinations | >1000 requests/day |
| Single-region pattern storage | High latency for global users | Multi-region CDN or edge caching | Global user base |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Executing user-provided pattern code without sandboxing | Arbitrary code execution, XSS | Sandbox pattern execution, CSP headers, code review |
| Storing API keys in pattern metadata | Credential leakage | Use environment variables, secret management service |
| No input validation on pattern submissions | Injection attacks, malicious patterns | Schema validation, sanitization, allowlist approach |
| Allowing arbitrary imports in patterns | Supply chain attacks | Whitelist approved dependencies only |
| No rate limiting on pattern generation | DoS via expensive LLM calls | Rate limit per user/IP, queue-based generation |
| Exposing internal framework details in patterns | Information disclosure | Abstract framework internals, minimal surface area |
| No audit trail for pattern modifications | Cannot trace security issues to source | Immutable append-only pattern history |
| Client-side pattern validation only | Bypass validation via API | Server-side validation required |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Generated code with no explanation | Users don't understand what code does or why | Include inline comments explaining pattern decisions |
| No preview before applying patterns | Users surprised by generated UI | Show preview with accept/reject/modify flow |
| All-or-nothing pattern application | Cannot customize generated code | Allow parameter customization before generation |
| No error messages when pattern fails | Users confused why generation failed | Clear error messages with suggested fixes |
| Assuming framework knowledge | Users don't know how to integrate generated code | Include integration instructions and working examples |
| No pattern search or discovery | Users don't know what patterns exist | Search, browse by category, popular patterns, recommendations |
| Generated code not matching project style | Inconsistent with existing codebase | Learn from existing code, match conventions |
| No way to report pattern quality issues | Bad patterns persist indefinitely | Feedback mechanism with voting/reporting |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Pattern validation:** Often missing edge case testing - verify against React/Vue/Svelte, SSR/CSR, TypeScript strict mode
- [ ] **Accessibility:** Often missing ARIA labels, keyboard navigation, screen reader testing - verify WCAG 2.1 AA compliance
- [ ] **Dark mode:** Often missing dark mode tokens or testing - verify both themes work
- [ ] **Responsive design:** Often missing mobile/tablet breakpoints - verify across viewport sizes
- [ ] **Error boundaries:** Often missing error handling in generated components - verify error states
- [ ] **Loading states:** Often missing loading UI during async operations - verify skeleton states
- [ ] **Framework compatibility metadata:** Often missing version constraints - verify semver ranges specified
- [ ] **Performance budgets:** Often missing performance testing - verify Time to Interactive <3s
- [ ] **Pattern documentation:** Often missing usage examples and props documentation - verify completeness
- [ ] **Internationalization:** Often missing i18n support or hardcoded strings - verify locale handling
- [ ] **Security review:** Often missing XSS/injection prevention - verify input sanitization
- [ ] **Browser compatibility:** Often missing cross-browser testing - verify Safari/Firefox/Chrome

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Pattern quality degradation | MEDIUM | 1. Audit all patterns for quality metrics 2. Re-generate low-quality patterns with improved prompts 3. Implement validation gates 4. Version control rollback to known-good state |
| State management amnesia | HIGH | 1. Migrate to stateful architecture 2. Add session management layer 3. Migrate existing skills 4. User communication about temporary disruption |
| Knowledge base staleness | LOW | 1. Automated scan for outdated patterns 2. Bulk update with current framework versions 3. Notify pattern owners 4. Archive deprecated patterns |
| LLM hallucination patterns | MEDIUM | 1. Identify hallucinated patterns via testing 2. Quarantine invalid patterns 3. Re-generate with RAG-enhanced prompts 4. Implement validation before storage |
| Framework compatibility issues | MEDIUM | 1. Catalog framework versions and pattern compatibility 2. Generate framework-specific variants 3. Update metadata 4. Deprecation warnings for incompatible patterns |
| Premature abstraction | HIGH | 1. Identify unused abstraction mechanisms 2. Simplify to concrete use cases 3. Delete dead code 4. Refactor dependent code - affects entire codebase |
| Performance degradation | MEDIUM | 1. Profile to identify bottleneck 2. Implement caching layer 3. Add indexing 4. Optimize data structures 5. Load testing validation |
| Context window overload | LOW | 1. Implement pattern filtering 2. Prune verbose descriptions 3. Use prompt chaining 4. Monitor context usage metrics |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Pattern quality degradation | Phase 1 (Storage) + Phase 2 (Generation) | Quality metrics tracked, validation gates enforced, no degradation over 10 iterations |
| State management amnesia | Phase 1 (Storage) | Multi-turn conversation flows work, state persists across requests |
| Knowledge base staleness | Phase 1 (Storage) + Phase 4 (Maintenance) | Automated drift detection runs weekly, outdated patterns flagged within 30 days of framework release |
| LLM hallucination | Phase 2 (Generation) + Phase 3 (Skill) | Generated patterns validate against actual framework APIs, <5% hallucination rate |
| Framework compatibility | Phase 1 (Storage) + Phase 2 (Generation) | Patterns tested against framework matrix, compatibility metadata accurate |
| Premature abstraction | Phase 1 (Storage) | Pattern catalog contains concrete patterns only, no unused extensibility mechanisms |
| Performance degradation | Phase 2 (Generation) + Phase 4 (Maintenance) | Pattern lookup <100ms p95, build time scales sub-linearly with catalog size |
| Context window overload | Phase 2 (Generation) + Phase 3 (Skill) | Context usage <50% of available window, token efficiency improving over time |

## Sources

### Claude Code & MCP Architecture
- [Extending Claude's capabilities with skills and MCP](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)
- [Understanding Claude Code's Full Stack: MCP, Skills, Subagents, and Hooks Explained](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en)
- [MCP Server Architecture: State Management, Security & Tool Orchestration](https://zeo.org/resources/blog/mcp-server-architecture-state-management-security-tool-orchestration)
- [MCP: Memory and State Management](https://medium.com/@parichay2406/mcp-memory-and-state-management-8738dd920e16)

### Code Generation Quality & Hallucinations
- [Security Degradation in Iterative AI Code Generation: A Systematic Analysis](https://arxiv.org/html/2506.11022v2)
- [AI vs human code gen report: AI code creates 1.7x more issues](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [LLM Hallucinations in Practical Code Generation: Phenomena, Mechanism, and Mitigation](https://arxiv.org/html/2409.20550v1)
- [Detecting and Correcting Hallucinations in LLM-Generated Code](https://arxiv.org/pdf/2601.19106)

### Design Patterns & Anti-Patterns
- [OOP Design Patterns and Anti-Patterns: What Works and What Fails](https://blog.bytebytego.com/p/oop-design-patterns-and-anti-patterns)
- [Prevalence and severity of design anti-patterns in open source programs](https://www.sciencedirect.com/science/article/abs/pii/S095058492400034X)

### UI Component Libraries & Framework Compatibility
- [15 Best React UI Libraries for 2026](https://www.builder.io/blog/react-component-libraries-2026)
- [Design system versioning: single library or individual components?](https://bradfrost.com/blog/post/design-system-versioning-single-library-or-individual-components/)
- [Component Versioning - Engineering Fundamentals Playbook](https://microsoft.github.io/code-with-engineering-playbook/source-control/component-versioning/)

### Design System Maintenance & Token Drift
- [Design Systems in 2026: Predictions, Pitfalls, and Power Moves](https://rydarashid.medium.com/design-systems-in-2026-predictions-pitfalls-and-power-moves-f401317f7563)
- [Knowledge Base Maintenance: A Practical Framework](https://www.helpscout.com/blog/knowledge-base-maintenance/)

### Prompt Engineering & Context Optimization
- [Enhancing Code Generation in Low-Code Platforms through Systematic Prompt Engineering](https://www.ijraset.com/best-journal/enhancing-code-generation-in-lowcode-platforms-through-systematic-prompt-engineering)
- [Prompt Chaining for AI Engineers: A Practical Guide](https://www.getmaxim.ai/articles/prompt-chaining-for-ai-engineers-a-practical-guide-to-improving-llm-output-quality)
- [Prompt Engineering Cheat Sheet for GPT-5](https://www.freecodecamp.org/news/prompt-engineering-cheat-sheet-for-gpt-5/)

### Performance & Optimization
- [The Complete Guide to Caching: Patterns, Policies, and Tools](https://medium.com/@spasvcholakov/the-complete-guide-to-caching-patterns-policies-and-tools-that-will-transform-your-application-0c95a4ae2b4a)
- [Machine Learning-Enhanced Database Cache Management](https://www.mdpi.com/2076-3417/16/2/666)
- [Code Optimization Guide for C/C++ Developers (2026)](https://www.wedolow.com/resources/code-optimization)

### Premature Optimization & Over-Abstraction
- [Premature Abstraction is the Root of All Evil](https://medium.com/@ricrivero3/premature-abstraction-is-the-root-of-all-evil-7309762c0635)
- [Premature Abstractions: Avoiding Unnecessary Complexity](https://read.thecoder.cafe/p/premature-abstractions)
- [Software Performance Engineering: The Ideas I Keep Coming Back To](https://ricomariani.medium.com/software-performance-engineering-the-ideas-i-keep-coming-back-to-6f421b6a9505)

### Testing & Debugging
- [How to use Claude Code Skills for Testing?](https://apidog.com/blog/claude-code-web-app-testing-2026/)
- [Playwright Skill for Claude Code](https://github.com/lackeyjb/playwright-skill)

---
*Pitfalls research for: Claude Code Skills & Design Pattern Libraries*
*Researched: 2026-02-02*
