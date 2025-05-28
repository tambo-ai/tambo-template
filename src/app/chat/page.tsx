"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full mx-auto">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      >
        <div className="max-w-6xl mx-auto">
          <MessageThreadFull contextKey="tambo-template" />
        </div>
      </TamboProvider>
    </div>
  );
}
