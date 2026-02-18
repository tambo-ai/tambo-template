"use client";

import { markdownComponents } from "./markdown-components";
import {
  checkHasContent,
  getMessageImages,
  getSafeContent,
} from "@/lib/thread-hooks";
import { cn } from "@/lib/utils";
import type {
  TamboThreadMessage,
  TamboToolUseContent,
  TamboComponentContent,
  Content,
} from "@tambo-ai/react";
import { useTambo } from "@tambo-ai/react";
import { cva, type VariantProps } from "class-variance-authority";
import stringify from "json-stringify-pretty-compact";
import { Check, ChevronDown, ExternalLink, Loader2, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Streamdown } from "streamdown";

/**
 * Converts message content to markdown format for rendering with streamdown.
 * Handles text and resource content parts, converting resources to markdown links
 * with a custom URL scheme that will be rendered as Mention components.
 *
 * @param content - The message content (string, element, array, etc.)
 * @returns A markdown string ready for streamdown rendering
 */
function convertContentToMarkdown(
  content: TamboThreadMessage["content"] | React.ReactNode | undefined | null,
): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (React.isValidElement(content)) {
    // For React elements, we can't convert to markdown - this shouldn't happen
    // in normal flow, but keep backward compatibility
    return "";
  }
  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const item of content) {
      if (item?.type === "text") {
        parts.push(item.text ?? "");
      } else if (item?.type === "resource") {
        const resource = item.resource;
        const uri = resource?.uri;
        if (uri) {
          // Use resource name for display, fallback to URI if no name
          const displayName = resource?.name ?? uri;
          // Use a custom protocol that looks more standard to avoid blocking
          // Format: tambo-resource://<encoded-uri>
          // We'll detect this in the link component and decode the URI
          const encodedUri = encodeURIComponent(uri);
          parts.push(`[${displayName}](tambo-resource://${encodedUri})`);
        }
      }
    }
    return parts.join(" ");
  }
  return "";
}

/**
 * CSS variants for the message container
 * @typedef {Object} MessageVariants
 * @property {string} default - Default styling
 * @property {string} solid - Solid styling with shadow effects
 */
const messageVariants = cva("flex", {
  variants: {
    variant: {
      default: "",
      solid: [
        "[&>div>div:first-child]:shadow-md",
        "[&>div>div:first-child]:bg-container/50",
        "[&>div>div:first-child]:hover:bg-container",
        "[&>div>div:first-child]:transition-all",
        "[&>div>div:first-child]:duration-200",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * @typedef MessageContextValue
 * @property {"user" | "assistant"} role - The role of the message sender.
 * @property {VariantProps<typeof messageVariants>["variant"]} [variant] - Optional styling variant for the message container.
 * @property {TamboThreadMessage} message - The full Tambo thread message object.
 * @property {boolean} [isLoading] - Optional flag to indicate if the message is in a loading state.
 * @property {boolean} [lastRunCancelled] - Whether the last run was cancelled (from TamboThread).
 */
interface MessageContextValue {
  role: "user" | "assistant";
  variant?: VariantProps<typeof messageVariants>["variant"];
  message: TamboThreadMessage;
  isLoading?: boolean;
  lastRunCancelled?: boolean;
}

/**
 * React Context for sharing message data and settings among sub-components.
 * @internal
 */
const MessageContext = React.createContext<MessageContextValue | null>(null);

/**
 * Hook to access the message context.
 * Throws an error if used outside of a Message component.
 * @returns {MessageContextValue} The message context value.
 * @throws {Error} If used outside of Message.
 * @internal
 */
const useMessageContext = () => {
  const context = React.useContext(MessageContext);
  if (!context) {
    throw new Error("Message sub-components must be used within a Message");
  }
  return context;
};

/**
 * Extract tool_use content blocks from a message.
 *
 * @param message - The message to extract tool use blocks from
 * @returns Array of TamboToolUseContent blocks
 */
export function getToolUseBlocks(
  message: TamboThreadMessage,
): TamboToolUseContent[] {
  return message.content.filter(
    (c): c is TamboToolUseContent => c.type === "tool_use",
  );
}

/**
 * Extract component content blocks from a message.
 *
 * @param message - The message to extract component blocks from
 * @returns Array of TamboComponentContent blocks
 */
export function getComponentBlocks(
  message: TamboThreadMessage,
): TamboComponentContent[] {
  return message.content.filter(
    (c): c is TamboComponentContent => c.type === "component",
  );
}

// --- Sub-Components ---

/**
 * Props for the Message component.
 * Extends standard HTMLDivElement attributes.
 */
export interface MessageProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "content"
> {
  /** The role of the message sender ('user' or 'assistant'). */
  role: "user" | "assistant";
  /** The full Tambo thread message object. */
  message: TamboThreadMessage;
  /** Optional styling variant for the message container. */
  variant?: VariantProps<typeof messageVariants>["variant"];
  /** Optional flag to indicate if the message is in a loading state. */
  isLoading?: boolean;
  /** The child elements to render within the root container. Typically includes Message.Bubble and Message.RenderedComponentArea. */
  children: React.ReactNode;
}

/**
 * The root container for a message component.
 * It establishes the context for its children and applies alignment styles based on the role.
 * @component Message
 * @example
 * ```tsx
 * <Message role="user" message={messageData} variant="solid">
 *   <Message.Bubble />
 *   <Message.RenderedComponentArea />
 * </Message>
 * ```
 */
const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    { children, className, role, variant, isLoading, message, ...props },
    ref,
  ) => {
    const { thread } = useTambo();
    const lastRunCancelled = thread?.thread.lastRunCancelled ?? false;

    const contextValue = React.useMemo(
      () => ({ role, variant, isLoading, message, lastRunCancelled }),
      [role, variant, isLoading, message, lastRunCancelled],
    );

    return (
      <MessageContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(messageVariants({ variant }), className)}
          data-message-role={role}
          data-message-id={message.id}
          {...props}
        >
          {children}
        </div>
      </MessageContext.Provider>
    );
  },
);
Message.displayName = "Message";

/**
 * Loading indicator with bouncing dots animation
 *
 * A reusable component that displays three animated dots for loading states.
 * Used in message content and tool status areas.
 *
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div props
 * @param {string} [props.className] - Optional CSS classes to apply
 * @returns {JSX.Element} Animated loading indicator component
 */
const LoadingIndicator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.1s]"></span>
    </div>
  );
};
LoadingIndicator.displayName = "LoadingIndicator";

/**
 * Internal component to render message content based on its type
 */
function MessageContentRenderer({
  contentToRender,
  markdownContent,
  markdown,
}: {
  contentToRender: unknown;
  markdownContent: string;
  markdown: boolean;
}) {
  if (!contentToRender) {
    return <span className="text-muted-foreground italic">Empty message</span>;
  }
  if (React.isValidElement(contentToRender)) {
    return contentToRender;
  }
  if (markdown) {
    return (
      <Streamdown components={markdownComponents}>{markdownContent}</Streamdown>
    );
  }
  return markdownContent;
}

/**
 * Props for the MessageImages component.
 */
export type MessageImagesProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Displays images from message content horizontally.
 * @component MessageImages
 */
const MessageImages = React.forwardRef<HTMLDivElement, MessageImagesProps>(
  ({ className, ...props }, ref) => {
    const { message } = useMessageContext();
    const images = getMessageImages(message.content);

    if (images.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-2 mb-2", className)}
        data-slot="message-images"
        {...props}
      >
        {images.map((imageUrl: string, index: number) => (
          <div
            key={index}
            className="w-32 h-32 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  },
);
MessageImages.displayName = "MessageImages";

/**
 * Props for the MessageContent component.
 * Extends standard HTMLDivElement attributes.
 */
export interface MessageContentProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "content"
> {
  /** Optional override for the message content. If not provided, uses the content from the message object in the context. */
  content?: string | TamboThreadMessage["content"];
  /** Optional flag to render as Markdown. Default is true. */
  markdown?: boolean;
}

/**
 * Displays the message content with optional markdown formatting.
 * Only shows text content - tool calls are handled by ToolcallInfo component.
 * @component MessageContent
 */
const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  (
    { className, children, content: contentProp, markdown = true, ...props },
    ref,
  ) => {
    const { message, isLoading, lastRunCancelled } = useMessageContext();
    const contentToRender = children ?? contentProp ?? message.content;

    const markdownContent = React.useMemo(() => {
      const result = convertContentToMarkdown(contentToRender);
      return result;
    }, [contentToRender]);
    const hasContent = React.useMemo(
      () => checkHasContent(contentToRender),
      [contentToRender],
    );

    const showLoading = isLoading && !hasContent;

    return (
      <div
        ref={ref}
        className={cn(
          "relative block rounded-3xl px-4 py-2 text-[15px] leading-relaxed transition-all duration-200 font-medium max-w-full [&_p]:py-1 [&_li]:list-item",
          className,
        )}
        data-slot="message-content"
        {...props}
      >
        {showLoading && !message.reasoning ? (
          <div
            className="flex items-center justify-start h-4 py-1"
            data-slot="message-loading-indicator"
          >
            <LoadingIndicator />
          </div>
        ) : (
          <div
            className={cn("break-words", !markdown && "whitespace-pre-wrap")}
            data-slot="message-content-text"
          >
            <MessageContentRenderer
              contentToRender={contentToRender}
              markdownContent={markdownContent}
              markdown={markdown}
            />
            {lastRunCancelled && (
              <span className="text-muted-foreground text-xs">cancelled</span>
            )}
          </div>
        )}
      </div>
    );
  },
);
MessageContent.displayName = "MessageContent";

/**
 * Props for the ToolcallInfo component.
 * Extends standard HTMLDivElement attributes.
 */
export interface ToolcallInfoProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "content"
> {
  /** Optional flag to render response content as Markdown. Default is true. */
  markdown?: boolean;
  /** Optional specific tool_use block to render. If not provided, uses the first tool_use block from the message. */
  toolUse?: TamboToolUseContent;
}

function getToolStatusMessage(
  toolUse: TamboToolUseContent | undefined,
  isLoading: boolean | undefined,
) {
  if (!toolUse) return null;
  return toolUse.statusMessage ?? (isLoading ? `Calling ${toolUse.name}` : `Called ${toolUse.name}`);
}

/**
 * Internal component to render tool call status icon
 */
function ToolcallStatusIcon({
  hasToolError,
  isLoading,
}: {
  hasToolError: boolean | undefined;
  isLoading: boolean | undefined;
}) {
  if (hasToolError) {
    return <X className="w-3 h-3 text-bold text-red-500" />;
  }
  if (isLoading) {
    return (
      <Loader2 className="w-3 h-3 text-muted-foreground text-bold animate-spin" />
    );
  }
  return <Check className="w-3 h-3 text-bold text-green-500" />;
}

/**
 * Displays tool call information in a collapsible dropdown.
 * Shows tool name, parameters, and associated tool response.
 * @component ToolcallInfo
 */
const ToolcallInfo = React.forwardRef<HTMLDivElement, ToolcallInfoProps>(
  ({ className, markdown = true, toolUse: toolUseProp, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { message, isLoading } = useMessageContext();
    const { thread } = useTambo();
    const toolDetailsId = React.useId();

    const toolUse = toolUseProp ?? getToolUseBlocks(message)[0];

    // Find the associated tool result: look for a tool_result content block in subsequent messages
    // that matches the tool_use id, or check for tool_result blocks within this message's content.
    const associatedToolResult = React.useMemo(() => {
      if (!toolUse) return null;

      // First check for tool_result blocks in the same message
      const inlineResult = message.content.find(
        (c): c is Extract<Content, { type: "tool_result" }> =>
          c.type === "tool_result" && c.toolUseId === toolUse.id,
      );
      if (inlineResult) return inlineResult;

      // Then look in subsequent messages for tool_result content blocks
      const messages = thread?.thread.messages;
      if (!messages) return null;
      const currentMessageIndex = messages.findIndex(
        (m: TamboThreadMessage) => m.id === message.id,
      );
      if (currentMessageIndex === -1) return null;
      for (let i = currentMessageIndex + 1; i < messages.length; i++) {
        const nextMessage = messages[i];
        // Look for tool_result blocks in this message's content
        for (const block of nextMessage.content) {
          if (
            block.type === "tool_result" &&
            block.toolUseId === toolUse.id
          ) {
            return block as Extract<Content, { type: "tool_result" }>;
          }
        }
        // If this is another assistant message with tool_use, stop searching
        if (nextMessage.role === "assistant" && getToolUseBlocks(nextMessage).length > 0) {
          break;
        }
      }
      return null;
    }, [message, toolUse, thread?.thread.messages]);

    if (message.role !== "assistant" || !toolUse) {
      return null;
    }

    const hasToolError = !!associatedToolResult?.isError;

    const toolStatusMessage = getToolStatusMessage(toolUse, isLoading);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start text-xs opacity-50",
          className,
        )}
        data-slot="toolcall-info"
        {...props}
      >
        <div className="flex flex-col w-full">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={toolDetailsId}
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-1 cursor-pointer hover:bg-muted rounded-md p-1 select-none w-fit",
            )}
          >
            <ToolcallStatusIcon
              hasToolError={hasToolError}
              isLoading={isLoading}
            />
            <span>{toolStatusMessage}</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                !isExpanded && "-rotate-90",
              )}
            />
          </button>
          <div
            id={toolDetailsId}
            className={cn(
              "flex flex-col gap-1 p-3 pl-7 overflow-auto transition-[max-height,opacity,padding] duration-300 w-full truncate",
              isExpanded ? "max-h-auto opacity-100" : "max-h-0 opacity-0 p-0",
            )}
          >
            <span className="whitespace-pre-wrap pl-2">
              tool: {toolUse.name}
            </span>
            <span className="whitespace-pre-wrap pl-2">
              parameters:{"\n"}
              {stringify(toolUse.input)}
            </span>
            {associatedToolResult && (
              <div className="pl-2">
                <span className="whitespace-pre-wrap">result:</span>
                <div>
                  {!associatedToolResult.content ||
                  associatedToolResult.content.length === 0 ? (
                    <span className="text-muted-foreground italic">
                      Empty response
                    </span>
                  ) : (
                    formatToolResult(
                      associatedToolResult.content as Content[],
                      markdown,
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ToolcallInfo.displayName = "ToolcallInfo";

/**
 * Props for the ReasoningInfo component.
 * Extends standard HTMLDivElement attributes.
 */
export type ReasoningInfoProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "content"
>;

/**
 * Displays reasoning information in a collapsible dropdown.
 * Shows the reasoning strings provided by the LLM when available.
 * @component ReasoningInfo
 */
const ReasoningInfo = React.forwardRef<HTMLDivElement, ReasoningInfoProps>(
  ({ className, ...props }, ref) => {
    const { message, isLoading } = useMessageContext();
    const reasoningDetailsId = React.useId();
    const [isExpanded, setIsExpanded] = useState(true);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Auto-collapse when content arrives and reasoning is not loading
    React.useEffect(() => {
      if (checkHasContent(message.content) && !isLoading) {
        setIsExpanded(false);
      }
    }, [message.content, isLoading]);

    // Auto-scroll to bottom when reasoning content changes
    React.useEffect(() => {
      if (scrollContainerRef.current && isExpanded && message.reasoning) {
        const scroll = () => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        };

        if (isLoading) {
          // During streaming, scroll immediately
          requestAnimationFrame(scroll);
        } else {
          // For other updates, use a short delay to batch rapid changes
          const timeoutId = setTimeout(scroll, 50);
          return () => clearTimeout(timeoutId);
        }
      }
    }, [message.reasoning, isExpanded, isLoading]);

    // Only show if there's reasoning data
    if (!message.reasoning?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start text-xs opacity-50",
          className,
        )}
        data-slot="reasoning-info"
        {...props}
      >
        <div className="flex flex-col w-full">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={reasoningDetailsId}
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-1 cursor-pointer hover:bg-muted-foreground/10 rounded-md px-3 py-1 select-none w-fit",
            )}
          >
            <span className={isLoading ? "animate-thinking-gradient" : ""}>
              <ReasoningStatusText
                isLoading={isLoading}
                reasoningDurationMS={message.reasoningDurationMS}
                reasoningSteps={message.reasoning.length}
              />
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                !isExpanded && "-rotate-90",
              )}
            />
          </button>
          <div
            ref={scrollContainerRef}
            id={reasoningDetailsId}
            className={cn(
              "flex flex-col gap-1 px-3 py-3 overflow-auto transition-[max-height,opacity,padding] duration-300 w-full",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 p-0",
            )}
          >
            {message.reasoning.map((reasoningStep, index) => (
              <div key={index} className="flex flex-col gap-1">
                {message.reasoning?.length && message.reasoning.length > 1 && (
                  <span className="text-muted-foreground text-xs font-medium">
                    Step {index + 1}:
                  </span>
                )}
                {reasoningStep ? (
                  <div className="bg-muted/50 rounded-md p-3 text-xs overflow-x-auto overflow-y-auto max-w-full">
                    <div className="whitespace-pre-wrap break-words">
                      <Streamdown components={markdownComponents}>
                        {reasoningStep}
                      </Streamdown>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

ReasoningInfo.displayName = "ReasoningInfo";

/**
 * Internal component to render reasoning status text
 */
function ReasoningStatusText({
  isLoading,
  reasoningDurationMS,
  reasoningSteps,
}: {
  isLoading: boolean | undefined;
  reasoningDurationMS?: number;
  reasoningSteps: number;
}) {
  let statusText: string;
  if (isLoading) {
    statusText = "Thinking ";
  } else if (reasoningDurationMS) {
    statusText = formatReasoningDuration(reasoningDurationMS) + " ";
  } else {
    statusText = "Done Thinking ";
  }

  return (
    <>
      {statusText}
      {reasoningSteps > 1 ? `(${reasoningSteps} steps)` : ""}
    </>
  );
}

/**
 * Formats the reasoning duration in a human-readable format
 * @param durationMS - The duration in milliseconds
 * @returns The formatted duration string
 */
function formatReasoningDuration(durationMS: number) {
  const seconds = Math.floor(Math.max(0, durationMS) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 1) return "Thought for less than 1 second";
  if (seconds < 60)
    return `Thought for ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  if (minutes < 60)
    return `Thought for ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `Thought for ${hours} ${hours === 1 ? "hour" : "hours"}`;
}

/**
 * Renders a resource content part from a tool result.
 * Handles text, blob (images), and URI resources.
 * @param resource - The resource object
 * @param index - Index for unique key generation
 * @returns Resource element
 */
function renderResourceContent(
  resource: {
    uri?: string;
    text?: string;
    blob?: string;
    name?: string;
    mimeType?: string;
  },
  index: number,
): React.ReactNode {
  // Handle blob content (e.g., base64-encoded images)
  if (resource.blob && resource.mimeType?.startsWith("image/")) {
    const dataUrl = `data:${resource.mimeType};base64,${resource.blob}`;
    return (
      <div
        key={`resource-blob-${index}`}
        className="rounded-md overflow-hidden shadow-sm max-w-xs"
      >
        <img
          src={dataUrl}
          alt={resource.name ?? `Resource image ${index + 1}`}
          loading="lazy"
          decoding="async"
          className="max-w-full h-auto object-contain"
        />
      </div>
    );
  }

  // Handle text content
  if (resource.text) {
    return (
      <div key={`resource-text-${index}`} className="whitespace-pre-wrap">
        {resource.name && (
          <span className="font-medium text-muted-foreground">
            {resource.name}:{" "}
          </span>
        )}
        {resource.text}
      </div>
    );
  }

  // Handle URI reference
  if (resource.uri) {
    return (
      <div key={`resource-uri-${index}`} className="flex items-center gap-1">
        <span className="font-medium text-muted-foreground">
          {resource.name ?? "Resource"}:
        </span>
        <span className="font-mono text-xs truncate">{resource.uri}</span>
      </div>
    );
  }

  return null;
}

/**
 * Helper function to detect if content is JSON and format it nicely.
 * Handles text and resource content types from V1 content blocks.
 * @param content - The content to check and format
 * @param enableMarkdown - Whether to render text as markdown
 * @returns Formatted content or original content if not JSON
 */
function formatToolResult(
  content: TamboThreadMessage["content"],
  enableMarkdown = true,
): React.ReactNode {
  if (!content) return content;

  // Handle string content directly
  if (typeof content === "string") {
    return formatTextContent(content, enableMarkdown);
  }

  // Handle array content with mixed types
  if (Array.isArray(content)) {
    const textParts: string[] = [];
    const nonTextParts: React.ReactNode[] = [];

    content.forEach((item, index) => {
      if (!item?.type) return;

      if (item.type === "text" && item.text) {
        textParts.push(item.text);
      } else if (item.type === "resource" && item.resource) {
        const resourceNode = renderResourceContent(item.resource, index);
        if (resourceNode) {
          nonTextParts.push(resourceNode);
        }
      }
    });

    // Combine text parts and render
    const combinedText = textParts.join("");
    const textNode = combinedText
      ? formatTextContent(combinedText, enableMarkdown)
      : null;

    // If we only have text, return it directly
    if (nonTextParts.length === 0) {
      return textNode;
    }

    // If we have mixed content, render in a flex container
    return (
      <div className="flex flex-col gap-2">
        {textNode}
        {nonTextParts.length > 0 && (
          <div className="flex flex-wrap gap-2">{nonTextParts}</div>
        )}
      </div>
    );
  }

  // Fallback for unknown content types
  return getSafeContent(content);
}

/**
 * Formats text content, attempting JSON parsing for pretty-printing.
 * @param text - The text to format
 * @param enableMarkdown - Whether to render as markdown if not JSON
 * @returns Formatted text node
 */
function formatTextContent(
  text: string,
  enableMarkdown: boolean,
): React.ReactNode {
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    return (
      <pre
        className={cn(
          "bg-muted/50 rounded-md p-3 text-xs overflow-x-auto overflow-y-auto max-w-full max-h-64",
        )}
      >
        <code className="font-mono break-words whitespace-pre-wrap">
          {JSON.stringify(parsed, null, 2)}
        </code>
      </pre>
    );
  } catch {
    // JSON parsing failed, render as markdown or plain text
    if (!enableMarkdown) return text;
    return <Streamdown components={markdownComponents}>{text}</Streamdown>;
  }
}

/**
 * Props for the MessageRenderedComponentArea component.
 * Extends standard HTMLDivElement attributes.
 */
export type MessageRenderedComponentAreaProps =
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Displays the `renderedComponent` associated with an assistant message.
 * Shows a button to view in canvas if a canvas space exists, otherwise renders inline.
 * Only renders if the message role is 'assistant' and a component content block has a renderedComponent.
 * @component Message.RenderedComponentArea
 */
const MessageRenderedComponentArea = React.forwardRef<
  HTMLDivElement,
  MessageRenderedComponentAreaProps
>(({ className, children, ...props }, ref) => {
  const { message, role, lastRunCancelled } = useMessageContext();
  const [canvasExists, setCanvasExists] = React.useState(false);

  // Check if canvas exists on mount and window resize
  React.useEffect(() => {
    const checkCanvasExists = () => {
      const canvas = document.querySelector('[data-canvas-space="true"]');
      setCanvasExists(!!canvas);
    };

    // Check on mount
    checkCanvasExists();

    // Set up resize listener
    window.addEventListener("resize", checkCanvasExists);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkCanvasExists);
    };
  }, []);

  // Get rendered component from component content blocks
  const renderedComponent = React.useMemo(() => {
    const componentBlocks = getComponentBlocks(message);
    return componentBlocks.find((c) => c.renderedComponent)?.renderedComponent ?? null;
  }, [message]);

  if (
    !renderedComponent ||
    role !== "assistant" ||
    lastRunCancelled
  ) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      data-slot="message-rendered-component-area"
      {...props}
    >
      {children ??
        (canvasExists ? (
          <div className="flex justify-start pl-4">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("tambo:showComponent", {
                      detail: {
                        messageId: message.id,
                        component: renderedComponent,
                      },
                    }),
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group"
              aria-label="View component in canvas"
            >
              View component
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-full pt-2 px-2">{renderedComponent}</div>
        ))}
    </div>
  );
});
MessageRenderedComponentArea.displayName = "Message.RenderedComponentArea";

// --- Exports ---
export {
  LoadingIndicator,
  Message,
  MessageContent,
  MessageImages,
  MessageRenderedComponentArea,
  messageVariants,
  ReasoningInfo,
  ToolcallInfo,
};
