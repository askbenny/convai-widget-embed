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