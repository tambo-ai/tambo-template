"use client";

import { McpServerInfo, MCPTransport } from "@tambo-ai/react/mcp";
import { ChevronDown, X, Trash2 } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export const McpConfigModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Initialize from localStorage directly to avoid conflicts
  const initialMcpServers =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("mcp-servers") || "[]")
      : [];

  const [mcpServers, setMcpServers] =
    React.useState<McpServerInfo[]>(initialMcpServers);
  const [serverUrl, setServerUrl] = React.useState("");
  const [serverName, setServerName] = React.useState("");
  const [transportType, setTransportType] = React.useState<MCPTransport>(
    MCPTransport.HTTP,
  );
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Save servers to localStorage when updated
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mcp-servers", JSON.stringify(mcpServers));
      if (mcpServers.length > 0) {
        setSavedSuccess(true);
        const timer = setTimeout(() => setSavedSuccess(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [mcpServers]);

  const addServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverUrl.trim()) {
      const serverConfig = {
        url: serverUrl.trim(),
        transport: transportType,
        ...(serverName.trim() ? { name: serverName.trim() } : {}),
      };
      setMcpServers((prev) => [...prev, serverConfig]);

      // Reset form fields
      setServerUrl("");
      setServerName("");
      setTransportType(MCPTransport.HTTP);
    }
  };

  const removeServer = (index: number) => {
    setMcpServers((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to get server display information
  const getServerInfo = (server: McpServerInfo) => {
    if (typeof server === "string") {
      return { url: server, transport: "SSE (default)", name: null };
    } else {
      return {
        url: server.url,
        transport: server.transport || "SSE (default)",
        name: server.name || null,
      };
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking on backdrop (not on the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTransportDisplayText = (transport: MCPTransport) => {
    return transport === MCPTransport.HTTP ? "HTTP (default)" : "SSE";
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">MCP Server Configuration</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600 mb-3 text-sm leading-relaxed">
              Configure{" "}
              <span className="font-semibold text-gray-800">client-side</span>{" "}
              MCP servers to extend the capabilities of your tambo application.
              These servers will be connected <i><b>from the browser</b></i> and
              exposed as tools to tambo.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={addServer} className="mb-8">
            <div className="space-y-4">
              {/* Server URL */}
              <div>
                <label
                  htmlFor="server-url"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Server URL
                  <span className="text-gray-500 font-normal ml-1">
                    (must be accessible from the browser)
                  </span>
                </label>
                <input
                  id="server-url"
                  type="url"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://your-mcp-server-url.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 text-sm"
                  required
                />
              </div>

              {/* Server Name */}
              <div>
                <label
                  htmlFor="server-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Server Name
                  <span className="text-gray-500 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  id="server-name"
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Custom server name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 text-sm"
                />
              </div>

              {/* Transport Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transport Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm flex items-center justify-between hover:bg-gray-50 transition-all duration-150"
                    >
                      <span>{getTransportDisplayText(transportType)}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95 duration-100"
                    align="start"
                  >
                    <DropdownMenuItem
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
                      onClick={() => setTransportType(MCPTransport.HTTP)}
                    >
                      HTTP (default)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
                      onClick={() => setTransportType(MCPTransport.SSE)}
                    >
                      SSE
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-150 font-medium"
            >
              Add Server
            </button>
          </form>

          {/* Success Message */}
          {savedSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Servers saved to browser storage
              </div>
            </div>
          )}

          {/* Server List */}
          {mcpServers.length > 0 ? (
            <div>
              <h4 className="font-medium mb-3 text-gray-900">
                Connected Servers ({mcpServers.length})
              </h4>
              <div className="space-y-2">
                {mcpServers.map((server, index) => {
                  const serverInfo = getServerInfo(server);
                  return (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-150"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-gray-900 font-medium truncate">
                            {serverInfo.url}
                          </span>
                        </div>
                        <div className="ml-5 space-y-1">
                          {serverInfo.name && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Name:</span>{" "}
                              {serverInfo.name}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Transport:</span>{" "}
                            {serverInfo.transport}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeServer(index)}
                        className="ml-4 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-150 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">
                No MCP servers configured yet
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Add your first server above to get started
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-900">What is MCP?</h4>
            <p className="text-gray-800 text-sm leading-relaxed">
              The{" "}
              <a
                href="https://docs.tambo.co/concepts/model-context-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-gray-900"
              >
                Model Context Protocol (MCP)
              </a>{" "}
              is a standard that allows applications to communicate with
              external tools and services. By configuring MCP servers, your
              tambo application will be able to make calls to these tools.
            </p>
          </div>

          <div className="mt-4">
          <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Learn more:</span> {" "}
              <a
                href="https://docs.tambo.co/concepts/model-context-protocol/clientside-mcp-connection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-700 underline underline-offset-2"
              >
                client-side
              </a>
              {" "} | {" "}
              <a
                href="https://docs.tambo.co/concepts/model-context-protocol/serverside-mcp-connection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-700 underline underline-offset-2"
              >
                server-side
              </a>
              {" "}MCP configuration.
            </p>
            </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside current DOM tree to avoid nested forms
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
