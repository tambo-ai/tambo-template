import { z } from 'zod';
import type { TamboTool } from '@tambo-ai/react';

// Example mobile tools; replace with real ones as needed.
export const tools: TamboTool[] = [
  {
    name: 'echo',
    description: 'Echo text back',
    tool: async ({ text }: { text: string }) => ({ text }),
    toolSchema: z
      .function()
      .args(z.object({ text: z.string() }))
      .returns(z.object({ text: z.string() })),
  },
];

