import { useState } from 'react';

export const WelcomeCard = () => {
  const exampleMessage = 'I am looking for a coffee maker';
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl w-full mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">👋 Welcome to the Tambo Starter!</h2>
      <p className="text-gray-700 mb-4">This app is set up with a "ProductCard" component registered with Tambo to show how to build an AI-powered web app.</p>
      <p className="text-gray-700 mb-4">
        Try sending a message to see our product card component in action. Based on the message, Tambo will look at the product data and generate the props for the product card component.
      </p>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-gray-600 text-sm mb-2">Try this example message:</p>
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-mono text-sm break-all">{exampleMessage}</p>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors min-w-[4rem]"
          >
            {isCopied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-4 italic">Tip: Find the available products in <code className="bg-gray-200 p-1 rounded-md">src/services/product-service.ts</code></p>
    </div>
  );
}; 