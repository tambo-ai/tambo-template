"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-6xl mx-auto">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      >
        <MessageThreadFull contextKey="tambo-template" />
      </TamboProvider>
    </div>
  );
}
