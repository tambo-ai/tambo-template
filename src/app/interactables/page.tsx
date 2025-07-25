"use client";

import { GraphPanel } from "@/components/tambo/graph-panel";
import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import { MetricsCardsPanel } from "@/components/tambo/metrics-cards-panel";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { SummaryPanel } from "@/components/tambo/summary-panel";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export default function InteractablesPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Memoize empty props to prevent withInteractable re-renders during streaming
  const emptyBulletPoints = useMemo(() => [], []);
  const emptyCards = useMemo(() => [], []);
  const emptyGraphProps = useMemo(() => ({
    title: "",
    summary: "",
    graphProps: {
      title: "",
      data: {
        type: "line" as const,
        labels: [],
        datasets: [],
      },
    },
  }), []);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      // components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Chat Sidebar */}
        <div
          className={`${
            isChatOpen ? "w-80" : "w-0"
          } border-r border-gray-200 bg-white transition-all duration-300 flex flex-col relative`}
        >
          {isChatOpen && (
            <>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat Assistant
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Try: &quot;Update the summary&quot; or &quot;Show revenue
                  metrics&quot;
                </p>
              </div>

              <ScrollableMessageContainer className="flex-1 p-4">
                <ThreadContent variant="default">
                  <ThreadContentMessages />
                </ThreadContent>
              </ScrollableMessageContainer>

              <div className="p-4 border-t border-gray-200">
                <MessageInput
                  contextKey="interactables-demo"
                  variant="bordered"
                >
                  <MessageInputTextarea placeholder="Update the dashboard..." />
                  <MessageInputToolbar>
                    <MessageInputSubmitButton />
                  </MessageInputToolbar>
                </MessageInput>
              </div>
            </>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 hover:bg-gray-50"
          >
            {isChatOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Interactables Dashboard
              </h1>

              {/* Dashboard Grid */}
              <div className="space-y-8">
                {/* Summary Panel - Full Width */}
                <SummaryPanel bulletPoints={emptyBulletPoints} />

                {/* Metrics Cards Panel - Full Width */}
                <MetricsCardsPanel cards={emptyCards} />

                {/* Graph Panel - Full Width */}
                <GraphPanel {...emptyGraphProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TamboProvider>
  );
}
