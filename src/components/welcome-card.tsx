import { useState } from 'react';

export const WelcomeCard = () => {
  const exampleMessage = 'Show me a product card for a gaming laptop priced at $1299 with emerald accent color and 20% discount';
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl w-full mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">👋 Welcome to the Tambo Demo!</h2>
      <p className="text-gray-700 mb-4">
        Try sending a message to see our product card component in action. You can customize various elements including:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
        <li>Product name and description</li>
        <li>Price and discount percentage</li>
        <li>Accent colors (indigo, emerald, rose, or amber)</li>
        <li>Stock status and product image</li>
      </ul>
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
      <p className="text-gray-500 text-sm mt-4 italic">
        Tip: You can try different variations like changing the accent color, adjusting the price, or setting items as out of stock!
      </p>
    </div>
  );
}; 