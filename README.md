# Tambo Template

A starter Next.js app with [Tambo AI](https://tambo.co) integration for building generative UI/UX applications. Tambo enables AI to dynamically generate and control React components in real time.

## Get Started

1. Create a new project:

```bash
npm create-tambo@latest my-tambo-app
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Tambo (sets up your API key):

```bash
npx tambo init
```

Or rename `example.env.local` to `.env.local` and add your Tambo API key (get one free at [tambo.co/dashboard](https://tambo.co/dashboard)).

4. Start the dev server:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) to use the app.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with setup checklist and links to demos |
| `/chat` | Full chat interface with MCP support, voice input, and generative components |
| `/interactables` | Interactive demo with a chat sidebar controlling a settings panel |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page with setup checklist
│   ├── layout.tsx               # Root layout (Geist fonts, global styles)
│   ├── globals.css              # Global styles and CSS variables
│   ├── chat/
│   │   └── page.tsx             # Chat page with TamboProvider and MCP
│   └── interactables/
│       ├── page.tsx             # Interactables demo page
│       └── components/
│           └── settings-panel.tsx  # AI-controlled settings form
├── components/
│   ├── ApiKeyCheck.tsx          # API key validation UI
│   ├── tambo/                   # Tambo-specific components
│   │   ├── message-thread-full.tsx  # Full chat layout
│   │   ├── message-input.tsx        # Input with toolbar, file upload, MCP
│   │   ├── message.tsx              # Single message display
│   │   ├── graph.tsx                # Generative chart component (bar/line/pie)
│   │   ├── mcp-components.tsx       # MCP prompt and resource UI
│   │   ├── mcp-config-modal.tsx     # MCP server configuration modal
│   │   ├── dictation-button.tsx     # Voice input button
│   │   ├── elicitation-ui.tsx       # MCP elicitation forms
│   │   ├── message-suggestions.tsx  # AI-powered suggestions
│   │   ├── thread-history.tsx       # Thread history sidebar
│   │   └── ...                      # Additional UI components
│   └── ui/
│       └── card-data.tsx        # Generative DataCard component
├── lib/
│   ├── tambo.ts                 # Central config: component and tool registration
│   ├── thread-hooks.ts          # Custom thread management hooks
│   ├── use-anonymous-user-key.ts  # Anonymous user ID persistence
│   └── utils.ts                 # Utility functions
└── services/
    └── population-stats.ts      # Demo data service (population statistics)
```

## Features

### Generative Components

AI dynamically renders registered React components based on user input. The template includes two example components:

- **Graph** - Recharts-based data visualization (bar, line, pie charts)
- **DataCard** - Selectable cards with links and descriptions

### Tools

AI can invoke registered tools to fetch data or perform actions. The template includes:

- **countryPopulation** - Country population stats with filtering by continent, sorting, and limits
- **globalPopulation** - Global population trends with year range filtering

### MCP (Model Context Protocol)

Full MCP support for connecting to external tool servers:

- Configure MCP servers via the in-app modal (HTTP/SSE transport)
- Browse and insert MCP prompts and resources
- Elicitation UI for multi-step MCP forms

### Voice Input

Speech-to-text via the `DictationButton` component using the `useTamboVoice` hook.

### Interactables

Components wrapped with `withTamboInteractable` allow AI to control their state directly. The demo shows a settings panel whose fields update in real time as the AI responds.

### Streaming

Real-time streaming of AI-generated content with progressive UI updates and generation stage indicators.

### Thread Management

Full thread history sidebar with search, thread switching, and new thread creation.

## Customizing

### Register Components

Components are registered in `src/lib/tambo.ts`:

```tsx
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
];
```

To add a new component:

1. Create the component in `src/components/tambo/`
2. Define a Zod schema for its props
3. Register it in the `components` array in `src/lib/tambo.ts`

You can also install pre-built components:

```bash
npx tambo add graph
```

More info: [Generative Components docs](https://docs.tambo.co/concepts/generative-interfaces/generative-components)

### Register Tools

Tools are defined with `inputSchema` and `outputSchema`:

```tsx
export const tools: TamboTool[] = [
  {
    name: "globalPopulation",
    description: "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
];
```

More info: [Tools docs](https://docs.tambo.co/concepts/tools)

### TamboProvider

The `TamboProvider` wraps each page that uses Tambo (see `src/app/chat/page.tsx`):

```tsx
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  components={components}
  tools={tools}
  tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
  mcpServers={mcpServers}
  userKey={userKey}
>
  {children}
</TamboProvider>
```

### Display Components Outside the Chat

Access rendered components from the thread to display them anywhere:

```tsx
const { thread } = useTambo();
const latestComponent =
  thread?.messages[thread.messages.length - 1]?.renderedComponent;

return (
  <div>
    {latestComponent && (
      <div className="my-custom-wrapper">{latestComponent}</div>
    )}
  </div>
);
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |

## Tech Stack

- [Next.js](https://nextjs.org) 15 with App Router
- [React](https://react.dev) 19
- [Tambo AI SDK](https://tambo.co) (`@tambo-ai/react`)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Recharts](https://recharts.org) for data visualization
- [TipTap](https://tiptap.dev) for rich text editing
- [Zod](https://zod.dev) for schema validation
- [Framer Motion](https://motion.dev) for animations

For full documentation, visit [docs.tambo.co](https://docs.tambo.co).
