"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { components } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  // Load MCP server configurations from localStorage
  const [mcpServerCount, setMcpServerCount] = useState<number>(0);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const savedServers = localStorage.getItem("mcp-servers");
      if (savedServers) {
        try {
          const servers = JSON.parse(savedServers);
          setMcpServerCount(servers.length);
        } catch (e) {
          console.error("Failed to parse saved MCP servers", e);
        }
      }
    }
  }, []);

  // Load MCP server configurations from localStorage safely
  const mcpServers = (() => {
    if (typeof window === "undefined") return [];

    const savedServersData = localStorage.getItem("mcp-servers");
    if (!savedServersData) return [];

    try {
      const servers = JSON.parse(savedServersData);
      // Deduplicate servers by URL to prevent multiple tool registrations
      const uniqueUrls = new Set();
      return servers.filter((server: string | { url: string }) => {
        const url = typeof server === "string" ? server : server.url;
        if (uniqueUrls.has(url)) return false;
        uniqueUrls.add(url);
        return true;
      });
    } catch (e) {
      console.error("Failed to parse saved MCP servers", e);
      return [];
    }
  })();

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* MCP Config Link */}
      <div className="absolute top-2 right-2 z-10">
        <Link
          href="/mcp-config"
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>MCP Config</span>
          {mcpServerCount > 0 && (
            <span className="flex items-center justify-center bg-green-500 text-white text-xs rounded-full w-5 h-5 ml-1">
              {mcpServerCount}
            </span>
          )}
        </Link>
      </div>

      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        //tools={tools}
      >
        <TamboMcpProvider mcpServers={mcpServers}>
          <div className="flex-1 overflow-hidden">
            <MessageThreadFull contextKey="tambo-template" />
          </div>
        </TamboMcpProvider>
      </TamboProvider>
    </div>
  );
}
