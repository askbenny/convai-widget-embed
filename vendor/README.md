# Reviewed widget core bundle

This package pins the companion widget core change without waiting for an npm release during PR review.

- Source: https://github.com/askbenny/convai-widget-core/pull/45
- Source commit: `8757ad1` (`codex/widget-branch-sessions`).
- Package: `@askbenny/convai-widget-core@1.4.12`.
- Archive SHA-256: `622bcdc0f0226ab243861c6f665d148ec4c6bdf26ca070c614a32678e4a5d84c`.
- Produced in the core checkout with `npm run build` followed by `npm pack --ignore-scripts`.

The archive contains the package's distributable files and metadata. It contains no environment files. The pnpm lockfile pins its integrity; the embed build consumes this exact archive, with no dependency on an unpublished registry version.

If the core PR changes, rebuild and replace the archive and update this provenance and the lockfile together. After a normal npm publication, a later change can replace the file dependency with the same reviewed registry version.

Release the companion Ask Benny v2 public configuration/session contract before this embed. Version 1.4.12 rejects legacy prompt-bearing server responses. This repository's publish workflow publishes the reviewed manifest version without a second version bump.
