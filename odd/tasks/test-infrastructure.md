# Test Infrastructure

## Objective

Prepare the complete pnpm workspace for test-driven development using Vitest in the backend, frontend, and domain packages, with Storybook for isolated frontend component development and browser-level story tests.

## Problem

The backend is the only package with an operational test runner. The frontend has no test infrastructure or Storybook, the domain package has only a failing placeholder, and the root test command does not cover the workspace.

## Why

A reliable workspace-wide test contract is required before product features begin. One consistent runner reduces cognitive overhead, while Storybook provides the browser-facing component boundary needed by the frontend.

## Scope

- Configure Vitest for `packages/domain`.
- Ensure all backend tests run through Vitest.
- Configure frontend Vitest and Storybook browser tests.
- Provide one root command that covers every workspace package.
- Normalize test-related scripts, lockfile ownership, and generated-output ignores.

## Constraints

- All backend, frontend, and domain tests must use Vitest.
- Storybook must support Next.js 16 App Router, React 19, Tailwind 4, and pnpm.
- `packages/domain` must remain framework-independent.
- Do not add speculative end-to-end infrastructure.
- Tests must verify behavior through public interfaces.
- Keep tests, configuration, and supporting documentation in the same work unit as the capability they establish.
- The 400 authored-line guideline is advisory; do not omit necessary tests or configuration to fit it.

## Authorized Scope

- Root workspace manifests, lockfile, ignore files, and test documentation.
- `packages/domain` package/configuration and minimal test infrastructure.
- `apps/backend` Vitest configuration and scripts.
- `apps/frontend` package/configuration, `.storybook/`, and minimal representative test/story files.
- Branch-local work-unit commits. Pushes, pull requests, and merges remain human decisions.

## TDD Configuration

- Current mode: disabled.
- Source: `sdd/tiza/testing-capabilities` baseline.
- Reason: no workspace-wide test command currently covers every package.
- Target runner: `pnpm test`, delegating to Vitest in every package.

## Delivery

- Strategy: `ask-on-risk`.
- Branch: `feature/test-infrastructure` from `develop`.
- Forecast: approximately 250–400 authored changed lines, excluding the generated lockfile.
- Planned PR target: `develop`.

## Tasks

- [x] **TST-000 — Remove generated dependencies from version control**
  - Route: delegated.
  - Trigger: repository-wide tracked generated files must be cleaned before dependency installation.
  - Add dependency/build output ignores and remove the 32,151 tracked `node_modules/` files from the Git index without deleting local files.
  - Verification: Git tracks no `node_modules/` path; local dependencies remain available; the worktree contains only the expected index removals and task/ignore changes.
  - Verification: `git ls-files 'node_modules/**' | wc -l` returned `0`; the staged cached removals contained `32151` paths; `node_modules/.modules.yaml` remained present locally.
  - Runtime harness: N/A — repository hygiene has no runtime boundary.
  - Rollback boundary: restore `.gitignore` and the removed `node_modules/` index entries without changing local dependency files.
  - Commit: `091e92ebccbc` (`chore(repo): stop tracking generated dependencies`).

- [ ] **TST-001 — Establish workspace and domain test foundation**
  - Route: delegated.
  - Trigger: preparation and implementation span multiple non-trivial files.
  - Configure the root test command and domain TypeScript/Vitest package contract.
  - Ensure the domain remains free of app/framework dependencies.
  - Verification: domain tests, domain typecheck, and root recursive test discovery.
  - Commit: pending.

- [ ] **TST-002 — Unify backend tests under Vitest**
  - Route: delegated.
  - Trigger: test configuration and scripts require coordinated edits.
  - Make the default backend test command cover unit and integration tests while retaining useful focused commands.
  - Verification: backend unit/default tests, focused integration tests, lint, and build.
  - Commit: pending.

- [ ] **TST-003 — Add frontend Vitest and Storybook testing**
  - Route: delegated.
  - Trigger: Storybook, Vitest browser mode, package scripts, and representative stories span multiple files.
  - Configure Storybook with `@storybook/nextjs-vite`, Vitest integration, Playwright Chromium, Tailwind globals, and App Router support.
  - Add a minimal representative component boundary with a behavioral story/test instead of generated demo content.
  - Verification: frontend tests, Storybook build, frontend lint, typecheck/build.
  - Commit: pending.

- [ ] **TST-004 — Verify the workspace TDD contract**
  - Route: delegated.
  - Trigger: cross-package verification and lockfile normalization require repository-wide context.
  - Confirm `pnpm test` executes Vitest for backend, frontend, and domain; verify builds and record any environmental prerequisite.
  - Remove temporary no-test allowances once every package has a real test.
  - Verification: clean install compatibility, workspace tests, package builds, and structural readback.
  - Commit: pending.

## Acceptance Criteria

- `pnpm test` runs all package test suites and succeeds.
- Every package test script invokes Vitest; no Jest or Node test runner is introduced.
- Backend default tests include both unit and in-process HTTP integration coverage.
- Domain has a functioning framework-free TypeScript/Vitest setup and at least one meaningful behavioral test.
- Frontend has working Vitest configuration and at least one meaningful Storybook story with browser interaction coverage.
- Storybook builds successfully and loads the existing Tailwind styles.
- Frontend and backend production builds remain successful.
- The root lockfile is authoritative and generated outputs are ignored.

## Progress

- Exploration completed: existing test and Storybook gaps mapped across the workspace.
- User requirement confirmed: Vitest is the only test runner for backend, frontend, and domain.
- User authorized removing tracked `node_modules/` files from the Git index before dependency installation.

## Verification Evidence

- TST-000: repository hygiene verified before commit. Git tracks zero `node_modules/` paths, all 32,151 prior paths are staged as cached removals, and the local pnpm dependency metadata remains present.

## Next Step

Implement TST-001 after recording the TST-000 commit identity.
