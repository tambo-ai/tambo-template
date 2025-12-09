import { createFileRoute } from '@tanstack/react-router';
import { MessageThreadFull } from '@/components/tambo/message-thread-full';
import { components, tools } from '@/lib/tambo';
import { TamboProvider } from '@tambo-ai/react';
import { TamboMcpProvider } from '@tambo-ai/react/mcp';

export const Route = createFileRoute('/chat')({
  component: ChatPage,
});

function ChatPage() {
  return (
    <TamboProvider
      apiKey={import.meta.env.VITE_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={import.meta.env.VITE_TAMBO_URL}
    >
      <TamboMcpProvider>
        <div className="h-screen">
          <MessageThreadFull contextKey="tambo-template" />
        </div>
      </TamboMcpProvider>
    </TamboProvider>
  );
}