import { Stack } from 'expo-router';
import { TamboProvider } from '@tambo-ai/react';

export default function RootLayout() {
  return (
    <TamboProvider
      baseUrl={process.env.EXPO_PUBLIC_TAMBO_URL}
      apiKey={process.env.EXPO_PUBLIC_TAMBO_KEY}
    >
      <Stack />
    </TamboProvider>
  );
}
