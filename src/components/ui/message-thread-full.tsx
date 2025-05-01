"use client";

import {
  MessageInput,
  MessageInputTextarea,
  MessageInputToolbar,
  MessageInputSubmitButton,
  MessageInputError,
} from "@/components/ui/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsStatus,
  MessageSuggestionsList,
} from "@/components/ui/message-suggestions";
import type { messageVariants } from "@/components/ui/message";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
  ThreadHistoryList,
} from "@/components/ui/thread-history";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/ui/thread-content";
import {
  ThreadContainer,
  useThreadContainerContext,
} from "@/components/ui/thread-container";
import { ScrollableMessageContainer } from "@/components/ui/scrollable-message-container";
import { WelcomeCard } from "../welcome-card";
import { useMergedRef } from "@/lib/thread-hooks"
import { Suggestion, useTambo } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string;
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/ui/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, contextKey, variant, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergedRef<HTMLDivElement | null>(ref, containerRef);

  // Get MessageThread from Tambo
  const { thread } = useTambo();

  const threadHistorySidebar = (
    <ThreadHistory contextKey={contextKey} position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  );

  const populationSuggestions: Suggestion[] = [
    {
      id: "pop-suggestion-1",
      title: "Top 10 countries by population",
      detailedSuggestion: "Show me the top 10 countries by population in 2023.",
      messageId: "population-query",
    },
    {
      id: "pop-suggestion-2",
      title: "Population density comparison",
      detailedSuggestion: "Compare population density of the top 10 most populous countries.",
      messageId: "population-query",
    },
    {
      id: "pop-suggestion-3",
      title: "Population growth trends",
      detailedSuggestion: "What are the projected population growth trends for the top 10 most populated countries?",
      messageId: "population-query",
    }
  ];

  return (
    <>
      {/* Thread History Sidebar - rendered first if history is on the left */}
      {historyPosition === "left" && threadHistorySidebar}

      <ThreadContainer ref={mergedRef} className={className} {...props}>
        <ScrollableMessageContainer className="p-4">
          {(!thread || thread.messages.length === 0) && (
            <div className="w-full min-w-xl p-4">
              <WelcomeCard />
            </div>
          )}
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message suggestions status */}
        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        {/* Message input */}
        <div className="p-4">
          <MessageInput contextKey={contextKey}>
            <MessageInputTextarea />
            <MessageInputToolbar>
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>

        {/* Message suggestions */}
        <MessageSuggestions initialSuggestions={populationSuggestions}>
          <MessageSuggestionsList />
        </MessageSuggestions>
      </ThreadContainer>

      {/* Thread History Sidebar - rendered last if history is on the right */}
      {historyPosition === "right" && threadHistorySidebar}
    </>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
