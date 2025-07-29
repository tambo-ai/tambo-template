"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";

export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      >
        <TamboMcpProvider mcpServers={mcpServers}>
          <div className="w-full max-w-4xl mx-auto">
            <MessageThreadFull contextKey="tambo-template" />
          </div>
        </TamboMcpProvider>
      </TamboProvider>
    </div>
  );
}
