import { useTamboThreadInput } from "@tambo-ai/react";
import { useState } from "react";

export const WelcomeCard = () => {
  const exampleMessage = "show me top 10 countries by population";
  const [isFilled, setIsFilled] = useState(false);
  const { setValue } = useTamboThreadInput("tambo-template");

  const fillMessageInput = () => {
    setValue(exampleMessage);
    setIsFilled(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl w-full mb-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">🐙 tambo-ai chat starter!</h2>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-gray-600 text-sm mb-2">Try this example message:</p>
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-mono text-sm break-all">
            {exampleMessage}
          </p>
          <button
            onClick={fillMessageInput}
            className="flex-shrink-0 text-xs px-3 py-1.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded transition-colors min-w-[4rem] text-gray-600"
          >
            {isFilled ? "✓" : "try"}
          </button>
        </div>
      </div>
    </div>
  );
};
