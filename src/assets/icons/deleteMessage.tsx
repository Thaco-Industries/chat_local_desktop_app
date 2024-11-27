type Props = {
  isUserMessage: boolean;
};

export default function DeleteMessageIcon({ isUserMessage }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="delete 1">
        <g id="Group">
          <path
            id="Vector"
            d="M9.99955 3.3335C5.85788 3.3335 2.49955 5.8335 2.49955 10.0002C2.46441 11.6025 3.04614 13.1571 4.12455 14.3427C3.9513 15.3153 3.42261 16.1889 2.64122 16.7935C2.5807 16.8455 2.5372 16.9145 2.51636 16.9916C2.49552 17.0686 2.4983 17.1501 2.52435 17.2256C2.55039 17.301 2.5985 17.3669 2.66243 17.4146C2.72635 17.4624 2.80316 17.4899 2.88288 17.4935C4.06622 17.5352 5.89122 17.3768 7.00788 16.1852C7.97142 16.5108 8.9825 16.6736 9.99955 16.6668C14.1412 16.6668 17.4996 14.1668 17.4996 10.0002C17.4996 5.8335 14.1412 3.3335 9.99955 3.3335ZM12.5246 11.6418C12.586 11.699 12.6352 11.768 12.6694 11.8447C12.7035 11.9214 12.7219 12.0041 12.7234 12.0881C12.7249 12.172 12.7094 12.2553 12.678 12.3332C12.6466 12.411 12.5998 12.4817 12.5404 12.541C12.4811 12.6004 12.4104 12.6472 12.3326 12.6786C12.2547 12.71 12.1714 12.7255 12.0875 12.724C12.0035 12.7225 11.9208 12.7041 11.8441 12.67C11.7674 12.6358 11.6984 12.5866 11.6412 12.5252L9.99955 10.8843L8.35788 12.5252C8.23941 12.6356 8.0827 12.6957 7.92078 12.6928C7.75887 12.69 7.60438 12.6244 7.48987 12.5098C7.37536 12.3953 7.30976 12.2408 7.30691 12.0789C7.30405 11.917 7.36415 11.7603 7.47455 11.6418L9.11539 10.0002L7.47455 8.3585C7.36415 8.24002 7.30405 8.08331 7.30691 7.92139C7.30976 7.75948 7.37536 7.60499 7.48987 7.49048C7.60438 7.37597 7.75887 7.31037 7.92078 7.30752C8.0827 7.30466 8.23941 7.36476 8.35788 7.47516L9.99955 9.116L11.6412 7.47516C11.7597 7.36476 11.9164 7.30466 12.0783 7.30752C12.2402 7.31037 12.3947 7.37597 12.5092 7.49048C12.6237 7.60499 12.6893 7.75948 12.6922 7.92139C12.6951 8.08331 12.635 8.24002 12.5246 8.3585L10.8837 10.0002L12.5246 11.6418Z"
            fill="#7B87A2"
            fillOpacity={isUserMessage ? '1' : '0.4'}
          />
        </g>
      </g>
    </svg>
  );
}
