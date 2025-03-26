# Tambo Template

This is a starter NextJS app with Tambo hooked up to get your AI app development started quickly.

## Get Started

1. `npm install`

2. Rename `example.env.local` to `.env.local` and add your real tambo API key. You can get a tambo API key for free [here](.)

3. Run `npm run dev` and go to `localhost:3000` to use the app!

## Customizing

### Change what components tambo can control

You can see how the `ExampleComponent` is registered with tambo in `src/app/page.tsx`:

```tsx
const { registerComponent } = useTambo();

useEffect(() => {
  // Replace the example component with your own!
  registerComponent({
    name: "ExampleComponent",
    description: "A product card component that displays product information with customizable pricing, discounts, and styling. Perfect for demonstrating interactive UI elements!", // Here we tell tambo what the component is for and when to use it
    component: ExampleComponent, // Reference to the actual component definition
    propsDefinition: {
      productName: "string",
      price: "number",
      description: "string",
      discountPercentage: "number",
      accentColor: {
        type: "enum",
        options: ["indigo", "emerald", "rose", "amber"]
      },
      inStock: "boolean"
    }, // Here we tell tambo what props the component expects
  });
}, []);
```

The example component demonstrates several key features:
- Different prop types (strings, numbers, booleans, enums)
- Interactive elements (Add to Cart button)
- Conditional rendering (discount display, stock status)
- Dynamic styling (color variations)

Replace that call to `registerComponent` with any component(s) you want tambo to be able to use in a response!

You can find more information about the options [here](.)

### Change where component responses are shown

The components used by tambo are shown alongside the message resopnse from tambo within the chat thread, but you can have the result components show wherever you like by accessing the latest thread message's `renderedComponent` field:

```tsx
const { thread } = useTambo();
const latestComponent = thread?.messages[thread.messages.length - 1]?.renderedComponent;

return (
  <div>
    {latestComponent && (
      <div className="my-custom-wrapper">
        {latestComponent}
      </div>
    )}
  </div>
);
```

Since tambo keeps the thread state updated, the latest message will automatically update and cause a re-render whenever there is a new component to show!
