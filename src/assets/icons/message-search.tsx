type Props = {
  color?: string;
};
export default function MessageSearchIcon({ color }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.58366 17.5001C13.9559 17.5001 17.5003 13.9557 17.5003 9.58341C17.5003 5.21116 13.9559 1.66675 9.58366 1.66675C5.2114 1.66675 1.66699 5.21116 1.66699 9.58341C1.66699 13.9557 5.2114 17.5001 9.58366 17.5001Z"
        stroke={color || '#485259'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 18.3334L16.667 16.6667"
        stroke={color || '#485259'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
