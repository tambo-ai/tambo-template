import { Stack } from 'expo-router';
import { TamboProvider } from '@tambo-ai/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TamboProvider
        baseUrl={process.env.EXPO_PUBLIC_TAMBO_URL}
        apiKey={process.env.EXPO_PUBLIC_TAMBO_KEY}
      >
        <Stack />
      </TamboProvider>
    </SafeAreaProvider>
  );
}
