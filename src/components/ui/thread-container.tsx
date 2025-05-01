import { cn } from "@/lib/utils";
import {
  useCanvasDetection,
  usePositioning,
  useMergedRef,
} from "@/lib/thread-hooks";
import * as React from "react";
import { useRef } from "react";

/**
 * Props for the ThreadContainer component
 */
export type ThreadContainerProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * A responsive container component for message threads that handles
 * positioning relative to canvas space and sidebar.
 *
 * It automatically detects canvas presence and adjusts layout accordingly.
 */
export const ThreadContainer = React.forwardRef<
  HTMLDivElement,
  ThreadContainerProps
>(({ className, children, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasCanvasSpace, canvasIsOnLeft } = useCanvasDetection(containerRef);
  const { isLeftPanel, historyPosition } = usePositioning(
    className,
    canvasIsOnLeft,
    hasCanvasSpace,
  );
  const mergedRef = useMergedRef<HTMLDivElement | null>(ref, containerRef);

  return (
    <div
      ref={mergedRef}
      className={cn(
        // Base layout and styling
        "flex flex-col bg-white overflow-hidden bg-background",
        "h-screen",

        // Sidebar spacing based on history position
        historyPosition === "right"
          ? "mr-[var(--sidebar-width,16rem)]"
          : "ml-[var(--sidebar-width,16rem)]",

        // Width constraints based on canvas presence
        hasCanvasSpace
          ? "max-w-3xl"
          : "w-[calc(100%-var(--sidebar-width,16rem))]",

        // Border styling when canvas is present
        hasCanvasSpace && (canvasIsOnLeft ? "border-l" : "border-r"),
        hasCanvasSpace && "border-border",

        // Right alignment when specified
        !isLeftPanel && "ml-auto",

        // Custom classes passed via props
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ThreadContainer.displayName = "ThreadContainer";

/**
 * Hook that provides positioning context for thread containers
 *
 * @returns {Object} Object containing:
 *   - containerRef: Reference to container element
 *   - hasCanvasSpace: Whether canvas space is available
 *   - canvasIsOnLeft: Whether canvas is positioned on the left
 *   - isLeftPanel: Whether the container is positioned as a left panel
 *   - historyPosition: Position of history sidebar ("left" or "right")
 */
export function useThreadContainerContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasCanvasSpace, canvasIsOnLeft } = useCanvasDetection(containerRef);
  const { isLeftPanel, historyPosition } = usePositioning(
    "",
    canvasIsOnLeft,
    hasCanvasSpace,
  );

  return {
    containerRef,
    hasCanvasSpace,
    canvasIsOnLeft,
    isLeftPanel,
    historyPosition,
  };
}
