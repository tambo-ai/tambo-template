# Tambo Template

This is a starter NextJS app with Tambo hooked up to get your AI app development started quickly.

## Get Started

1. `npm install`

2. Rename `example.env.local` to `.env.local` and add your real tambo API key. You can get a tambo API key for free [here](https://tambo.co/dashboard), or by running `npx tambo init`

3. Run `npm run dev` and go to `localhost:3000` to use the app!

## Customizing

### Change what components tambo can control

You can see how the `ProductCard` is registered with tambo in `src/app/layout.tsx`:

```tsx
const tamboComponents: TamboComponent[] = [
  {
    name: "ProductCard",
    description: "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!", // Here we tell tambo what the component is for and when to use it
    component: ProductCard, // Reference to the actual component definition
    propsSchema: z.object({
      name: z.string().describe("The name of the product"),
      price: z.number().describe("The price of the product"),
      description: z.string().describe("The description of the product"),
      discountPercentage: z.number().describe("The discount percentage of the product"),
      accentColor: z.enum(["indigo", "emerald", "rose", "amber"]).describe("The accent color of the product"),
      inStock: z.boolean().describe("Whether the product is in stock"),
    }) // Here we tell tambo what props the component expects
  },
  // Add more components for Tambo to control here!
];

...

        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={tamboComponents}
        >
          {children}
        </TamboProvider>
```

The example ProductCard component demonstrates several key features:

- Different prop types (strings, numbers, booleans, enums)
- Interactive elements (Add to Cart button)
- Conditional rendering (discount display, stock status)
- Dynamic styling (color variations)

Update the `tamboComponents` array with any component(s) you want tambo to be able to use in a response!

You can find more information about the options [here](https://tambo.co/docs/concepts/registering-components)

### Add tools for tambo to use

```tsx
export const productsTool: TamboTool = {
  name: "products",
  description: "A tool to get products from the database",
  tool: getProducts,
  toolSchema: z.function().returns(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        discountPercentage: z.number().optional(),
        accentColor: z.string(),
        inStock: z.boolean().optional(),
      })
    )
  ),
};

...

  const { registerTool } = useTambo();

  useEffect(() => {
    registerTool(productsTool);
  }, []);
```

Find more information about tools [here.](https://tambo.co/docs/concepts/tools)

### Change where component responses are shown

The components used by tambo are shown alongside the message resopnse from tambo within the chat thread, but you can have the result components show wherever you like by accessing the latest thread message's `renderedComponent` field:

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

Since tambo keeps the thread state updated, the latest message will automatically update and cause a re-render whenever there is a new component to show!
