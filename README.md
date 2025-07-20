# AskBenny Widget

A custom wrapper for ElevenLabs ConvAI widget that provides a branded embed experience. This package allows you to easily embed ElevenLabs voice agents with your own custom element branding.

## Installation

### Via npm

```bash
npm install @askbenny/widget
```

### Via CDN (unpkg.com)

```html
<!-- Load the widget from unpkg -->
<script src="https://unpkg.com/@askbenny/widget/dist/askbenny-widget.umd.min.js"></script>

<!-- Your branded widget -->
<ask-benny agent-id="agent_01jym2zzfrecjrx53vhcn8kg8gqxp"></ask-benny>
```

## Usage

### 1. HTML Embed (Simplest)

Just include the script and use the custom element:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your content -->
    <h1>Welcome to my website</h1>
    
    <!-- AskBenny Widget -->
    <ask-benny agent-id="your-elevenlabs-agent-id"></ask-benny>
    
    <!-- Load the script -->
    <script src="https://unpkg.com/@askbenny/widget"></script>
</body>
</html>
```

### 2. ES Modules (Modern)

```javascript
import { AskBennyWidget } from '@askbenny/widget';

// Widget automatically registers the <ask-benny> custom element
// Now you can use <ask-benny agent-id="..."></ask-benny> in your HTML

// Or create programmatically:
const widget = AskBennyWidget.create('your-agent-id', document.getElementById('chat-container'));
```

### 3. CommonJS (Node.js style)

```javascript
const { AskBennyWidget } = require('@askbenny/widget');

// Create widget programmatically
const widget = AskBennyWidget.create('your-agent-id');
```

### 4. React/Vue/Angular

The widget works as a custom element in any framework:

#### React
```jsx
function MyComponent() {
  return (
    <div>
      <h1>My App</h1>
      <ask-benny agent-id="your-agent-id" />
    </div>
  );
}
```

#### Vue
```vue
<template>
  <div>
    <h1>My App</h1>
    <ask-benny agent-id="your-agent-id" />
  </div>
</template>

<script>
import '@askbenny/widget';
</script>
```

#### Angular
```typescript
// In your component
import '@askbenny/widget';

// In your template
<ask-benny agent-id="your-agent-id"></ask-benny>
```

## API Reference

### Custom Element

#### Attributes

- `agent-id` (required): Your ElevenLabs ConvAI agent ID
- `hide-branding` (optional): Boolean to control branding display
  - `false` (default): Shows "Powered by askbenny.ca" 
  - `true`: Completely removes branding

#### Examples
```html
<!-- Default: Shows AskBenny branding -->
<ask-benny agent-id="agent_01jym2zzfrecjr53vdhcn8kg8gqsp"></ask-benny>

<!-- Explicitly show AskBenny branding -->
<ask-benny agent-id="agent_01jym2zzfrecjr53vdhcn8kg8gqsp" hide-branding="false"></ask-benny>

<!-- Hide all branding -->
<ask-benny agent-id="agent_01jym2zzfrecjr53vdhcn8kg8gqsp" hide-branding="true"></ask-benny>
```

### JavaScript API

#### `AskBennyWidget.create(agentId, container?)`

Creates a widget programmatically.

**Parameters:**
- `agentId` (string): Your ElevenLabs agent ID
- `container` (HTMLElement, optional): Container to append the widget to. Defaults to `document.body`.

**Returns:** The created widget element

```javascript
const widget = AskBennyWidget.create('your-agent-id', document.getElementById('chat-area'));
```

#### `AskBennyWidget.isElevenLabsLoaded()`

Checks if the ElevenLabs script has been loaded.

**Returns:** `boolean`

```javascript
if (AskBennyWidget.isElevenLabsLoaded()) {
  console.log('ElevenLabs is ready!');
}
```

## How It Works

1. **Your branded tag**: Use `<ask-benny agent-id="...">` in your HTML
2. **Automatic wrapping**: The widget creates an `<elevenlabs-convai>` element inside itself
3. **Script loading**: ElevenLabs' official script is loaded once per page
4. **Branding control**: Automatically replaces ElevenLabs branding with AskBenny branding, or hides it completely
5. **Seamless integration**: The ElevenLabs widget functions exactly as intended

## Branding Options

The widget provides flexible branding control:

### Default Behavior
By default, the widget replaces "Powered by ElevenLabs" with "Powered by askbenny.ca":
```html
<ask-benny agent-id="your-agent-id"></ask-benny>
```

### Hide All Branding
To remove branding completely:
```html
<ask-benny agent-id="your-agent-id" hide-branding="true"></ask-benny>
```

### Dynamic Branding Control
You can change branding settings dynamically:
```javascript
const widget = document.querySelector('ask-benny');

// Show AskBenny branding
widget.setAttribute('hide-branding', 'false');

// Hide all branding
widget.setAttribute('hide-branding', 'true');
```

## Advanced Usage

### Multiple Widgets

You can have multiple widgets on the same page:

```html
<ask-benny agent-id="sales-agent"></ask-benny>
<ask-benny agent-id="support-agent"></ask-benny>
```

The ElevenLabs script is loaded only once, regardless of how many widgets you have.

### Dynamic Agent Switching

```javascript
const widget = document.querySelector('ask-benny');
widget.setAttribute('agent-id', 'new-agent-id');
// Widget automatically updates to use the new agent
```

### Programmatic Control

```javascript
// Create widget
const widget = AskBennyWidget.create('your-agent-id');

// Later, change the agent
widget.setAttribute('agent-id', 'different-agent-id');

// Remove widget
widget.remove();
```

## TypeScript Support

This package includes TypeScript definitions:

```typescript
import { AskBennyWidget } from '@askbenny/widget';

const widget: AskBennyWidget = AskBennyWidget.create('agent-id');
```

## Browser Support

- Chrome 54+
- Firefox 51+ 
- Safari 10.1+
- Edge 79+

Requires support for Custom Elements v1.

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/askbenny/widget/issues)
- ElevenLabs Documentation: [ConvAI Widget Docs](https://elevenlabs.io/docs)
