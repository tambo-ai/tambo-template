"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "tambo-anonymous-user-key";

function generateUserKey(): string {
  return `anon-${crypto.randomUUID()}`;
}

/**
 * Hook that returns a stable anonymous user key for TamboProvider.
 * Persists the key in localStorage so it survives page refreshes.
 */
export function useAnonymousUserKey(): string {
  const [userKey] = useState<string>(() => {
    if (typeof window === "undefined") {
      return generateUserKey();
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    const newKey = generateUserKey();
    localStorage.setItem(STORAGE_KEY, newKey);
    return newKey;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, userKey);
    }
  }, [userKey]);

  return userKey;
}
