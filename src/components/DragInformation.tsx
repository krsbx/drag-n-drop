const DragInformations = ({
  isVisible = false,
  messages = 'Drag and Drop here',
}: Props) => {
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {messages}
    </div>
  );
};

type Props = {
  messages?: string;
  isVisible?: boolean;
};

export default DragInformations;
