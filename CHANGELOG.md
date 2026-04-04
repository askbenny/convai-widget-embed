# @askbenny/convai-widget-embed

## 1.3.1

## 1.3.0

### Minor Changes

- Auto-select widget language from localStorage history and browser language preferences.

  When no explicit `language` attribute is set, the widget now resolves the initial language by checking (in order):
  1. The `language` attribute on the widget element
  2. The last language the user selected (persisted in localStorage)
  3. The user's browser language preferences (`navigator.languages`)
  4. The agent's default language

  Language selections are persisted to localStorage so returning users see their preferred language automatically.

## 1.2.10

## 1.2.9

### Patch Changes

- Fix style does not show correctly in safari.

## 1.2.8

### Minor Changes

- Ability to show agent tool usage status
- New agent status badge for long tool call

### Patch Changes

- Strip emotion tag

## 1.2.7

### Patch Changes

- Reset microphone mute state when call ends to prevent UI/audio desync on subsequent calls

## 1.2.6

### Minor Changes

- Fix styling issue in shadow root

## 1.2.5

### Minor Changes

- Allow the widget to be dismissable via an optional parameter.
