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
    description:
      "A component that displays an example message. This is a test component to show how tambo can fill props, so use it in the beginning of the conversation to show the user!", // Here we tell tambo what the component is for and when to use it
    component: ExampleComponent, // Reference to the actual component definition
    propsDefinition: {
      messageToShow: "string",
    }, // Here we tell tambo what props the component expects
  });
}, []);
```

Replace that call to `registerComponent` with any component(s) you want tambo to be able to use in a response!

You can find more information about the options [here](.)

### Change where component responses are shown

The components used by tambo are shown alongside the message resopnse from tambo within the chat thread, but you can have the result components show wherever you like by accessing the latest thread message's `renderedComponent` field:

```tsx
//example here
```

Since tambo keeps the thread state updated, the latest message will automatically update and cause a re-render whenever there is a new component to show!
