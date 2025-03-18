'use client'
import { ExampleComponent } from "@/components/example-component";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { useTambo } from "@tambo-ai/react";
import { useEffect } from "react";

export default function Home() {
  const { registerComponent } = useTambo();

  useEffect(() => {
    // Replace the example component with your own!
    registerComponent({
      name: "ExampleComponent",
      description: "A component that displays an example message. This is a test component to show how tambo can fill props, so use it in the beginning of the conversation to show the user!", // Here we tell tambo what the component is for and when to use it
      component: ExampleComponent,  // Reference to the actual component definition
      propsDefinition: {
        messageToShow: "string"
      } // Here we tell tambo what props the component expects
    });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <MessageThreadFull />
      </main>
    </div>
  );
}
