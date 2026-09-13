# Reviewed core archive

Source: https://github.com/askbenny/convai-widget-core/pull/48

Revision: 7aae72915905d4da86b96641e158d4c3d76f9693

SHA-256: 9c79a82751a096a32fa70e39ba56aaf5fde6e12559a28ab902b9e32087b220bf

Built with the committed core pnpm lockfile using Node 26.3.0, then packed with `npm pack --ignore-scripts` after the production build. Core source and browser tests are reviewed in the linked PR. Runtime SDK remains 1.1.1 in the embed lockfile.

This archive makes the coordinated patch review installable before core is published. Replace it with exact npm version 1.4.14 after publication and rerun validation before merging the embed release.
