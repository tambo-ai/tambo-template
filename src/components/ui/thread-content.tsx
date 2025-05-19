"use client";

import {
  Message,
  MessageContent,
  MessageRenderedComponentArea,
  type messageVariants,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { type TamboThreadMessage, useTambo } from "@tambo-ai/react";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * @typedef ThreadContentContextValue
 * @property {Array} messages - Array of message objects in the thread
 * @property {boolean} isGenerating - Whether a response is being generated
 * @property {string|undefined} generationStage - Current generation stage
 * @property {VariantProps<typeof messageVariants>["variant"]} [variant] - Optional styling variant for messages
 */
interface ThreadContentContextValue {
  messages: TamboThreadMessage[];
  isGenerating: boolean;
  generationStage?: string;
  variant?: VariantProps<typeof messageVariants>["variant"];
}

/**
 * React Context for sharing thread data among sub-components.
 * @internal
 */
const ThreadContentContext =
  React.createContext<ThreadContentContextValue | null>(null);

/**
 * Hook to access the thread content context.
 * @returns {ThreadContentContextValue} The thread content context value.
 * @throws {Error} If used outside of ThreadContent.
 * @internal
 */
const useThreadContentContext = () => {
  const context = React.useContext(ThreadContentContext);
  if (!context) {
    throw new Error(
      "ThreadContent sub-components must be used within a ThreadContent",
    );
  }
  return context;
};

/**
 * Props for the ThreadContent component.
 * Extends standard HTMLDivElement attributes.
 */
export interface ThreadContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional styling variant for the message container */
  variant?: VariantProps<typeof messageVariants>["variant"];
  /** The child elements to render within the container. */
  children?: React.ReactNode;
}

/**
 * The root container for thread content.
 * It establishes the context for its children using data from the Tambo hook.
 * @component ThreadContent
 * @example
 * ```tsx
 * <ThreadContent variant="solid">
 *   <ThreadContent.Messages />
 * </ThreadContent>
 * ```
 */
const ThreadContent = React.forwardRef<HTMLDivElement, ThreadContentProps>(
  ({ children, className, variant, ...props }, ref) => {
    const { thread, generationStage, isIdle } = useTambo();
    const isGenerating = !isIdle;

    const contextValue = React.useMemo(
      () => ({
        messages: thread?.messages ?? [],
        isGenerating,
        generationStage,
        variant,
      }),
      [thread?.messages, isGenerating, generationStage, variant],
    );

    return (
      <ThreadContentContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(className)}
          data-slot="thread-content-container"
          {...props}
        >
          {children}
        </div>
      </ThreadContentContext.Provider>
    );
  },
);
ThreadContent.displayName = "ThreadContent";

/**
 * Props for the ThreadContentMessages component.
 * Extends standard HTMLDivElement attributes.
 */
export type ThreadContentMessagesProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Renders the list of messages in the thread.
 * Automatically connects to the context to display messages.
 * @component ThreadContent.Messages
 * @example
 * ```tsx
 * <ThreadContent>
 *   <ThreadContent.Messages />
 * </ThreadContent>
 * ```
 */
const ThreadContentMessages = React.forwardRef<
  HTMLDivElement,
  ThreadContentMessagesProps
>(({ className, ...props }, ref) => {
  const { messages, isGenerating, variant } = useThreadContentContext();

  return (
    <div
      ref={ref}
      className={cn(className)}
      data-slot="thread-content-messages"
      {...props}
    >
      {messages.map((message, index) => {
        const showLoading = isGenerating && index === messages.length - 1;

        return (
          <div
            key={
              message.id ??
              `${message.role}-${message.createdAt ?? Date.now()}-${message.content?.toString().substring(0, 10)}`
            }
            data-slot="thread-content-item"
          >
            <Message
              role={message.role === "assistant" ? "assistant" : "user"}
              message={message}
              variant={variant}
              isLoading={showLoading}
              className={
                message.role === "assistant"
                  ? "flex justify-start"
                  : "flex justify-end"
              }
            >
              <div className="flex flex-col">
                <MessageContent
                  className={
                    message.role === "assistant"
                      ? "text-primary font-sans"
                      : "text-primary bg-container hover:bg-backdrop font-sans"
                  }
                />
                {/* Rendered component area determines if the message is a canvas message */}
                <MessageRenderedComponentArea />
              </div>
            </Message>
          </div>
        );
      })}
    </div>
  );
});
ThreadContentMessages.displayName = "ThreadContent.Messages";

export { ThreadContent, ThreadContentMessages };
