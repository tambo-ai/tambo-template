// Example component to show how tambo can fill props
export const ExampleComponent = ({ messageToShow }: { messageToShow: string }) => {
  const handleClick = () => {
    alert(messageToShow);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full space-y-4">
        <p className="text-gray-700 text-center mb-4">
          Click the button to see a message that was determined by tambo!
        </p>
        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm"
            onClick={handleClick}
          >
            Show Message
          </button>
        </div>
      </div>
    </div>
  );
};
