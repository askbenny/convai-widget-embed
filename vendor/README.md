# Reviewed core archive

Source: https://github.com/askbenny/convai-widget-core/pull/48

Revision: ad9469a68d6908fac8b4ddd65f9da90a36c0d29f

SHA-256: 8f3fb5efe0b432e16b151394dd4f582308805f4a4a3dc119551f49832ad8fc01

Built with the committed core pnpm lockfile using Node 26.3.0, then packed with `npm pack --ignore-scripts` after the production build. Core source and browser tests are reviewed in the linked PR. Runtime SDK remains 1.1.1 in the embed lockfile.

This archive makes the coordinated patch review installable before core is published. Replace it with exact npm version 1.4.14 after publication and rerun validation before merging the embed release.
