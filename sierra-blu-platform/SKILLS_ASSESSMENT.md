# Skills & Tools Assessment Report

**Assessment Date:** 2026-06-09  
**Session Model:** Claude Haiku 4.5 (claude-haiku-4-5-20251001)  
**Scope:** Skills, Subagents, and MCP Server integrations available in this session

---

## Executive Summary

This environment offers comprehensive tooling for software engineering, design, and workflow automation. **Strengths:** broad MCP coverage (Figma, Airtable, GitHub, Vercel), 14 reusable skills, and 5 specialized subagent types. **Gaps:** limited backend/infrastructure skills, no native testing framework skills beyond TDD, weak project/team management. **Risks:** auto-approval protocol in AGENTS.md poses safety concerns; terminology mandate requires careful enforcement across disparate tools.

---

## I. Skills Inventory (14 total)

### A. Software Engineering & Testing (3 skills)
| Skill | Purpose | Maturity | Use Case |
|-------|---------|----------|----------|
| **tdd** | Test-driven development with red-green-refactor | Mature | Feature development, bug fixes requiring tests |
| **code-review** | Bug hunting & simplification at configurable effort | Mature | Pre-merge quality gate, refactoring validation |
| **simplify** | Code reuse/efficiency review (quality-only) | Mature | Post-change cleanup without bug-hunting overhead |

**Assessment:** Solid foundational coverage. TDD + code-review covers most dev workflows. Simplify allows focused optimization passes. No skills for performance profiling, load testing, or security hardening beyond `/code-review --high`.

### B. Architecture & Refactoring (3 skills)
| Skill | Purpose | Maturity | Risk |
|-------|---------|----------|------|
| **improve-codebase-architecture** | Find refactoring opportunities using domain context (CONTEXT.md, ADR docs) | High | Assumes repos have CONTEXT.md & docs/adr/; will fail silently if missing |
| **request-refactor-plan** | Create detailed refactor plan via user interview, file as GitHub issue | Mature | Good for large refactors; interview-driven approach adds overhead |
| **migrate-to-shoehorn** | Replace `as` assertions with @total-typescript/shoehorn in tests | Niche | TypeScript-only; no equivalent for other languages |

**Assessment:** Architecture tools assume well-documented repos. Migrate-to-shoehorn is overly specific (single package). Refactoring interview approach is thorough but slower; no quick "auto-refactor" option.

### C. Documentation & Communication (3 skills)
| Skill | Purpose | Maturity |
|-------|---------|----------|
| **init** | Initialize CLAUDE.md codebase documentation | Mature |
| **edit-article** | Revise/improve article drafts | Niche |
| **to-prd** | Convert current context into PRD + GitHub issue | Mature |

**Assessment:** Good for initial setup and issue filing. Article editing is narrow (articles only). Missing: README/changelog generation, API documentation, docstring/comment linting.

### D. Planning & Issue Management (3 skills)
| Skill | Purpose | Maturity |
|-------|---------|----------|
| **to-issues** | Break plans/specs into vertical-slice GitHub issues | Mature |
| **triage-issue** | Investigate bug + TDD-based fix plan + create issue | Mature |
| **grill-me** | Stress-test plans/designs via relentless interview | Mature |

**Assessment:** Strong issue workflow (triage → to-issues → to-prd). Grill-me adds design rigor. Missing: backlog grooming, sprint planning, capacity planning skills.

### E. Configuration & Workflow (2 skills)
| Skill | Purpose | Maturity | Notes |
|-------|---------|----------|-------|
| **keybindings-help** | Customize ~/.claude/keybindings.json | Mature | Claude Code CLI only |
| **session-start-hook** | Create SessionStart hooks for Claude Code on the web | Emerging | Repository-specific setup; incomplete coverage |

**Assessment:** Keybindings are CLI-specific. SessionStart hook is narrow. Missing: environment variable setup (there's `update-config` but it's not listed as a skill), secrets management, CI/CD hook configuration.

### F. Specialized (2 skills)
| Skill | Purpose | Maturity | Assessment |
|-------|---------|----------|-----------|
| **scaffold-exercises** | Create exercise directory structures (sections, problems, solutions) | Niche | Education-focused; overkill for normal projects |
| **write-a-skill** | Create new agent skills with proper structure | Internal | Meta-skill; unclear lifecycle for new skills |

**Assessment:** Exercise scaffolding is useful for course work but unused in typical SDLC. Write-a-skill is meta but underdocumented.

### G. Infrastructure & Deployment (0 skills)
**Gap:** No skills for CI/CD pipelines, container management, database migrations, infrastructure-as-code, or cloud deployments. Vercel integration exists (via MCP), but no skill wraps it.

---

## II. Subagent Types (5 total)

| Subagent | Best For | Limitations |
|----------|----------|-------------|
| **claude** (default) | Fallback for uncategorized work | Catch-all; no specialization |
| **claude-code-guide** | Claude Code CLI, SDK, API questions | Narrow scope (self-referential) |
| **Explore** | Fast code search by pattern/symbol | Read-only; can't cross-file consistency checks |
| **general-purpose** | Complex research, multi-step searches | Slower; overkill for simple lookups |
| **Plan** | Architecture design, implementation strategies | Output is a plan; doesn't implement |
| **statusline-setup** | Configure Claude Code CLI statusline | Ultra-specific; one use case |

**Assessment:**
- **Gaps:** No agents for security audits, performance analysis, dependency analysis, DevOps troubleshooting, or API design review.
- **Overlaps:** `Explore` (fast) vs. `general-purpose` (thorough) creates ambiguity on which to use.
- **Usability:** Plan agent requires explicit `ExitPlanMode` call post-design; no auto-hand-off to implementation.

---

## III. MCP Server Integrations (10 active)

### A. Design & Frontend (3)
| Server | Tools | Strength | Gap |
|--------|-------|----------|-----|
| **Figma** | Design context, code connect, diagrams | Industry-standard; bidirectional code-design sync | FigJam collab features underutilized |
| **Gamma** | Presentations, documents, webpages | Great for slide/doc generation; templates available | Can't edit existing gammas (read-only modifications) |
| **Canva** | Design creation | No docs provided; assumed read-only | Tool schema not loaded (MCP server connecting) |

### B. Data & Workflow (2)
| Server | Tools | Strength | Limitation |
|--------|-------|----------|-----------|
| **Airtable** | Base/table/record CRUD + filters | Flexible schemas; good for lightweight CRMs | Requires exact IDs (no user-facing name substitution); pagination not auto-handled |
| **GitHub** | Repo ops, PRs, actions, search, CI logs | Comprehensive; covers most GitHub workflows | No native PR diff viewing (must use get_diff) |

### C. Deployment & Infrastructure (2)
| Server | Tools | Strength | Gap |
|--------|-------|----------|-----|
| **Vercel** | Deploy, logs, domain check, Toolbar thread management | Fast deployments; build/runtime log access | No rollback, no env var management, no team permissions |
| **Linear** | Issue tracking, documents, diffing | Alternative to GitHub Issues; document-centric | Limited integration with GitHub (requires manual sync) |

### D. Productivity (2)
| Server | Tools | Strength | Gap |
|--------|-------|----------|-----|
| **Gmail** | Draft, search, label management | Basic email workflow | No attachment handling at scale; template management weak |
| **Google Calendar** | Create, list, suggest time, RSVP | Meeting scheduling | No agenda templates, no busy-time conflict resolution |

### E. Analytics (1)
| Server | Scope | Limitation |
|--------|-------|-----------|
| **Motion** | Meta/Facebook ad analytics only | Platform lock-in; no TikTok, YouTube, LinkedIn data |

### F. Missing Integrations
**No MCP servers for:**
- Slack (team communication)
- Jira (enterprise issue tracking)
- Datadog / New Relic (observability)
- AWS / GCP / Azure (cloud infrastructure)
- Docker Hub / Container registries
- API testing frameworks (Postman, Insomnia)
- Dependency scanning (Snyk, Dependabot)

---

## IV. Coverage Analysis

### Strong Domains
✅ **Code-to-Design (Figma):** Full bidirectional sync via Code Connect  
✅ **GitHub Workflows:** Comprehensive API; PR, action, and CI coverage  
✅ **Software Engineering:** TDD, code review, testing well-supported  
✅ **Issue Triage & Planning:** Multi-skill workflow (triage → plan → issues)  
✅ **Presentation/Documentation:** Gamma + Markdown editing  

### Moderate Domains
⚠️ **Data Management:** Airtable (lightweight) but no SQL/relational DB tools  
⚠️ **Deployment:** Vercel only; no multi-cloud, no secrets management  
⚠️ **Ad Analytics:** Motion (Meta only); no other platforms  

### Weak/Missing Domains
❌ **Backend/Infrastructure:** No Docker, K8s, Terraform, Lambda, or IaC tools  
❌ **Database Management:** No schema migration, no SQL tooling  
❌ **Security:** No SAST, DAST, secrets scanning, or vulnerability assessment  
❌ **DevOps:** No CI/CD pipeline creation, no log aggregation  
❌ **Observability:** No APM, no metrics, no tracing  
❌ **Team Management:** No Slack, no team/permissions tools  
❌ **API Testing:** No Postman, no test automation for API contracts  
❌ **Dependency Management:** No dependency scanning, no license compliance  

---

## V. Risk Assessment

### 🔴 High-Risk Issues

**1. Auto-Approval Protocol (AGENTS.md)**
```
"Auto-Approval Protocol": User has granted permission for agents to proceed 
with `run_command` or "access" requests automatically if no response within 15 seconds.
```
- **Risk:** Destructive git commands, env var changes, or secret pushes could execute unintentionally.
- **Mitigation:** Add explicit confirmation for `git push`, `git reset --hard`, and secret-related operations.
- **Current State:** Protocol exists but lacks guardrails in subagents.

**2. Terminology Mandate (AGENTS.md)**
```
"Terminology Mandate": Always use "Investment Stakeholders" (not leads), 
"Strategic Pipeline" (not CRM), "Portfolio Assets" (not listings) 
in both code comments and UI updates to preserve the "Cinematic Luxury" brand.
```
- **Risk:** Inconsistent enforcement across MCP tools (Figma, Airtable, Linear). Non-adherence requires manual review.
- **Current State:** Documented but unverified compliance in generated designs/comments.

### 🟡 Medium-Risk Issues

**3. MCP Server Dependencies**
- Multiple servers (Figma, GitHub, etc.) are **required for critical workflows** but provide no fallback.
- If Figma goes down, design-to-code is blocked; if GitHub goes down, all CI/CD fails.
- **Mitigation:** Document fallback workflows (e.g., manual Figma export, local testing).

**4. Skill Interdependencies**
- `/improve-codebase-architecture` requires CONTEXT.md and docs/adr/ to exist—silent failure if missing.
- `/migrate-to-shoehorn` is TypeScript-only; no equivalent for Python/Go/Rust.
- **Mitigation:** Add pre-flight checks or defensive defaults.

**5. Plan Agent → Implementation Gap**
- `Plan` agent outputs a plan but doesn't hand off to implementation.
- Users must manually pick up and execute; no integrated feedback loop.
- **Mitigation:** Create a follow-up skill (`execute-plan`) or improve Plan agent handoff.

### 🟢 Low-Risk Issues

**6. Gamma Read-Only Limitations**
- Cannot edit existing gammas; must regenerate.
- **Mitigation:** Document regeneration flow or provide Gamma editor direct access.

**7. Airtable ID Requirements**
- Tools require exact Airtable internal IDs, no name lookup.
- **Mitigation:** Provide ID lookup helper or relax requirement to name-based search.

---

## VI. Skill Maturity Matrix

```
Mature (Production-Ready):
  ✅ tdd, code-review, simplify, improve-codebase-architecture, 
     request-refactor-plan, to-issues, triage-issue, to-prd, 
     edit-article, init, grill-me, keybindings-help

Emerging (Needs Refinement):
  🟡 session-start-hook (narrow scope, repo-specific setup)
  🟡 write-a-skill (meta; unclear lifecycle)

Niche (Limited Scope):
  🟠 scaffold-exercises (education only)
  🟠 migrate-to-shoehorn (TypeScript only)
```

---

## VII. Overlap Analysis

| Capability | Skill | Subagent | MCP | Notes |
|------------|-------|----------|-----|-------|
| Issue creation | `to-issues`, `to-prd`, `triage-issue` | — | GitHub | Redundant; no clear demarcation |
| Code review | `code-review` | — | — | Standalone; good |
| Architecture review | `improve-codebase-architecture`, `grill-me` | Plan | — | Grill-me is broader; Plan is slower |
| Refactoring | `request-refactor-plan`, `simplify`, `migrate-to-shoehorn` | — | — | Simplify is auto; others are manual + interview |
| Design | — | — | Figma, Gamma, Canva | Three design tools; unclear when to use each |
| Data retrieval | — | Explore, general-purpose | Airtable, GitHub | Subagent vs. MCP creates ambiguity |

**Recommendation:** Create decision trees or routing rules to clarify when each tool is appropriate.

---

## VIII. Recommendations

### Immediate Actions (High Impact)

1. **Add Safety Guardrails to Auto-Approval**
   - Exclude git push, git reset, env var changes, and secret operations from auto-approval.
   - Require explicit user confirmation for destructive commands.

2. **Document MCP Tool Selection Guide**
   - When to use Figma vs. Gamma vs. Canva
   - When to use Airtable vs. GitHub Issues for data
   - When to use Explore vs. general-purpose subagent

3. **Create Terminology Enforcement Checklist**
   - Add pre-commit hook or linter to verify "Investment Stakeholders" / "Strategic Pipeline" / "Portfolio Assets" usage in generated code.
   - Document exceptions (e.g., user-facing UI text may need different language).

4. **Add Skill Pre-Flight Checks**
   - Improve-codebase-architecture should verify CONTEXT.md & docs/adr/ exist before invoking.
   - Migrate-to-shoehorn should check for TypeScript config; fail gracefully if missing.

### Short-Term Improvements (Weeks 1–2)

5. **Create Missing Infrastructure Skills**
   - `/docker-setup`: Initialize Docker configuration and Dockerfile for project type.
   - `/terraform-init`: Set up Terraform for cloud infrastructure.
   - `/ci-cd-setup`: Create GitHub Actions or similar CI/CD pipeline.

6. **Extend Backend/Database Skills**
   - `/migration-plan`: Design safe database schema migrations (like `/request-refactor-plan` but for DB).
   - `/performance-profile`: Hook into APM tools (if available) to identify bottlenecks.

7. **Improve Subagent Routing**
   - Add explicit guidance on Explore vs. general-purpose (e.g., "Explore: simple pattern match; general-purpose: multi-round research").
   - Create a subagent for security/dependency audits.

8. **Enhance Plan Agent Handoff**
   - Add `/execute-plan` skill that reads Plan output and begins implementation.
   - Provide feedback loop (e.g., "Implement step 3 → report blockers → refine plan").

### Long-Term Roadmap (Months 1–3)

9. **Add Observability & Monitoring**
   - Integrate with Datadog, New Relic, or CloudWatch for log/metric queries.
   - Create `/incident-response` skill for production troubleshooting.

10. **Expand Cloud & Infrastructure Coverage**
    - Add AWS, GCP, Azure integrations via MCP.
    - Create multi-cloud skills (e.g., `/deploy-to-cloud` abstracts provider differences).

11. **Build Team/Collaboration Features**
    - Slack integration for notifications, reviews, approvals.
    - Jira integration for enterprise issue tracking.
    - Calendar + team capacity planning (builds on Google Calendar).

12. **Strengthen Security Posture**
    - SAST/DAST integration (e.g., Snyk, Semgrep).
    - `/security-audit` skill for code reviews focused on OWASP Top 10.
    - Secrets scanning pre-push (integrate with git hooks).

---

## IX. Conclusion

This environment provides **solid foundational tooling** for software engineering, design, and workflow automation. Strengths in code-to-design workflows, GitHub integration, and issue management make it suitable for full-stack frontend/backend development on well-scoped projects.

**Critical gaps** in infrastructure, security, and observability limit applicability to DevOps, backend infrastructure, and production incident response. **High-risk items** (auto-approval protocol, terminology enforcement) require immediate attention before scaling.

**Recommendation:** 
1. Implement safety guardrails immediately (auto-approval).
2. Add 3–5 critical missing skills (Docker, CI/CD, migration).
3. Create routing docs to reduce tool ambiguity.
4. Reassess in 4 weeks to track adoption and identify new gaps.

---

**Report prepared by:** Claude Haiku 4.5  
**Confidence Level:** High (based on available docs and MCP server schemas)  
**Last Updated:** 2026-06-09
