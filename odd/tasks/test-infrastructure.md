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
- Source: this ODD change, verified by the fail-closed TST-005 workspace contract.
- Runner: `pnpm test`, delegating to Vitest in every package.
- Setup evidence: ordinary functional verification only; this infrastructure change does not claim strict RED/GREEN evidence for its own creation.

## Delivery

- Strategy: `ask-on-risk`.
- Source branch: `test/test-infrastructure` from `develop`.
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
  - Source-history commits: `c5fe1ba963ca97e4167d42b654c38bc7555eba2f` (`chore(repo): stop tracking generated dependencies`) and corrective `55dc7a69caa08ee154cb060de6059bee34cf562b` (`chore(repo): untrack nested dependencies`).

- [x] **TST-001 — Establish workspace and domain test foundation**
  - Route: delegated.
  - Trigger: preparation and implementation span multiple non-trivial files.
  - Configure the root test command and domain TypeScript/Vitest package contract.
  - Ensure the domain remains free of app/framework dependencies.
  - Verification: `pnpm --filter @tiza/domain test` passed 1 file and 2 tests with Vitest 4.1.11; `pnpm --filter @tiza/domain typecheck` exited 0; `pnpm test` exited 0 and recursively ran the domain and current backend test scripts.
  - Runtime harness: N/A — this work unit establishes package-level test and type contracts without a deployable runtime.
  - Lockfile: `pnpm install` completed for all four workspace projects with one existing backend TypeScript peer warning; the redundant frontend lockfile was removed.
  - Rollback boundary: revert the root manifest, root lockfile, domain package/configuration/source, and redundant frontend lockfile removal without affecting backend or frontend source.
  - Source-history commit: `d24d17ad1335b2fec5469be6eb7060428425f582` (`test(domain): establish workspace test foundation`).

- [x] **TST-002 — Unify backend tests under Vitest**
  - Route: delegated.
  - Trigger: test configuration and scripts require coordinated edits.
  - Make the default backend test command cover unit and integration tests while retaining useful focused commands.
  - Verification: `pnpm --filter backend test:unit` passed 1 file/1 test; `pnpm --filter backend test` passed 2 files/2 tests, including `test/**/*.e2e-spec.ts`; `pnpm --filter backend test:e2e` passed 1 file/1 test; backend lint and build exited 0.
  - Runtime harness: the focused `test:e2e` Vitest/Supertest in-process HTTP test passed.
  - Dependency result: `pnpm install` exited 0 without peer warnings after replacing `vite-tsconfig-paths` with Vite's native `resolve.tsconfigPaths` support.
  - Rollback boundary: revert backend scripts, both Vitest configs, the backend dependency removal, and matching root lockfile entries.
  - Source-history commit: `01331422f3463434fcd69dd9ee06d1599eff2236` (`test(backend): include integration tests by default`).

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
  - Source-history commit: `d703d7cb15943cb4c280d7d96b7eefaeb2a9617d` (`test(frontend): add Vitest and Storybook browser tests`).

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
  - Source-history commit: `c4cc509bb7f2787beb8177aad4ee089f55b86325` (`docs(testing): record workspace verification contract`).

- [x] **TST-005 — Make the root test command fail closed**
  - Route: direct bounded correction.
  - Trigger: independent verification proved that `pnpm --recursive --no-bail test` silently skipped a workspace child without a `test` script and exited 0, so TST-004 did not fully enforce the workspace contract.
  - Replace the recursive lifecycle invocation with `pnpm --recursive --no-bail exec pnpm run test`, preserving `--no-bail` coverage while requiring every selected child package to provide a `test` script.
  - RED evidence: the previous root command skipped a bounded workspace child without a `test` script and exited 0 during independent verification.
  - GREEN verification: with temporary `packages/__missing-test-probe/package.json` present and no `test` script, `pnpm test` ran all three real package suites, reported `ERR_PNPM_NO_SCRIPT` and a summary of 1 failure/3 passes, and exited 1.
  - Regression verification: after removing the probe completely, `pnpm test` exited 0; domain passed 1 file/2 tests, backend passed 2 files/2 tests, and frontend passed 1 Chromium story file/1 test.
  - Structural verification: all 3 current workspace children expose `test: vitest run`; the temporary probe is absent; the ODD document contains zero NUL bytes; only `package.json` and this document remain in the correction work unit.
  - Runtime harness: N/A — this correction enforces the workspace test-command boundary and does not change a deployable runtime path.
  - Rollback boundary: revert only the root `package.json` test command and this TST-005 evidence; no package tests, dependencies, lockfiles, or runtime code are part of the correction.
  - Source-history commit: `5d478f899930e880160e4ed70f02e47372abcda2` (`fix(testing): make workspace tests fail closed`).

- [x] **TST-006 — Correct frontend browser-test accessibility and setup evidence**
  - Route: delegated bounded correction on `test/test-infrastructure-03-frontend`.
  - Accepted scope: add one browser story regression for multiple notice instances, replace the shared heading ID with an unconditional React `useId()` value, expose and document a reproducible Playwright Chromium provisioning command, and correct this document's stale source-branch and source-history identities.
  - RED evidence: `pnpm --filter frontend test:storybook -- --testNamePattern="Multiple Notices"` failed as required with exit 1; the focused story rendered two notices but observed only 1 distinct heading ID, with `expected 1 to be 2` at the uniqueness assertion.
  - GREEN evidence: the focused command passed 1 story file and 2 tests; `pnpm test` passed domain 1 file/2 tests, backend 2 files/2 tests, and frontend 1 Chromium story file/2 tests.
  - Frontend verification: lint and typecheck exited 0; the Next.js 16.3.5 production build compiled and generated 4 static pages; the Storybook 10.2.9 build completed with the previously documented non-failing `use client` and chunk-size warnings.
  - Structural verification: the required scan found zero occurrences of the deprecated source branch name or the six pre-rewrite commit IDs in this document; `git diff --check` exited 0 with no output.
  - Browser provisioning requirement: contributors must be able to provision the required Chromium binary through a repository package script without changing dependency versions or lockfiles.
  - Runtime harness: the focused Storybook/Vitest browser test renders two notices in Playwright Chromium and verifies each `aria-labelledby` reference resolves to its own distinct heading.
  - Rollback boundary: revert only the notice component/story, frontend package script and nearest setup documentation, and this TST-006/source-history evidence; dependencies, lockfiles, and unrelated runtime behavior remain unchanged.
  - Authored-line count: 73 additions plus deletions across 5 files; generated output is excluded and no lockfile changed.
  - Commit identity: `fix(frontend): correct notice accessibility test setup`.

- [x] **TST-007 — Make frontend typechecking self-contained**
  - Route: delegated bounded correction on `test/test-infrastructure-03-frontend`.
  - CI RED evidence: GitHub Actions run `36269785217` failed on a clean runner during `pnpm --filter frontend typecheck`, before `next build`, with `apps/frontend/app/layout.tsx(20,50): error TS2304: Cannot find name 'LayoutProps'`.
  - Implementation: the frontend `typecheck` script now runs `next typegen && tsc --noEmit`, using the repository-local Next.js 16.3.5 CLI to generate route-aware global types before TypeScript validation.
  - Clean-state GREEN evidence: after removing only generated `apps/frontend/.next`, `pnpm --filter frontend typecheck` exited 0; `next typegen` reported `Types generated successfully`, then `tsc --noEmit` passed without relying on pre-existing generated output.
  - Regression verification: `pnpm --filter frontend lint` exited 0; `pnpm --filter frontend build` compiled successfully, passed TypeScript, and generated 4 static pages; `pnpm test` exited 0 with domain 1 file/2 tests, backend 2 files/2 tests, and frontend 1 Chromium story file/2 tests.
  - Structural verification: `git diff --check` exited 0 with no output, and `git diff --exit-code -- pnpm-lock.yaml` exited 0, confirming the lockfile is unchanged.
  - Runtime harness: N/A — this correction makes the static typecheck boundary reproducible on a clean runner and does not change application runtime behavior.
  - Rollback boundary: revert only the frontend `typecheck` package script and this TST-007 evidence; source, dependencies, lockfiles, and unrelated test infrastructure remain unchanged.
  - Authored-line count: 23 additions plus deletions across 2 files; generated `.next` output is excluded and no lockfile changed.
  - Commit identity: `7cd4a5159f9ce6fb94c1448ffefcb39840a222ca` — `fix(frontend): make typecheck self-contained`; pushed to the existing PR #5 branch.
  - Delivery evidence: PR #5 `CI / Verify` run `36270638588` passed in 1m21s. The correction was then integrated through the authorized leaf-to-root chain via PR #5 merge `4a5517e652964c0aad2540df90cec8f202ad4553`, PR #4 merge `4dad1568e73800408d9187ff54ba55666eb1da69`, and PR #3 merge `93347eda9e90d29c12957a64e8cd0dc8e7a62a6e` into draft tracker PR #2.

## Acceptance Criteria

- `pnpm test` runs all package test suites and succeeds.
- `pnpm test` exits nonzero if any current workspace child lacks a `test` script.
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
- TST-007 was committed as `7cd4a5159f9ce6fb94c1448ffefcb39840a222ca`, pushed to PR #5, passed `CI / Verify` in run `36270638588`, and was integrated into draft tracker PR #2 through the completed #5 -> #4 -> #3 leaf-to-root chain.
- Draft tracker PR #2 remains open and unmerged; its fully integrated candidate passed `CI / Verify` in run `36271086487`.

## Verification Evidence

- TST-000: repository hygiene verified. Git tracks zero root or nested `node_modules/` paths; 32,151 root paths and 30 nested backend paths were removed with local dependencies retained.
- TST-001: domain Vitest behavior (2 tests), domain typecheck, workspace recursive test execution, and root lockfile installation passed. The install reported the pre-existing `vite-tsconfig-paths` peer range warning against backend TypeScript 6.0.3.
- TST-002: backend unit, combined default, focused integration, lint, and build commands all passed; the dependency reinstall removed the TypeScript peer warning.
- TST-003: frontend browser story tests, Storybook production build, lint, typecheck, and Next.js production build passed with the documented non-failing build warnings.
- TST-004: the recorded package suites passed, but later independent verification found that its root command silently skipped workspace children without a `test` script; TST-005 closes that fail-open gap.
- TST-005: the corrected root command failed closed with exit 1 for a temporary child lacking `test`, then passed all real package suites after the probe was removed.
- TST-006: multiple notice instances now expose distinct React-generated heading IDs, browser provisioning is reproducible through the frontend package script, and source-history evidence uses the rewritten branch and commit identities.
- TST-007: the frontend typecheck now generates route-aware Next.js types before TypeScript validation and passes from a removed `.next` state without dependency or lockfile changes. Commit `7cd4a5159f9ce6fb94c1448ffefcb39840a222ca` passed PR #5 CI and is present in the integrated draft tracker through merge commits `4a5517e6`, `4dad1568`, and `93347eda`.

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
| `pnpm --filter frontend test` | Passed: Vitest 4.1.11, 1 Chromium story file, 2 tests. |
| `pnpm --filter frontend build-storybook` | Passed with Storybook 10.2.9 and Vite 7.3.6; non-failing `use client` sourcemap/directive and chunk-size warnings remained. |
| `pnpm --filter frontend lint` | Passed after `storybook-static/**` was added to ESLint global ignores; the initial attempt failed only on generated Storybook bundles. |
| `pnpm --filter frontend typecheck` | Passed from a removed `.next` state: `next typegen` generated route-aware types, then `tsc --noEmit` exited 0. |
| `pnpm --filter frontend build` | Passed: Next.js 16.3.5 compiled, typechecked, and generated 4 static pages. |
| `pnpm test` | Passed with the corrected fail-closed command: domain 1 file/2 tests, backend 2 files/2 tests, frontend 1 file/2 Chromium story tests. |
| `pnpm test` with temporary missing-script child | Failed as required with exit 1, `ERR_PNPM_NO_SCRIPT`, and recursive summary 1 failure/3 passes; the probe was then removed completely. |
| `pnpm install --frozen-lockfile` | Passed; lockfile was current. pnpm repeated the ignored esbuild build-script warning. |
| Structural checks | Passed: all 3 workspace children use `test: vitest run`, the temporary probe is absent, the ODD document has zero NUL bytes, and the correction contains only `package.json` plus this document. |

### Rollback Boundaries

- Repository hygiene: restore `.gitignore` and dependency index entries only; local dependencies are independent.
- Domain foundation: revert the root test script, domain package/configuration/source, lockfile entries, and deleted frontend lockfile.
- Backend coverage: revert backend scripts/configuration and native tsconfig-path resolution dependency changes.
- Frontend coverage: revert Storybook/Vitest configuration, the notice component/story, package scripts/dependencies, lockfile entries, and ESLint generated-output ignore; remove the external Playwright browser cache separately if desired.

### Review Size

- Through TST-004: 432 authored changes (417 additions, 15 deletions), excluding generated lockfiles and dependency index removals.
- TST-005 correction: 33 authored changes (24 additions, 9 deletions) across the root manifest and this evidence.
- Cumulative authored changes: 465. The 400-line guideline remains advisory; no code, tests, configuration, or evidence was omitted to reduce the count.

## Next Step

TST-007 is pushed, CI-verified, and integrated into draft tracker PR #2 through the completed child chain. Only maintainer review and separate explicit authorization to mark tracker PR #2 ready or merge it into `develop` remain.
