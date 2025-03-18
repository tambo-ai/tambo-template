// Example component to show how tambo can fill props
export const ExampleComponent = ({ messageToShow }: { messageToShow: string }) => {
  const handleClick = () => {
    alert(messageToShow);
  };

  return (
    <div>
      <button onClick={handleClick}>Show Message</button>
      {messageToShow}
    </div>
  );
};
