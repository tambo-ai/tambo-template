# Agents and Tools (React Native / Expo)

This template wires Tambo for mobile. Use this guide to connect AI tools/components safely in RN.

## Components (Generative UI)

- Register RN-safe components at the root `TamboProvider` in `app/_layout.tsx`.
- Example: `Graph` component is registered with a zod `propsSchema` to validate runtime props.
- Only register components built with React Native primitives (no DOM APIs).

## Tools

- Define tools in `src/lib/tambo.ts` using zod-typed signatures.
- Return plain JSON serializable values; render visualization via a component or text.
- Replace the example `echo` tool with your production tools.

## Threading and State

- Use `useTamboThread`, `useTamboThreadInput`, and `useTamboThreadList` for thread actions and data.
- `AsyncStorage` is used to persist/restore the last thread ID.

## Rendering Messages

- `Messages` renders text/image blocks and any AI-rendered component attached to assistant messages.
- Ensure server-triggered rendered components are RN-compatible and registered.

## History & Suggestions

- History side panel uses `useTamboThreadList` with search and `FlatList` for performance.
- Suggestion chips prefill and submit prompts; debounced/disabled while pending.

## Performance Tips

- Use `@shopify/flash-list` for chat; `FlatList` for history.
- Avoid large, unbounded images; prefer `expo-image` with sized containers.

## Styling

- NativeWind + Tailwind v3.3, dark mode utility classes included.
- Update Tailwind content globs when adding new folders.

## Gotchas

- Do not register web components (DOM) for mobile; gate or provide RN alternatives.
- Keep versions aligned with Expo (`npx expo install`) to avoid peer conflicts.