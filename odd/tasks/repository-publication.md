# Repository Publication Preparation

## Objective

Publish the cleaned test-infrastructure history through an approved-issue-first feature-branch PR chain while preserving the meaningful implementation sequence, focused review boundaries, and accurate delivery evidence.

## Problem

The initial commit contains generated dependency trees at the repository root and under `apps/backend`. Later cleanup commits removed those paths only from their own snapshots, so the generated content remains reachable in earlier history. Publishing that history would permanently expose unnecessary generated files and make repository review and transfer substantially heavier.

## Scope

- Rewrite commits reachable from `main`, `develop`, and the test-infrastructure feature branch.
- Remove every tracked path whose directory components include `node_modules`.
- Preserve commit messages, order, authorship metadata, and otherwise-empty cleanup commits when Git permits.
- Rename `feature/test-infrastructure` to `test/test-infrastructure` after rewrite validation.
- Correct stale branch and commit evidence in the ODD documentation.
- Verify repository integrity, workspace tests, documentation synchronization, and a clean worktree.

## Constraints

- The earlier local-only restriction applied to history cleanup and is superseded for publication by the user's direct authorization on 2026-09-23. Remote work is limited to the current authenticated `gh` session against `github.com/KenaiiDev/tiza`: reuse or create the required issue, apply the authorized approval label when needed and permitted, push the publication chain branches, and create and label PRs toward `develop`.
- Do not merge PRs, force-push, rewrite published history, install or update dependencies, or modify Git configuration.
- Do not install dependencies, modify Git configuration, or change product behavior or dependency versions.
- Rewrite only the three named local branches; do not rewrite unrelated refs.
- Preserve temporary local recovery refs until rewritten history passes validation.
- Remove rewrite-created backup refs after successful validation so original history is not reachable through branches, tags, or `refs/original`.
- Keep documentation in English and commits free of AI attribution or `Co-Authored-By` trailers.
- TDD does not apply to history metadata; use ordinary functional verification.

## Authorized Scope

- Local branch and commit history for `main`, `develop`, and `feature/test-infrastructure` / `test/test-infrastructure`.
- Local references created solely as temporary rewrite recovery aids.
- `odd/tasks/repository-publication.md` and stale history evidence in `odd/tasks/test-infrastructure.md`.
- Local Git and existing workspace test commands only.
- Remote publication actions are authorized only for `github.com/KenaiiDev/tiza` through the current authenticated `gh` session.
- Policy-compliant `test/*` chain branches, one approved feature issue, one draft/no-merge tracker PR toward `develop`, and three child PRs with immediate-parent bases.

## Tasks

- [x] **PUB-001 — Remove generated dependencies from reachable history**
  - Route: direct local history maintenance.
  - Trigger: generated dependency paths remain reachable in pre-cleanup commits despite later index cleanup.
  - Record the original branch tips, create temporary local recovery refs, and rewrite only the three maintained branches with an exact index filter that removes root and nested `node_modules` paths.
  - Preserve commit order/messages and retain otherwise-empty cleanup commits when practical.
  - Verification: every commit reachable from the three rewritten branch tips contains zero paths matching `(^|/)node_modules/`.
  - Rollback: before final cleanup, restore branch tips from the temporary recovery refs.

- [x] **PUB-002 — Validate and finalize branch references**
  - Route: direct local repository maintenance.
  - Trigger: rewritten commits must be proven safe before the old branch name or recovery refs are removed.
  - Compare commit subjects/order with the pre-rewrite chain, rename the feature branch to `test/test-infrastructure`, and remove `refs/original` plus temporary backup refs only after validation succeeds.
  - Verification: branch graph shows only `main`, `develop`, and `test/test-infrastructure`; no original-history refs remain reachable under branches, tags, or `refs/original`; `git fsck --full` reports no integrity errors.
  - Rollback: stop before deleting recovery refs if any validation fails.

- [x] **PUB-003 — Correct rewritten-history evidence**
  - Route: documentation work unit.
  - Trigger: history rewriting changes commit identifiers and branch naming, making existing ODD evidence stale.
  - Update `odd/tasks/test-infrastructure.md` with rewritten commit identifiers and `test/test-infrastructure` references, then record the observed publication-preparation outcomes here.
  - Verification: neither pre-rewrite commit IDs nor `feature/test-infrastructure` remain in the test-infrastructure ODD document.
  - Rollback: revert only the documentation correction commit.

- [x] **PUB-004 — Verify publication-ready local state**
  - Route: direct functional verification.
  - Trigger: history and evidence must be independently reproducible before later remote publication.
  - Run repository integrity, history-path, reference, branch graph, workspace test, documentation, synchronization, and clean-worktree checks.
  - Verification: all commands in the Verification section pass with exact observed results recorded.
  - Runtime harness: `pnpm test` exercises the existing domain, backend, and frontend test boundaries.
  - Rollback: if verification fails before recovery cleanup, restore original tips; otherwise correct only the failing local documentation or repository state in a new work unit.

- [ ] **PUB-005 — Materialize the feature-branch chain**
  - Route: `delivery_strategy: auto-chain`; `chain_strategy: feature-branch-chain`.
  - Trigger: the complete diff is 23 files and 6,622 changed lines including generated lockfiles; the authored work exceeds the 400-line review budget but has cohesive work-unit boundaries.
  - Create `test/test-infrastructure-chain` from synchronized `develop` as the draft/no-merge tracker branch, then build the following immediate-parent chain without force-push or published-history rewriting:

    | Position | Head | Base | Source boundary | Scope | Forecast authored budget |
    | --- | --- | --- | --- | --- | --- |
    | Tracker | `test/test-infrastructure-chain` | `develop` | Current publication control document | Publication plan, identities, verification, and final integration record | Recalculate before PR creation; must remain ≤400 |
    | 1 of 3 | `test/test-infrastructure-01-hygiene` | `test/test-infrastructure-chain` | `c5fe1ba9`..`7e31d0ec` | Repository hygiene and its ODD evidence | 140 / 400 |
    | 2 of 3 | `test/test-infrastructure-02-vitest` | `test/test-infrastructure-01-hygiene` | `d24d17ad`..`c8a887cc` | Domain and backend Vitest foundations with their evidence | 117 / 400 |
    | 3 of 3 | `test/test-infrastructure-03-frontend` | `test/test-infrastructure-02-vitest` | `d703d7cb`..`5d478f89` | Frontend Vitest/Storybook and fail-closed workspace verification | 264 / 400 |

  - Exclude generated lockfile lines only from authored review budgets; retain lockfiles in complete diffs and verification.
  - Keep the original source commit order inside each slice. The two historical publication-document commits are replaced by the tracker control-document work unit rather than duplicated into a child.
  - Verification: each child diff contains only its declared source boundary, every authored budget is at most 400 after one honest slicing pass, and the tracker is draft/no-merge.
  - Rollback: delete only unpushed local chain branches, or close the unmerged PRs and delete their remote chain branches after explicit authorization; never rewrite the existing `test/test-infrastructure` branch.

- [ ] **PUB-006 — Synchronize and verify the publication candidate**
  - Route: local verification before GitHub publication.
  - Synchronize from `develop` by creating the tracker at the verified `develop` tip; do not rebase or rewrite the published source branch.
  - Run `pnpm test`, backend `pnpm --filter backend lint` and `pnpm --filter backend build`, domain `pnpm --filter @tiza/domain typecheck`, frontend `pnpm --filter frontend lint`, `pnpm --filter frontend typecheck`, `pnpm --filter frontend build`, and `pnpm --filter frontend build-storybook`.
  - Verification: every required command exits zero without dependency installation or lockfile mutation; record exact observed results and final per-slice stats.
  - Rollback: stop before issue or PR mutation on any unexpected required failure.

- [ ] **PUB-007 — Reuse or create and approve the feature issue**
  - Route: YAML feature request form at `.github/ISSUE_TEMPLATE/feature_request.yml` on `develop`.
  - Duplicate search found the conforming open equivalent [#1](https://github.com/KenaiiDev/tiza/issues/1), `feat: establish workspace-wide test infrastructure`, covering Domain, Backend, Frontend, Repository tooling, and Documentation.
  - Verified authority: authenticated actor `KenaiiDev` has `ADMIN` on `github.com/KenaiiDev/tiza`; the direct user instruction authorizes `status:approved` on this exact reused issue. Readback already shows `status:approved`, so no redundant protected-label mutation is planned.
  - Verification: secure body readback matches the issue-form controls in order, required answers are non-empty, state is open, and labels include `enhancement` and `status:approved`.
  - Rollback: issue creation is not needed; if later readback loses approval or identity becomes ambiguous, stop before PR mutation.

- [ ] **PUB-008 — Publish the tracker and child PRs**
  - Route: one draft/no-merge tracker PR to `develop`, followed by three child PRs with the exact base/head relationships in PUB-005.
  - Use the repository PR template, `Closes #1`, exactly one `type:chore` label per PR, chain context and dependency diagram, start/end/dependencies/out-of-scope boundaries, exact test evidence, and a rollback boundary.
  - Push only the four declared chain branches. Create every PR and perform every label mutation once, then read back base, head, draft state, body controls, labels, state, and checks.
  - Verification: tracker remains draft; child diffs are unpolluted; each PR is open, unmerged, and has exactly `type:chore` among `type:*` labels.
  - Rollback: do not merge; an unexpected or unknown mutation result stops all later mutations and blind retries.

- [ ] **PUB-009 — Record final publication evidence**
  - Route: tracker documentation work unit plus Engram mirror update.
  - Record issue/PR URLs, exact branch and commit identities, observed budgets, command results, checks, and pending work after each completed publication task.
  - Verification: repository document and Engram topic `odd/repository-publication/tasks` read back with matching full content; final worktree is clean and every local chain branch tracks its intended remote branch.
  - Rollback: correct only the tracker documentation in a new conventional work-unit commit; do not alter child implementation history.

## Acceptance Criteria

- Every commit reachable from `main`, `develop`, and `test/test-infrastructure` contains no tracked path under any `node_modules` directory.
- The meaningful test-infrastructure commit sequence, messages, and order remain intact without squashing.
- `main` and `develop` remain aligned at the rewritten initial commit.
- The feature branch is named `test/test-infrastructure`.
- No original-history references remain under local branches, tags, `refs/original`, or temporary backup refs after successful validation.
- `odd/tasks/test-infrastructure.md` references only rewritten commit IDs and the renamed branch.
- `git fsck --full` reports no repository corruption; unreachable original objects are distinguished from reachable history.
- `pnpm test` passes without dependency installation or version changes.
- The repository ODD document and its Engram mirror are synchronized.
- Final `git status --short --branch` is clean.

## Verification

| Check | Required evidence |
| --- | --- |
| Worktree | Exact output of `git status --short --branch`. |
| Branches and sequence | Branch list plus decorated commit graph for the three maintained branches. |
| Historical path removal | Zero matching paths across every commit reachable from the three maintained branches. |
| Reference cleanup | No `refs/original`, temporary backup refs, old feature branch, or tags retaining original history. |
| Integrity | Exact `git fsck --full` result, noting any dangling unreachable originals separately. |
| Behavior | Exact `pnpm test` result. |
| Evidence freshness | No pre-rewrite commit IDs or old branch reference in `odd/tasks/test-infrastructure.md`. |
| Mirror | File content and Engram topic `odd/repository-publication/tasks` read back with matching full document content and repository-relative locator. |

## Rollback

Before successful validation and recovery-ref cleanup, restore the three branch tips from `refs/backup/repository-publication/*` or `refs/original`. After successful validation those refs are intentionally removed; original objects may remain temporarily as unreachable objects until Git garbage collection. No remote fallback is assumed.

## Observed Outcomes

- Rewrote 14 commits with built-in `git filter-branch` and an index filter using the exact root and nested pathspecs `:(glob)node_modules/**` and `:(glob)**/node_modules/**`.
- Preserved all 14 commit subjects in the same order, including the two cleanup commits that became otherwise empty.
- Rewritten `main` and `develop`: `db6c27c101183709a3ac0307d45ad2911df23a99`.
- Rewritten implementation sequence:
  - `c5fe1ba963ca97e4167d42b654c38bc7555eba2f` — `chore(repo): stop tracking generated dependencies`
  - `7e31d0ecee9b2d2de001a457326a295b46faeb97` — `docs(testing): record repository hygiene evidence`
  - `d24d17ad1335b2fec5469be6eb7060428425f582` — `test(domain): establish workspace test foundation`
  - `22cc21d12ce2452126e1aad541e2cdadcbfa7758` — `docs(testing): record domain foundation evidence`
  - `55dc7a69caa08ee154cb060de6059bee34cf562b` — `chore(repo): untrack nested dependencies`
  - `01331422f3463434fcd69dd9ee06d1599eff2236` — `test(backend): include integration tests by default`
  - `c8a887cc418d2a7ef0e82a2f87cabc2de3a707e7` — `docs(testing): record backend verification evidence`
  - `d703d7cb15943cb4c280d7d96b7eefaeb2a9617d` — `test(frontend): add Vitest and Storybook browser tests`
  - `a5379b207968cc150bb9285dcdff817d752ea456` — `docs(testing): record frontend verification evidence`
  - `c4cc509bb7f2787beb8177aad4ee089f55b86325` — `docs(testing): record workspace verification contract`
  - `3b0fd21636583ed2a29f18df4bdcad71b12313e2` — `docs(testing): link final verification commit`
  - `5d478f899930e880160e4ed70f02e47372abcda2` — `fix(testing): make workspace tests fail closed`
  - `945dbc26bf33dd997c6e326463552989994a8a84` — `docs(repo): track publication preparation`
- Renamed `feature/test-infrastructure` to `test/test-infrastructure` only after the rewritten history contained zero matching dependency paths.
- Removed `refs/original` and `refs/backup/repository-publication/*` after the rewritten sequence, path scan, `git fsck --full`, and `pnpm test` all passed.

## Observed Verification

| Command | Observed result |
| --- | --- |
| Reachable-history path scan | Passed across 14 rewritten commits: `matching_commits=0`, `matching_paths=0`. |
| Commit sequence comparison | Passed: 14 old commits, 14 rewritten commits, and `subjects_match=yes`. |
| `git fsck --full` before recovery-ref cleanup | Passed with no output. |
| `pnpm test` | Passed: domain 1 file/2 tests, backend 2 files/2 tests, frontend 1 Chromium story file/1 test. |
| Reference cleanup | Passed: only `refs/heads/main`, `refs/heads/develop`, and `refs/heads/test/test-infrastructure` remained among heads, tags, original, and temporary backup namespaces. |

## Progress

- [x] Confirmed initial branch tips: `main` and `develop` at `cbdde130ec79f906c13e23a93083cfe92194fd8a`; `feature/test-infrastructure` at `3fd091848a94c47ecadddb09147b752dedf706cf`.
- [x] Confirmed the worktree was clean before creating this control document.
- [x] Loaded work-unit, cognitive documentation, and branch naming guidance.
- [x] Committed this control document before history mutation.
- [x] Rewrote and validated maintained history.
- [x] Renamed the feature branch and corrected stale evidence.
- [x] Completed functional verification and removed temporary recovery refs.
- [x] Closed the documentation correction work unit; final command verification and Engram synchronization accompany delivery.
- [x] Amended the historical local-only constraint with the direct 2026-09-23 authorization for `github.com/KenaiiDev/tiza` using the current authenticated `gh` session.
- [x] Selected `auto-chain` / `feature-branch-chain` and completed one cohesive slicing pass: tracker plus three child PRs, each forecast at or below 400 authored changed lines.
- [x] Reused conforming open issue #1 after one open-and-closed duplicate search and secure form-conformance readback; issue #1 is already labeled `status:approved`.
- [ ] Materialize and verify the four chain branches.
- [ ] Run the complete pre-publication command suite.
- [ ] Push branches and create/read back the draft tracker plus three child PRs.
- [ ] Record final identities, checks, synchronization, and clean-state evidence.

## Next Step

Materialize the declared feature-branch chain, run the complete pre-publication verification suite, and publish the approved-issue-linked tracker and child PRs without merging.
