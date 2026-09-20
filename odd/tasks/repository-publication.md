# Repository Publication Preparation

## Objective

Prepare the local repository history for later publication by removing every tracked `node_modules` path from all commits reachable from the maintained branches while preserving the meaningful test-infrastructure commit sequence and accurate review evidence.

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

- All work is local; do not push, fetch, create issues or pull requests, or otherwise access remotes.
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

## Next Step

The local repository is ready for parent-managed publication after final command verification and Engram synchronization. No remote operation was performed.
