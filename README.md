# Conversational AI Widget Embed

A lightweight TypeScript widget for embedding conversational AI functionality with all dependencies bundled for easy integration.

## Overview

This package provides a simple way to integrate conversational AI widgets into web applications. It serves as a wrapper around `@askbenny/convai-widget-core` with all dependencies pre-bundled for convenient embedding.

## Installation

```bash
npm install @askbenny/convai-widget-embed
```

## Usage

### Basic Integration

```html
<!-- Include via CDN -->
<script src="https://unpkg.com/@askbenny/convai-widget-embed@latest/dist/index.js"></script>
```

### ES Module

```typescript
import "@askbenny/convai-widget-embed";
```

The widget will automatically register itself when imported or loaded.

## Features

- **Zero Configuration**: Works out of the box with default settings
- **Lightweight**: Bundled with Vite for optimal performance
- **TypeScript Support**: Written in TypeScript with full type definitions
- **CDN Ready**: Available via unpkg for easy integration

## Development

### Prerequisites

- Node.js 16+
- pnpm (preferred package manager)

### Setup

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Run linting
pnpm run lint
```

### Scripts

- `build` - Build the library using Vite
- `lint` - Run all linting checks (TypeScript, ESLint, Prettier)
- `lint:ts` - TypeScript type checking
- `lint:es` - ESLint code quality checks
- `lint:prettier` - Prettier formatting checks

## Build Output

The build process creates an IIFE (Immediately Invoked Function Expression) bundle at `dist/index.js` that can be easily embedded in any web page.

## Repository

Part of the [convai-widget-embed](https://github.com/askbenny/convai-widget-embed) monorepo.

## License

MIT © ElevenLabs

## Neutral, Partner-hosted script

The default `dist/index.js` and unpkg entrypoint still register `askbenny-convai`.
The additional `dist/website.js` entrypoint registers **only** `website-widget`, so
it coexists with old legacy scripts in either load order. Use the Partners portal
loader to select the active hostname and production/development API automatically:

```html
<script src="https://portal.yourbrand.com/widget.js" defer></script>
<website-widget widget-id="wgt_CLIENT_UNIQUE_ID"></website-widget>
```

For directly hosted builds, the classic script reads `data-api-base-url` and
`data-portal-hostname` from its own script element synchronously. Explicit
`api-base-url` and `portal-hostname` element attributes can override those defaults.
No portal session or API key belongs in the embed. The backend enforces tenant,
origin, entitlement, and enablement checks for every new conversation.

`pnpm build` produces both self-contained bundles. `pnpm test` verifies entrypoint
contracts; `pnpm check-types` checks types. Browser/SDK compatibility is covered
by the core suite and the Partners browser suite, including both script orders.

### Reproducible coordinated releases

This feature is coordinated with `convai-widget-core` and `partners`. The first-party
core tarball in `vendor/` makes the build independent of an unpublished npm version;
`core-manifest.json` records its source commit and SHA-256. The bundle's runtime
Preact, Signals, and ElevenLabs dependencies are pinned to the versions verified
by the core suite. Only `dist/` is published to npm; the vendor snapshot is build input.

After committing and testing core, run `node scripts/update-core.mjs ../convai-widget-core`,
then `pnpm update @askbenny/convai-widget-core`, `pnpm test`, `pnpm check-types`, and
`pnpm build`. Commit the snapshot, manifest, and lockfile together. From Partners,
run `node scripts/sync-widget-runtime.mjs ../convai-widget-embed` after committing
the embed build source. Publishing or merging remains a separate release action.
