# Tambo React Native Expo Template

A mobile-first Expo template for building Tambo-powered conversational apps with NativeWind, Expo Router, and React Native.

## Features

- Expo Router app directory (`app/`)
- TamboProvider at root with typed components/tools
- RN-native chat UI (FlashList), suggestions, and side-panel thread history
- NativeWind/Tailwind styling (dark mode ready)
- Zod-typed generative UI Graph component
- AsyncStorage thread persistence
- Haptics, blur overlay, and polished UX

## Getting Started

1) Install deps

```bash
npm install
```

2) Configure environment

Create an `.env` (or set in your CI) with:

```bash
EXPO_PUBLIC_TAMBO_URL=YOUR_TAMBO_BASE_URL
EXPO_PUBLIC_TAMBO_KEY=YOUR_PUBLIC_CLIENT_KEY
```

3) Run

```bash
npm run start
# press i for iOS, a for Android, or scan QR in Expo Go
```

## Project Structure

```text
mobile/
  app/
    _layout.tsx           # Root layout, wraps with SafeAreaProvider + TamboProvider
    index.tsx             # Landing screen -> link to /(tambo)
    (tambo)/              # Chat stack
      index.tsx
  components/tambo/
    Composer.tsx
    Graph.tsx
    HistoryPanel.tsx
    Messages.tsx
    SuggestionsBar.tsx
    TamMobileThread.tsx
    ThreadHeader.tsx
    index.ts              # Barrel exports
  src/
    hooks/thread-storage.ts
    lib/tambo.ts          # Tools registry (replace with your real tools)
  tailwind.config.js
  babel.config.js
  eas.json
  package.json
```

## Styling

- NativeWind v4 + Tailwind v3.3
- Tailwind content globs include `app/**`, grouped segments, and `components/**`
- Dark mode classes on core components

## Tambo Integration

- Root `app/_layout.tsx` registers Tambo components/tools. Update `src/lib/tambo.ts` with real tools.
- RN components must be registered for `renderedComponent` usage.

## Performance

- Chat uses `@shopify/flash-list`
- History panel uses `FlatList`
- Images via `expo-image`

## Builds (EAS)

```bash
npx eas-cli build:configure
npx eas-cli build -p ios
npx eas-cli build -p android
npx eas-cli update --branch production --message "tambo port"
```

## Linting

```bash
npm run lint
```

## Notes

- Replace example tool in `src/lib/tambo.ts` with production tools.
- Ensure your RN-rendered components are compatible with mobile.
