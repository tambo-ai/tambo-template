"use client";

import { withInteractable } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const summarySchema = z.object({
  bulletPoints: z
    .array(z.string())
    .describe(
      "Array of bullet point strings to display. Keep these very short and concise."
    ),
});

type SummaryProps = z.infer<typeof summarySchema>;

function SummaryPanelBase(props: SummaryProps) {
  const [bulletPoints, setBulletPoints] = useState<string[]>(
    props.bulletPoints
  );
  const [isLoading, setIsLoading] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const prevPropsRef = useRef<SummaryProps>(props);

  // Update local state when props change from Tambo
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    // Check if bullet points changed
    const bulletPointsChanged =
      JSON.stringify(props.bulletPoints) !==
      JSON.stringify(prevProps.bulletPoints);

    if (bulletPointsChanged) {
      setIsLoading(true);
      // Simulate loading state
      setTimeout(() => {
        setBulletPoints(props.bulletPoints);
        setUpdatedFields(new Set(["bulletPoints"]));
        setIsLoading(false);

        // Clear highlights after animation
        const timer = setTimeout(() => {
          setUpdatedFields(new Set());
        }, 1000);
        return () => clearTimeout(timer);
      }, 500);
    }

    prevPropsRef.current = props;
  }, [props]);

  // Function to render text with bold formatting
  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  // Skeleton loading component
  const SkeletonBulletPoint = () => (
    <div className="flex items-center space-x-3 animate-pulse">
      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      <div className="h-4 bg-gray-300 rounded w-full max-w-md"></div>
    </div>
  );

  // Show skeleton when bullet points are empty
  const isEmpty = bulletPoints.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>

      {isLoading || isEmpty ? (
        <div className="space-y-3">
          <SkeletonBulletPoint />
          <SkeletonBulletPoint />
          <SkeletonBulletPoint />
        </div>
      ) : (
        <ul
          className={`space-y-2 ${
            updatedFields.has("bulletPoints") ? "animate-flash" : ""
          }`}
        >
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 leading-relaxed">
                {renderBoldText(point)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Create the interactable component
const InteractableSummaryPanel = withInteractable(SummaryPanelBase, {
  componentName: "SummaryPanel",
  description:
    "A summary panel that displays bullet points with loading states",
  propsSchema: summarySchema,
});

// Export the interactable component directly
export { InteractableSummaryPanel as SummaryPanel };

export { summarySchema };
