/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/services/product-service";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

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
    propsSchema: z.object({
      name: z.string().describe("The name of the product"),
      price: z.number().describe("The price of the product"),
      description: z.string().describe("The description of the product"),
      discountPercentage: z.number().describe("The discount percentage of the product"),
      accentColor: z.enum(["indigo", "emerald", "rose", "amber"]).describe("The accent color of the product"),
      inStock: z.boolean().describe("Whether the product is in stock"),
    }),
    associatedTools: [productsTool],
  },
  // Add more components here
];
