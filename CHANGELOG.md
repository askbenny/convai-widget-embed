# @askbenny/convai-widget-embed

## 1.5.2

- Bundle core 1.5.2: a website assistant set to "Chat only" in Ask Benny opens with the chat button alone. It used to also show the call button, with a phone icon, which opened a text chat.
- The widget remembers that setting per agent in the browser's local storage (`askbenny_convai_text_only:<environment>:<agent id>`, `1` or `0`, nothing about the visitor), so the right launcher appears at once on later page loads. A first visit waits for it for at most 2 seconds. No extra request is made.

## 1.5.1

- Bundle core 1.5.1: the end-of-chat confirmation keeps keyboard focus on its buttons and gives it back when it closes, and unknown rich content names show the fallback instead of breaking the transcript.

## 1.5.0

- Bundle core 1.5.0, which brings the widget up to date with the ElevenLabs widget (client SDK 1.36.1): file upload and attachments, rich content such as carousels and quick replies, an optional end confirmation, a full-page layout, opening fullscreen on phones, typing indicators, and opt-in persistent text sessions. Ask Benny's managed sessions, branding, orbs and privacy choices are unchanged; the visitor id is a random id, never a device fingerprint.
- Text chats end after 3 minutes without a message or keystroke, so a chat the visitor left is no longer counted up to the agent's maximum duration.
- The bundle grows from 1.36 MB to 1.66 MB (416 KB to 504 KB gzipped).

## 1.4.18

- Bundle Preact 10.29.8 (was 10.28.0) for GHSA-36hm-qxxp-pg3m, a JSON VNode injection issue. No widget behavior changes.
- Releases are published through npm trusted publishing with signed provenance.

## 1.4.17

- Bundle core 1.4.17: orb shaders use only defined `smoothstep` edges, so the glass orb's highlights render consistently across GPUs; the orb pauses while off screen or hidden; and it polls conversation volume only while a call is connected.

## 1.4.16

- Bundle core 1.4.16: a new default "glass" orb, a lit glass sphere that reacts to the conversation's audio and renders from the configured orb colors without loading a noise texture from ElevenLabs' CDN. Also fixes an orb render loop leak on color changes.

## 1.4.15

- Bundle core 1.4.15: the widget stays visible on agents that require authentication. A refused unsigned widget-config request is retried once with the conversation signature of a managed Ask Benny session, so organizations with a live widget can turn authentication on.

## 1.4.14

- Bundle core transcript, greeting, IME input, and host-page dropdown fixes while preserving managed sessions and SDK 1.1.1.
- Add browser checks for the shipped classic bundle, including locked host prototypes and live disable-banner overrides.


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
