/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph } from "@/components/ui/graph";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * globalPopulationTool
 *
 * This tool fetches global population trends over the last 20 years. It provides
 * yearly population data with growth rates. Supports filtering by year range.
 */
export const globalPopulationTool: TamboTool = {
  name: "globalPopulation",
  description:
    "A tool to get global population trends with optional year range filtering",
  tool: getGlobalPopulationTrend,
  toolSchema: z.function().args(
    z
      .object({
        startYear: z.number().optional(),
        endYear: z.number().optional(),
      })
      .optional()
  ),
};

/**
 * countryPopulationTool
 *
 * This tool fetches population data for different countries, with filtering options for:
 * - Continent
 * - Sorting by population or growth rate
 * - Limiting results (e.g., top 10, bottom 10)
 * - Sort order (ascending/descending)
 */
export const countryPopulationTool: TamboTool = {
  name: "countryPopulation",
  description:
    "A tool to get population statistics by country with advanced filtering options",
  tool: getCountryPopulations,
  toolSchema: z.function().args(
    z
      .object({
        continent: z.string().optional(),
        sortBy: z.enum(["population", "growthRate"]).optional(),
        limit: z.number().optional(),
        order: z.enum(["asc", "desc"]).optional(),
      })
      .optional()
  ),
};

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: z.object({
      data: z
        .object({
          type: z
            .enum(["bar", "line", "pie"])
            .describe("Type of graph to render"),
          labels: z.array(z.string()).describe("Labels for the graph"),
          datasets: z
            .array(
              z.object({
                label: z.string().describe("Label for the dataset"),
                data: z
                  .array(z.number())
                  .describe("Data points for the dataset"),
                color: z
                  .string()
                  .optional()
                  .describe("Optional color for the dataset"),
              })
            )
            .describe("Data for the graph"),
        })
        .describe("Data object containing chart configuration and values"),
      title: z.string().optional().describe("Optional title for the chart"),
      showLegend: z
        .boolean()
        .optional()
        .describe("Whether to show the legend (default: true)"),
      variant: z
        .enum(["default", "solid", "bordered"])
        .optional()
        .describe("Visual style variant of the graph"),
      size: z
        .enum(["default", "sm", "lg"])
        .optional()
        .describe("Size of the graph"),
    }),
  },
  // Add more components here
];
