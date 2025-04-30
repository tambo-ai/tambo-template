"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { countryPopulationTool, globalPopulationTool } from "@/lib/tambo";
import { useTambo } from "@tambo-ai/react";
import { useEffect } from "react";

export default function Home() {
  const { registerTool } = useTambo();

  useEffect(() => {
    registerTool(countryPopulationTool);
    registerTool(globalPopulationTool);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col items-center w-full overflow-hidden">
        <MessageThreadFull contextKey="tambo-template" className="!h-auto flex-1" />
      </main>
      <footer className="flex items-center justify-center gap-2 p-4 text-sm text-gray-500">
        Powered by{" "}
        <a
          href="https://tambo.co"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Tambo-Lockup.svg" alt="Tambo" className="h-4" />
        </a>
      </footer>
    </div>
  );
}
