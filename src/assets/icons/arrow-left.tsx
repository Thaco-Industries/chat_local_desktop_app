export default function ArrowLeft({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick} // Sử dụng prop onClick
      className={className}
    >
      <g id="vuesax/linear/arrow-left">
        <g id="arrow-left">
          <path
            id="Vector"
            d="M9.57 6.42993L3.5 12.4999L9.57 18.5699"
            stroke="#485259"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_2"
            d="M20.5019 12.5H3.67188"
            stroke="#485259"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
