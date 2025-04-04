/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import type { TamboComponent } from "@tambo-ai/react";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/services/product-service";
import { z } from "zod";
import { TamboTool } from "@tambo-ai/react";

/**
 * productsTool
 *
 * This tool is used to fetch products from the database. It is defined using a Zod schema
 * to ensure the data structure is validated. This tool can be associated with components
 * to provide dynamic data fetching capabilities.
 */
export const productsTool: TamboTool = {
  name: "products",
  description: "A tool to get products from the database",
  tool: getProducts,
  toolSchema: z.function().returns(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        discountPercentage: z.number().optional(),
        accentColor: z.string(),
        inStock: z.boolean().optional(),
      })
    )
  ),
};

// Add more tools here

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "ProductCard",
    description:
      "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!",
    component: ProductCard,
    propsDefinition: {
      name: "string",
      price: "number",
      description: "string",
      discountPercentage: "number",
      accentColor: {
        type: "enum",
        options: ["indigo", "emerald", "rose", "amber"],
      },
      inStock: "boolean",
    },
    associatedTools: [productsTool],
  },
  // Add more components here
];
