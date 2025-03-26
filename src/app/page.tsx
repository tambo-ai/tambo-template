'use client'
import { ExampleComponent } from "@/components/example-component";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { useTambo } from "@tambo-ai/react";
import { useEffect } from "react";
import { WelcomeCard } from "@/components/welcome-card";

export default function Home() {
  const { registerComponent, thread } = useTambo();

  useEffect(() => {
    // Replace the example component with your own!
    registerComponent({
      name: "ExampleComponent",
      description: "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!", // Here we tell tambo what the component is for and when to use it
      component: ExampleComponent, // Reference to the actual component definition
      propsDefinition: {
        productName: "string",
        price: "number",
        description: "string",
        discountPercentage: "number",
        accentColor: {
          type: "enum",
          options: ["indigo", "emerald", "rose", "amber"]
        },
        inStock: "boolean"
      } // Here we tell tambo what props the component expects
    });
  }, [registerComponent, thread]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {(!thread || thread.messages.length === 0) && <WelcomeCard />}
        <MessageThreadFull contextKey="tambo-template"/>
      </main>
    </div>
  );
}
