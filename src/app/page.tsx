"use client";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { WelcomeCard } from "@/components/welcome-card";
import { useTambo } from "@tambo-ai/react";

export default function Home() {
  const { thread } = useTambo();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center sm:items-start">
          {(!thread || thread.messages.length === 0) && (
            <div className="w-full min-w-xl">
              <WelcomeCard />
            </div>
          )}
          <div className="w-full min-w-xl">
            <MessageThreadFull contextKey="tambo-template" />
          </div>
        </div>
      </main>
    </div>
  );
}
