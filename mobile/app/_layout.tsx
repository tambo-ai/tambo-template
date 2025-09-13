import { Stack } from 'expo-router';
import { TamboProvider } from '@tambo-ai/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Graph, graphSchema } from '../components/tambo/Graph';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TamboProvider
        baseUrl={process.env.EXPO_PUBLIC_TAMBO_URL}
        apiKey={process.env.EXPO_PUBLIC_TAMBO_KEY}
        components={[{ name: 'Graph', description: 'Mobile Graph', component: Graph, propsSchema: graphSchema }] as any}
      >
        <Stack />
      </TamboProvider>
    </SafeAreaProvider>
  );
}
