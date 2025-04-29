"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded transition-colors relative group"
      title="Copy to clipboard"
    >
      {showCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {showCopied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
};

const ApiKeyMissingAlert = () => (
  <div className="mb-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
    <p className="mb-3">To get started, you need to initialize Tambo:</p>
    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded mb-3">
      <code className="text-sm flex-grow">npx tambo init</code>
      <CopyButton text="npx tambo init" />
    </div>
    <p className="text-sm">
      Or visit{" "}
      <a
        href="https://tambo.co/cli-auth"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-yellow-900"
      >
        tambo.co/cli-auth
      </a>{" "}
      to get your API key and set it in{" "}
      <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code>
    </p>
  </div>
);

const KeyFilesSection = () => (
  <div className="bg-white px-8 py-4">
    <h2 className="text-xl font-semibold mb-4">How it works:</h2>
    <ul className="space-y-4 text-gray-600">
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium">src/layout.tsx</code> - Main layout with
          TamboProvider
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">/chat/page.tsx</code> - Chat
          page
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            /components/ui/message-thread-full.tsx
          </code>{" "}
          - Chat UI
        </span>
      </li>

      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            /components/ui/graph.tsx
          </code>{" "}
          - A generative graph component
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">
            services/population-stats.ts
          </code>{" "}
          - An example tool implementation
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">tambo.ts</code> - Component
          and tool registration
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">README.md</code> - For more
          details check out the README
        </span>
      </li>
    </ul>
    <div className="flex gap-4 flex-wrap mt-4">
      <a
        href="https://tambo.co/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50"
      >
        View Docs
      </a>
      <a
        href="https://tambo.co/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50"
      >
        Dashboard
      </a>
    </div>
  </div>
);

export default function Home() {
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_TAMBO_API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center">
          <a href="https://tambo.co" target="_blank" rel="noopener noreferrer">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo AI Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </a>
          <h1 className="text-4xl text-center">tambo-ai chat template</h1>
        </div>

        <div className="w-full space-y-8">
          <div className="bg-white px-8 py-4">
            <h2 className="text-xl font-semibold mb-4">Setup Checklist</h2>
            <div className="flex items-start gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-1">
                  <div className="min-w-6">{isApiKeyMissing ? "❌" : "✅"}</div>
                  <p>
                    {isApiKeyMissing
                      ? "Tambo not initialized"
                      : "Tambo initialized"}
                  </p>
                </div>
                {isApiKeyMissing && <ApiKeyMissingAlert />}
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/chat"
                className={`px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 
                  ${
                    isApiKeyMissing
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#7FFFC3] hover:bg-[#72e6b0] text-gray-800"
                  }`}
                onClick={(e) => isApiKeyMissing && e.preventDefault()}
              >
                Go to Chat →
              </a>
            </div>
          </div>

          <KeyFilesSection />
        </div>
      </main>
    </div>
  );
}
