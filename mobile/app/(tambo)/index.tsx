import { TamboThreadProvider } from '@tambo-ai/react';
import { TamMobileThread } from '../../components/tambo/TamMobileThread';

export default function TamboScreen() {
  return (
    <TamboThreadProvider>
      <TamMobileThread />
    </TamboThreadProvider>
  );
}
