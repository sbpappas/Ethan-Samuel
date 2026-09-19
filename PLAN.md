# Bluebook Case-Citation Generator — MVP Plan

## Context

Existing online Bluebook citation generators are widely disliked because they rely on rigid template strings, miss short-form/"Id." rules, ignore court- and jurisdiction-specific reporter quirks, and mishandle italics and parallel citations. The goal of this project is a web app for lawyers and law students that gets Bluebook case citations *right*, starting narrow (case citations only) and building outward.

The repo is currently empty (just `README.md`). This is a from-scratch greenfield build.

Decisions locked in with the user:
- **MVP scope**: Case citations only (Bluebook Rule 10). Other source types (statutes, books, articles, constitutions) come later; the architecture must anticipate them without requiring a rewrite.
- **UX model**: Guided structured form (pick "Case," fill fields) — not free-text parsing.
- **Persistence**: Full accounts + saved citation libraries organized into documents/projects, not just localStorage.
- **Stack**: Separate Express (Node/TS) API + Vite/React SPA — not Next.js. This keeps the citation-engine as a standalone, framework-agnostic package with a clean API boundary for future clients (CLI, browser extension, Word plugin).
- **Auth**: Email/password with server-side sessions for MVP (no OAuth yet; can be added later behind the same session abstraction).
- **Reporter/jurisdiction data scope for MVP**: Federal reporters (U.S., S. Ct., F./F.2d/F.3d, F. Supp./F. Supp. 2d/3d) plus Oklahoma, Texas, California, and New York reporters.
- **Export scope for MVP**: On-screen rendering with correct italics + plain-text copy-to-clipboard only. No Word/RTF export yet, but the rendering layer must be designed so that target can be added without touching the citation engine itself.

## Architecture

**Monorepo** via pnpm workspaces:

```
/apps
  /web        Vite + React + TS SPA
  /api        Express + TS API
/packages
  /citation-engine   framework-agnostic pure TS library, zero/minimal runtime deps
```

- **Database**: PostgreSQL via **Prisma ORM**. Relational fit is deliberate — users → documents → ordered citation entries, and short-form/"Id." logic depends on *ordering*, which Postgres with explicit position columns handles cleanly.
- **Auth**: email/password, Argon2/bcrypt hashing, session ID in an httpOnly/secure cookie, session store in Postgres (`express-session` + `connect-pg-simple` or a small hand-rolled sessions table). No JWT — avoids revocation/refresh complexity not needed at this scale. Google OAuth can be layered in later behind the same session interface.
- **citation-engine** is imported by both `apps/web` (instant client-side live preview while filling the form — no round trip needed) and `apps/api` (authoritative render on save), so formatting logic lives in exactly one place.

## Citation Rules Engine Design (the core differentiator)

Replace "one big template string with if/else special cases" with a **data-driven, composable, token-based pipeline**.

1. **Domain types**: a discriminated union `CitationSource` (`{ kind: 'case', ... } | { kind: 'statute', ... } | ...`). V1 only implements `case`, but every future source type is forced through the same shape.
2. **Reference data as plain TS/JSON, separate from logic**:
   - `reporters.ts` — abbreviation, full name, jurisdiction, court(s) covered, whether a court parenthetical is required (e.g. `U.S.` implies SCOTUS, no parenthetical; `F.3d` requires a circuit parenthetical). Scope: federal + OK, TX, CA, NY per above.
   - `courts.ts` — court name → Bluebook abbreviation, keyed by jurisdiction.
   - `caseNameAbbreviations.ts` — Table 6/10-style word abbreviation map (`Association → Ass'n`, `Corporation → Corp.`, geographic terms, etc.).
3. **Pure formatter functions**, one per Bluebook sub-rule, composed rather than templated:
   - `formatCaseName`, `formatReporterCite`, `formatCourtDateParenthetical`, `formatPincite`, `formatParallelCitations`, composed by `assembleCaseCitation`.
   - Each takes structured input and returns structured output — never a raw string.
4. **Token-based output, not strings.** Every formatter returns `CitationToken[]` (e.g. `{ text: 'Brown v. Board of Education', italic: true }`). This solves italics correctly by construction: the React app renders tokens to `<i>` tags for on-screen display; a plain-text/clipboard renderer strips italics per typewriter convention. A future Word/RTF renderer is just another consumer of the same tokens — no engine changes needed.
5. **Extensibility via a formatter registry**: a `CitationFormatter<T>` interface registered per `kind`. Adding statutes later means writing and registering a new module — the case module is untouched.

### Short-form / "Id." handling (stateful, not per-citation)

- A `CitationSequencer` operates on the **ordered list of citation entries within a document** and computes, per entry: full form, Bluebook short form (Rule 10.9), or "Id." (valid only when the immediately preceding cited authority is the same source — any intervening different citation breaks the chain).
- Same-source identity is determined by normalized case name + reporter + volume + first page, not database row identity — a user could add the same case to their library twice, and the engine must still treat repeat entries in a document as the same authority.
- Default behavior: sequencing is automatic from document order, but the UI should let the user manually pin an entry to full form even when short-form/Id. would be technically correct (writers do this deliberately for clarity in long documents). This is a UI-level override on top of the engine's computed suggestion, not a change to the engine's core logic.

### Copyright constraint (flag, not silently solved)

The Bluebook's own rule text/explanatory prose is copyrighted (Harvard Law Review Association et al.). This plan implements independently authored **formatting logic and factual reference tables** (reporter abbreviations, court names — facts, not copyrightable), and avoids copying Bluebook rule text into code, UI copy, or docs. Test fixtures should use real, independently-verifiable public-domain case citations (e.g. *Brown v. Board of Education*, 347 U.S. 483 (1954)), never the Bluebook's own example sentences. **Recommend a legal review of this boundary before any public/commercial launch** — not an MVP blocker, but should not be forgotten.

## Data Model

- **User**: `id, email, passwordHash, name, createdAt`
- **Citation** (library item, reusable across documents): `id, ownerId, kind, caseName{plaintiff, defendant}, reporterVolume, reporterAbbrev, firstPage, pincite, court, year, parallelCitations[jsonb], renderedFullTokens[jsonb], renderedShortTokens[jsonb], createdAt, updatedAt`. Rendered tokens cached at save time, recomputed if source fields change.
- **Document** (project): `id, ownerId, title, createdAt, updatedAt` — a named, ordered collection of citations.
- **DocumentEntry** (join table, carries order): `id, documentId, citationId, position, createdAt`. Id./short-form state is computed from this ordered list at render time (or recomputed and cached on write) via `CitationSequencer` — it is not a fixed fact stored on `Citation`, since the same citation can appear in multiple documents/positions with different sequencing context each time.

This model already supports a future "Table of Authorities" view (grouping/sorting a document's citations) without schema changes — noted for later, not built now.

## Project Structure

```
/apps
  /web
    /src/features/citations    CaseForm, PartyNameInput, ReporterPicker, LiveCitationPreview
    /src/features/documents    DocumentList, CitationSequenceView (drag-reorder)
    /src/api-client            typed fetch wrappers using shared types from citation-engine
    /src/state                 React Query (server state) + local UI state
  /api
    /src/routes                auth.ts, documents.ts, citations.ts
    /src/services               documentService, citationService (calls citation-engine)
    /src/db                     prisma/schema.prisma, prisma client
    /src/middleware              session auth, error handling

/packages
  /citation-engine
    /src/types                 CitationSource union, CitationToken, CitationContext
    /src/rules/case             formatCaseName.ts, formatReporter.ts, formatCourtDate.ts,
                                 formatPincite.ts, formatParallelCitations.ts, assembleCaseCitation.ts
    /src/rules/shortform         idRule.ts, shortFormCase.ts, citationSequencer.ts
    /src/data                    reporters.ts, courts.ts, caseNameAbbreviations.ts
    /src/render                  tokensToHtml.ts, tokensToPlainText.ts
    /test/golden                 fixtures: structured input -> expected token output (real, public-domain cases)
```

## Phased Build Order

1. **Phase 0** — pnpm workspace scaffold, TS/lint config, empty package skeletons.
2. **Phase 1** — `citation-engine` core: full-citation formatting for Rule 10 (case name, reporter, court/date parenthetical, pincite), token output, golden-case unit tests. Proven via test suite alone, no UI.
3. **Phase 2** — Guided React form (client-only, no backend) using the engine directly: fill fields → live-rendered, correctly italicized citation → copy as text. **First demoable artifact.**
4. **Phase 3** — Extend engine with `CitationSequencer` (short form/Id.); demo multiple citations in local React state (in-memory array) showing correct sequencing — still no backend.
5. **Phase 4** — Backend scaffold: Express + Prisma + Postgres schema (User/Document/Citation/DocumentEntry), CRUD wired end-to-end behind a single dev-only hardcoded user (no auth yet).
6. **Phase 5** — Real auth (register/login/session), scope documents/citations to the logged-in user.
7. **Phase 6** — Full persistence UX: save to library, create/manage documents, drag-reorder citations (recomputing id./short-form on reorder), plain-text export of a document's citation list.
8. **Phase 7** — Polish: parallel citations UI, expand reporter/jurisdiction data beyond the MVP set, deployment.

## Testing Strategy

- **Per-formatter unit tests** covering edge cases: corporate designator abbreviation, "In re"/"Ex parte" single-party cases, consolidated cases with "et al.", geographic term abbreviation.
- **Golden test suite**: curated real, public-domain case citations (e.g. *Marbury v. Madison*, 5 U.S. (1 Cranch) 137 (1803); *Roe v. Wade*, 410 U.S. 113 (1973)) as input → expected-token fixtures.
- **Sequencing scenario tests**: e.g. a document citing `[A, A, B, A]` asserts 2nd A → "Id.", B → full form, 3rd A (after B intervenes) → short form, not "Id.".
- **Snapshot tests** for token→HTML rendering confirming italics land exactly around case names/"Id." and nowhere else.
- CI treats golden-case failures as high severity — correctness is the entire value proposition.
- Light Playwright e2e once the guided form exists, to catch UI/engine integration regressions.

## Verification (once implementation starts)

- Run `citation-engine`'s golden test suite (`pnpm --filter citation-engine test`) after Phase 1 — this is the primary correctness gate.
- After Phase 2, manually exercise the guided form in the browser (`pnpm --filter web dev`) with a handful of real cases (including an edge case like *In re Gault* or a consolidated case) and confirm the rendered citation matches Bluebook by hand-check.
- After Phase 3, manually build a short in-app sequence of citations and confirm Id./short-form output matches expected Bluebook Rule 10.9 behavior for the `[A, A, B, A]`-style scenario.
- After Phase 4-6, exercise full CRUD (register, login, save citation, create document, reorder, log out/in, confirm persistence) via the running app end-to-end.

## Open Questions Still Deferred

- **Hosting targets** for eventual deployment (Vercel/Railway/Render/Fly.io/self-hosted) — not needed until Phase 7.
- **Google OAuth** — deferred, can be added behind the existing session abstraction whenever desired.
