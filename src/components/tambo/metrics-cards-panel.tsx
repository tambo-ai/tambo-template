"use client";

import { withInteractable } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const metricCardSchema = z.object({
  icon: z.string().describe("Icon/emoji for the metric card"),
  value: z.string().describe("Large number value to display"),
  title: z.string().describe("Metric title/label"),
  description: z.string().describe("Brief description of the metric"),
});

const metricsCardsSchema = z.object({
  cards: z
    .array(metricCardSchema)
    .describe(
      "Array of metric cards to display. show top 4. even if there are metrics."
    ),
});

type MetricsCardsProps = z.infer<typeof metricsCardsSchema>;
type MetricCard = z.infer<typeof metricCardSchema>;

function MetricsCardsPanelBase(props: MetricsCardsProps) {
  const [cards, setCards] = useState<MetricCard[]>(props.cards);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const prevPropsRef = useRef<MetricsCardsProps>(props);

  // Update local state when props change from Tambo
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    // Check if cards changed
    const cardsChanged =
      JSON.stringify(props.cards) !== JSON.stringify(prevProps.cards);

    if (cardsChanged) {
      setIsLoading(true);
      // Simulate loading state
      setTimeout(() => {
        setCards(props.cards);
        setUpdatedFields(new Set(["cards"]));
        setIsLoading(false);

        // Clear highlights after animation
        const timer = setTimeout(() => {
          setUpdatedFields(new Set());
        }, 1000);
        return () => clearTimeout(timer);
      }, 800);
    }

    prevPropsRef.current = props;
  }, [props]);

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-spin"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
    </div>
  );

  // Show skeleton when cards array is empty
  const isEmpty = cards.length === 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading || isEmpty ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          cards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                updatedFields.has("cards") ? "animate-flash" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1 animate-number">
                {card.value}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">
                {card.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Create the interactable component
const InteractableMetricsCardsPanel = withInteractable(MetricsCardsPanelBase, {
  componentName: "MetricsCardsPanel",
  description:
    "A horizontal row of metric cards showing key performance indicators",
  propsSchema: metricsCardsSchema,
});

// Export the interactable component directly
export { InteractableMetricsCardsPanel as MetricsCardsPanel };

export { metricsCardsSchema };
