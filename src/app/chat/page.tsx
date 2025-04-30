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
        <MessageThreadFull contextKey="tambo-template" />
    </div>
  );
}
