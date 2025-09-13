import { TamboThreadProvider } from '@tambo-ai/react';
import { TamMobileThread } from '../../components/tambo/TamMobileThread';
import { Graph, graphSchema } from '../../components/tambo/Graph';
import { TamboProvider } from '@tambo-ai/react';
import React from 'react';

export default function TamboScreen() {
  return (
    <TamboThreadProvider components={[{ name: 'Graph', description: 'Mobile Graph', component: Graph, propsSchema: graphSchema }] as any}>
      <TamMobileThread />
    </TamboThreadProvider>
  );
}
