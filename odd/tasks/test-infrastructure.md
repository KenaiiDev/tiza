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

- Current mode: enabled for future feature work.
- Source: this ODD change, verified by the TST-004 workspace contract.
- Runner: `pnpm test`, delegating to Vitest in every package.
- Setup evidence: ordinary functional verification only; this infrastructure change does not claim strict RED/GREEN evidence for its own creation.

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
  - Verification: `git ls-files 'node_modules/**' | wc -l` and `git ls-files '**/node_modules/**' | wc -l` both returned `0`; 32,151 root paths and 30 nested backend paths were removed from the index; local root and backend dependencies remained present.
  - Runtime harness: N/A — repository hygiene has no runtime boundary.
  - Rollback boundary: restore `.gitignore` and the removed `node_modules/` index entries without changing local dependency files.
  - Commits: `091e92ebccbc` (`chore(repo): stop tracking generated dependencies`) and corrective `1e2d3fb3d922` (`chore(repo): untrack nested dependencies`).

- [x] **TST-001 — Establish workspace and domain test foundation**
  - Route: delegated.
  - Trigger: preparation and implementation span multiple non-trivial files.
  - Configure the root test command and domain TypeScript/Vitest package contract.
  - Ensure the domain remains free of app/framework dependencies.
  - Verification: `pnpm --filter @tiza/domain test` passed 1 file and 2 tests with Vitest 4.1.11; `pnpm --filter @tiza/domain typecheck` exited 0; `pnpm test` exited 0 and recursively ran the domain and current backend test scripts.
  - Runtime harness: N/A — this work unit establishes package-level test and type contracts without a deployable runtime.
  - Lockfile: `pnpm install` completed for all four workspace projects with one existing backend TypeScript peer warning; the redundant frontend lockfile was removed.
  - Rollback boundary: revert the root manifest, root lockfile, domain package/configuration/source, and redundant frontend lockfile removal without affecting backend or frontend source.
  - Commit: `f4d83f31a461` (`test(domain): establish workspace test foundation`).

- [x] **TST-002 — Unify backend tests under Vitest**
  - Route: delegated.
  - Trigger: test configuration and scripts require coordinated edits.
  - Make the default backend test command cover unit and integration tests while retaining useful focused commands.
  - Verification: `pnpm --filter backend test:unit` passed 1 file/1 test; `pnpm --filter backend test` passed 2 files/2 tests, including `test/**/*.e2e-spec.ts`; `pnpm --filter backend test:e2e` passed 1 file/1 test; backend lint and build exited 0.
  - Runtime harness: the focused `test:e2e` Vitest/Supertest in-process HTTP test passed.
  - Dependency result: `pnpm install` exited 0 without peer warnings after replacing `vite-tsconfig-paths` with Vite's native `resolve.tsconfigPaths` support.
  - Rollback boundary: revert backend scripts, both Vitest configs, the backend dependency removal, and matching root lockfile entries.
  - Commit: `5e6816d70527` (`test(backend): include integration tests by default`).

- [x] **TST-003 — Add frontend Vitest and Storybook testing**
  - Route: delegated.
  - Trigger: Storybook, Vitest browser mode, package scripts, and representative stories span multiple files.
  - Configure Storybook with `@storybook/nextjs-vite`, Vitest integration, Playwright Chromium, Tailwind globals, and App Router support.
  - Add a minimal representative component boundary with a behavioral story/test instead of generated demo content.
  - Verification: `pnpm --filter frontend test` and `test:storybook` each passed 1 browser story test with Vitest 4.1.11 and Chromium; `build-storybook` completed with Storybook 10.2.9/Vite 7.3.6; frontend lint, typecheck, and Next.js production build exited 0.
  - Runtime harness: the Storybook play test rendered the interactive notice in Chromium, clicked its accessible dismiss button, and observed that the status region was removed.
  - Environment: `pnpm --filter frontend exec playwright install chromium` installed Playwright Chromium 1243 and its headless shell using the Ubuntu 24.04 fallback build because the host OS is not officially supported.
  - Build notes: Storybook reported non-failing warnings for the ignored bundled `use client` directive and a chunk above 500 kB; no generated demo components or assets were added.
  - Rollback boundary: revert frontend Storybook/Vitest config, component/story, package scripts/dependencies, and matching root lockfile entries; the external browser cache can be removed independently.
  - Commit: `101d075eabfb` (`test(frontend): add Vitest and Storybook browser tests`).

- [x] **TST-004 — Verify the workspace TDD contract**
  - Route: delegated.
  - Trigger: cross-package verification and lockfile normalization require repository-wide context.
  - Confirm `pnpm test` executes Vitest for backend, frontend, and domain; verify builds and record any environmental prerequisite.
  - Remove temporary no-test allowances once every package has a real test.
  - Verification: all required install, package test, lint, typecheck, build, root test, frozen-install, and structural commands passed after excluding generated `storybook-static/` output from ESLint.
  - Runtime harness: root `pnpm test` ran domain (1 file/2 tests), backend (2 files/2 tests), and frontend Storybook Chromium coverage (1 file/1 test) and exited 0.
  - Temporary allowances: none; no `passWithNoTests` setting remains and every package has a real Vitest test.
  - Rollback boundary: revert the final ESLint generated-output ignore and this verification evidence independently; capability rollback boundaries remain listed on TST-000 through TST-003.
  - Authored-line estimate: 394 lines before this final evidence update, excluding generated lockfiles and all dependency index removals; the final count is recorded below.
  - Commit: pending creation (`docs(testing): record workspace verification contract`).

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

- TST-000: repository hygiene verified. Git tracks zero root or nested `node_modules/` paths; 32,151 root paths and 30 nested backend paths were removed with local dependencies retained.
- TST-001: domain Vitest behavior (2 tests), domain typecheck, workspace recursive test execution, and root lockfile installation passed. The install reported the pre-existing `vite-tsconfig-paths` peer range warning against backend TypeScript 6.0.3.
- TST-002: backend unit, combined default, focused integration, lint, and build commands all passed; the dependency reinstall removed the TypeScript peer warning.
- TST-003: frontend browser story tests, Storybook production build, lint, typecheck, and Next.js production build passed with the documented non-failing build warnings.
- TST-004: full workspace verification passed. The first frontend lint attempt exposed generated Storybook output because ESLint did not ignore `storybook-static/`; adding the generated-output ignore fixed the failure without weakening source linting.

### Final Command Results

| Command | Observed result |
| --- | --- |
| `pnpm install` | Passed for all 4 workspace projects; lockfile was current. pnpm reported ignored `esbuild@0.27.7` and `esbuild@0.28.2` build scripts. |
| `pnpm --filter @tiza/domain test` | Passed: Vitest 4.1.11, 1 file, 2 tests. |
| `pnpm --filter @tiza/domain typecheck` | Passed: `tsc --noEmit` exited 0. |
| `pnpm --filter backend test` | Passed: Vitest 4.1.11, 2 files, 2 tests. |
| `pnpm --filter backend test:e2e` | Passed: Vitest 4.1.11, 1 file, 1 test. |
| `pnpm --filter backend lint` | Passed: type-aware oxlint exited 0. |
| `pnpm --filter backend build` | Passed: `nest build` exited 0. |
| `pnpm --filter frontend test` | Passed: Vitest 4.1.11, 1 Chromium story file, 1 test. |
| `pnpm --filter frontend build-storybook` | Passed with Storybook 10.2.9 and Vite 7.3.6; non-failing `use client` sourcemap/directive and chunk-size warnings remained. |
| `pnpm --filter frontend lint` | Passed after `storybook-static/**` was added to ESLint global ignores; the initial attempt failed only on generated Storybook bundles. |
| `pnpm --filter frontend typecheck` | Passed: `tsc --noEmit` exited 0. |
| `pnpm --filter frontend build` | Passed: Next.js 16.3.5 compiled, typechecked, and generated 4 static pages. |
| `pnpm test` | Passed all package scripts: domain 1 file/2 tests, backend 2 files/2 tests, frontend 1 file/1 browser test. |
| `pnpm install --frozen-lockfile` | Passed; lockfile was current. pnpm repeated the ignored esbuild build-script warning. |
| Structural checks | Passed: zero tracked root or nested `node_modules/` paths, local package dependencies present, exactly one tracked root `pnpm-lock.yaml`, and every package `test` script is `vitest run`. |

### Rollback Boundaries

- Repository hygiene: restore `.gitignore` and dependency index entries only; local dependencies are independent.
- Domain foundation: revert the root test script, domain package/configuration/source, lockfile entries, and deleted frontend lockfile.
- Backend coverage: revert backend scripts/configuration and native tsconfig-path resolution dependency changes.
- Frontend coverage: revert Storybook/Vitest configuration, the notice component/story, package scripts/dependencies, lockfile entries, and ESLint generated-output ignore; remove the external Playwright browser cache separately if desired.

### Review Size

- Authored additions plus deletions: 432 (417 additions, 15 deletions).
- Exclusions: generated root/frontend lockfile changes and all root/nested `node_modules/` index removals.
- The 400-line guideline remains advisory; no code, tests, configuration, or evidence was omitted to reduce the count.

## Next Step

Review the branch locally. Push, pull request creation, and merge remain human decisions and were not performed.
