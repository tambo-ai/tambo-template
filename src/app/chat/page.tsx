"use client";
import { McpConfigButton } from "@/components/ui/mcp-config-button";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { loadMcpServers } from "@/lib/mcp-utils";
import { components } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";

export default function Home() {
  // Load MCP server configurations
  const mcpServers = loadMcpServers();

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* MCP Config Button */}
      <McpConfigButton />

      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
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
