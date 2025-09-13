import { TamboThreadProvider } from '@tambo-ai/react';
import { TamMobileThread } from '../../components/tambo/TamMobileThread';
import React from 'react';

export default function TamboScreen() {
  return (
    <TamboThreadProvider>
      <TamMobileThread />
    </TamboThreadProvider>
  );
}
