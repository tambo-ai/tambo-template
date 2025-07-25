"use client";

import { withInteractable } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Graph, graphSchema } from "./graph";

const graphPanelSchema = z.object({
  title: z.string().describe("Title for the graph panel"),
  summary: z.string().describe("Single sentence summary of the data"),
  graphProps: graphSchema.describe(
    "Props for the Graph component. only show one line!"
  ),
});

type GraphPanelProps = z.infer<typeof graphPanelSchema>;

function GraphPanelBase(props: GraphPanelProps) {
  const [panelData, setPanelData] = useState<GraphPanelProps>(props);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const prevPropsRef = useRef<GraphPanelProps>(props);

  // Update local state when props change from Tambo
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    // Check what changed
    const changedFields = new Set<string>();

    if (props.title !== prevProps.title) {
      changedFields.add("title");
    }
    if (props.summary !== prevProps.summary) {
      changedFields.add("summary");
    }
    if (
      JSON.stringify(props.graphProps) !== JSON.stringify(prevProps.graphProps)
    ) {
      changedFields.add("graph");
    }

    if (changedFields.size > 0) {
      setIsLoading(true);
      // Simulate loading state
      setTimeout(() => {
        setPanelData(props);
        setUpdatedFields(changedFields);
        setIsLoading(false);

        // Clear highlights after animation
        const timer = setTimeout(() => {
          setUpdatedFields(new Set());
        }, 1000);
        return () => clearTimeout(timer);
      }, 1000);
    }

    prevPropsRef.current = props;
  }, [props]);

  // Skeleton loading components
  const SkeletonGraph = () => (
    <div className="w-full h-64 bg-gray-200 rounded animate-pulse flex items-center justify-center"></div>
  );

  const SkeletonText = ({
    lines = 1,
    width = "full",
  }: {
    lines?: number;
    width?: string;
  }) => (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-300 rounded ${
            width === "full" ? "w-full" : width === "3/4" ? "w-3/4" : "w-1/2"
          }`}
        ></div>
      ))}
    </div>
  );

  // Show skeleton when values are empty
  const isEmpty =
    !panelData.title || !panelData.summary || !panelData.graphProps;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xl font-bold text-gray-600 mb-2">Deep Dives</h4>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area - Left Side (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            {(isLoading && updatedFields.has("graph")) || isEmpty ? (
              <SkeletonGraph />
            ) : (
              <div
                className={updatedFields.has("graph") ? "animate-flash" : ""}
              >
                {panelData.graphProps && <Graph {...panelData.graphProps} />}
              </div>
            )}
          </div>

          {/* Description Panel - Right Side (1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Title */}
            <div>
              {(isLoading && updatedFields.has("title")) || isEmpty ? (
                <SkeletonText width="3/4" />
              ) : (
                <h3
                  className={`text-lg font-semibold text-gray-900 ${
                    updatedFields.has("title") ? "animate-flash" : ""
                  }`}
                >
                  {panelData.title}
                </h3>
              )}
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Summary
              </h4>
              {(isLoading && updatedFields.has("summary")) || isEmpty ? (
                <SkeletonText lines={2} />
              ) : (
                <p
                  className={`text-sm text-gray-700 font-medium ${
                    updatedFields.has("summary") ? "animate-flash" : ""
                  }`}
                >
                  {panelData.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create the interactable component
const InteractableGraphPanel = withInteractable(GraphPanelBase, {
  componentName: "GraphPanel",
  description:
    "A graph panel with split layout showing chart on left and description on right",
  propsSchema: graphPanelSchema,
});

// Export the interactable component directly
export { InteractableGraphPanel as GraphPanel };

export { graphPanelSchema };
