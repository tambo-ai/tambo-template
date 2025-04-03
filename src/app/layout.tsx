"use client";
// import { ProductCard } from "@/components/product-card";
// import { TamboComponent } from "@tambo-ai/react";
import { TamboProvider } from "@tambo-ai/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { components } from "@/lib/tambo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={components}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
