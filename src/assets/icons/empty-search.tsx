type Props = {
  size?: string;
};

export default function EmptySearch({ size }: Props) {
  return (
    <svg
      width={size || '150'}
      height={size || '150'}
      viewBox={`0 0 150 150`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="timkiem 1">
        <g id="Group">
          <path
            id="Vector"
            d="M74.9998 148.812C115.765 148.812 148.812 115.765 148.812 74.9998C148.812 34.2344 115.765 1.1875 74.9998 1.1875C34.2344 1.1875 1.1875 34.2344 1.1875 74.9998C1.1875 115.765 34.2344 148.812 74.9998 148.812Z"
            fill="url(#paint0_linear_1054_33274)"
          />
          <path
            id="Vector_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M65.541 86.3133C54.0684 86.3133 44.7681 77.0138 44.7681 65.5407C44.7681 54.0676 54.0684 44.7681 65.541 44.7681C77.0135 44.7681 86.3136 54.0686 86.3136 65.5407C86.3136 77.0127 77.0133 86.3133 65.541 86.3133ZM113.157 104.221L100.58 91.6449C99.6492 90.713 98.2574 90.5161 97.1272 91.0456L89.963 83.8817C93.8044 78.7747 96.0824 72.4238 96.0824 65.541C96.0824 48.6743 82.4087 35 65.5412 35C48.6737 35 35 48.674 35 65.541C35 82.4079 48.6737 96.0819 65.5412 96.0819C72.4243 96.0819 78.7747 93.8049 83.8817 89.9633L91.0461 97.1283C90.5161 98.2587 90.7133 99.6484 91.6449 100.58L104.221 113.156C106.678 115.615 110.699 115.615 113.157 113.156C115.614 110.7 115.614 106.678 113.157 104.221L113.157 104.221Z"
            fill="url(#paint1_linear_1054_33274)"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1054_33274"
          x1="74.9998"
          y1="148.812"
          x2="74.9998"
          y2="1.1875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A6D8F4" />
          <stop offset="1" stopColor="#DFF3FD" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1054_33274"
          x1="74.9998"
          y1="38.9676"
          x2="74.9998"
          y2="110.416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0068E7" />
          <stop offset="1" stopColor="#26B3E8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
