'use client'
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/services/product-service";
import { TamboProvider, TamboTool, type TamboComponent } from "@tambo-ai/react";
import { Geist, Geist_Mono } from "next/font/google";
import { z } from "zod";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const productsTool: TamboTool = {
  name: "products",
  description: "A tool to get products from the database",
  tool: getProducts,
  toolSchema: z.function().returns(z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    discountPercentage: z.number().optional(),
    accentColor: z.string(),
    inStock: z.boolean().optional()
  })))
} // define a 'context tool' that can be used by Tambo to get products from the database

const tamboComponents: TamboComponent[] = [
  {
    name: "ProductCard",
    description: "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!", // Here we tell tambo what the component is for and when to use it
    component: ProductCard, // Reference to the actual component definition
    propsDefinition: {
      name: "string",
      price: "number",
      description: "string",
      discountPercentage: "number",
      accentColor: {
        type: "enum",
        options: ["indigo", "emerald", "rose", "amber"]
      },
      inStock: "boolean"
    }, // Here we tell tambo what props the component expects
    associatedTools: [productsTool] // associate the products tool with the component so Tambo fetches real products when generating this component's props
  },
  // Add more components for Tambo to control here!
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={tamboComponents}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
