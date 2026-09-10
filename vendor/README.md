# Reviewed widget core bundle

This package pins the companion widget core change without waiting for an npm release during PR review.

- Source: https://github.com/askbenny/convai-widget-core/pull/46 (feature) and https://github.com/askbenny/convai-widget-core/pull/47 (version bump).
- Source commit: `46be186` (`chore/release-1.4.13`, which is main `24c06d8` plus the version bump).
- Package: `@askbenny/convai-widget-core@1.4.13`.
- Archive SHA-256: `e8f4eb58b909ea0ec95966797016451c4bbf2d5822e00bfc5fb859e023c7eaf8`.
- Produced in the core checkout with `npm run build` followed by `npm pack --ignore-scripts`.

The archive contains the package's distributable files and metadata. It contains no environment files. The pnpm lockfile pins its integrity; the embed build consumes this exact archive, with no dependency on an unpublished registry version.

If the core PR changes, rebuild and replace the archive and update this provenance and the lockfile together. After a normal npm publication, a later change can replace the file dependency with the same reviewed registry version.

This release adds the `disable-banner` attribute, which hides the "Powered by AskBenny" footer when set to `"true"`. Default behavior is unchanged.
