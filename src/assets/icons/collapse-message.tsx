interface CollapsedMessageProps {
  stroke: string;
}

const CollapsdMessageIcon: React.FC<CollapsedMessageProps> = ({ stroke }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="17"
        rx="1.5"
        stroke={stroke || '#485259'}
      />
      {stroke && (
        <path
          d="M10.5 0.5H16C16.8284 0.5 17.5 1.17157 17.5 2V16C17.5 16.8284 16.8284 17.5 16 17.5H10.5V0.5Z"
          fill={stroke || '#485259'}
        />
      )}
      <path
        d="M10.5 0.5H16C16.8284 0.5 17.5 1.17157 17.5 2V16C17.5 16.8284 16.8284 17.5 16 17.5H10.5V0.5Z"
        stroke={stroke || '#485259'}
      />
    </svg>
  );
};

export default CollapsdMessageIcon;
