import { createRootRoute, Outlet } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '../styles/globals.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="antialiased font-[family-name:var(--font-geist-sans)]">
      <Outlet />
    </div>
  );
}