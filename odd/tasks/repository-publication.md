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
- Preserve an external recovery record until rewritten history passes validation.
- Remove rewrite-created backup refs after successful validation so original history is not reachable through branches, tags, or `refs/original`.
- Keep documentation in English and commits free of AI attribution or `Co-Authored-By` trailers.
- TDD does not apply to history metadata; use ordinary functional verification.

## Authorized Scope

- Local branch and commit history for `main`, `develop`, and `feature/test-infrastructure` / `test/test-infrastructure`.
- Local references created solely as temporary rewrite recovery aids.
- `odd/tasks/repository-publication.md` and stale history evidence in `odd/tasks/test-infrastructure.md`.
- A recovery record outside the repository under `/tmp/opencode`.
- Local Git and existing workspace test commands only.

## Tasks

- [ ] **PUB-001 — Remove generated dependencies from reachable history**
  - Route: direct local history maintenance.
  - Trigger: generated dependency paths remain reachable in pre-cleanup commits despite later index cleanup.
  - Record the original branch tips outside the repository, create a temporary local recovery ref, and rewrite only the three maintained branches with an exact index filter that removes root and nested `node_modules` paths.
  - Preserve commit order/messages and retain otherwise-empty cleanup commits when practical.
  - Verification: every commit reachable from the three rewritten branch tips contains zero paths matching `(^|/)node_modules/`.
  - Rollback: before final cleanup, restore branch tips from the temporary recovery ref or the external `/tmp/opencode` record.

- [ ] **PUB-002 — Validate and finalize branch references**
  - Route: direct local repository maintenance.
  - Trigger: rewritten commits must be proven safe before the old branch name or recovery refs are removed.
  - Compare commit subjects/order with the pre-rewrite chain, rename the feature branch to `test/test-infrastructure`, and remove `refs/original` plus temporary backup refs only after validation succeeds.
  - Verification: branch graph shows only `main`, `develop`, and `test/test-infrastructure`; no original-history refs remain reachable under branches, tags, or `refs/original`; `git fsck --full` reports no integrity errors.
  - Rollback: stop before deleting recovery refs if any validation fails.

- [ ] **PUB-003 — Correct rewritten-history evidence**
  - Route: documentation work unit.
  - Trigger: history rewriting changes commit identifiers and branch naming, making existing ODD evidence stale.
  - Update `odd/tasks/test-infrastructure.md` with rewritten commit identifiers and `test/test-infrastructure` references, then record the observed publication-preparation outcomes here.
  - Verification: neither pre-rewrite commit IDs nor `feature/test-infrastructure` remain in the test-infrastructure ODD document.
  - Rollback: revert only the documentation correction commit.

- [ ] **PUB-004 — Verify publication-ready local state**
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

Before successful validation and recovery-ref cleanup, restore the three branch tips from the temporary local recovery ref or the external branch map in `/tmp/opencode`. After validation, original objects may remain temporarily as unreachable objects until Git garbage collection; recovery then depends on the external record and object retention. No remote fallback is assumed.

## Progress

- [x] Confirmed initial branch tips: `main` and `develop` at `cbdde130ec79f906c13e23a93083cfe92194fd8a`; `feature/test-infrastructure` at `3fd091848a94c47ecadddb09147b752dedf706cf`.
- [x] Confirmed the worktree was clean before creating this control document.
- [x] Loaded work-unit, cognitive documentation, and branch naming guidance.
- [ ] Commit this control document before history mutation.
- [ ] Rewrite and validate maintained history.
- [ ] Rename the feature branch and correct stale evidence.
- [ ] Complete final verification and mirror synchronization.

## Next Step

Commit this control document as an isolated conventional work unit, then create external and local recovery records before rewriting any branch history.
