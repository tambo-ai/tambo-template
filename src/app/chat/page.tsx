"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <MessageThreadFull contextKey="tambo-template" />
    </div>
  );
}
