interface AddFriendProp {
  color?: string; // Thuộc tính 'color' là tùy chọn
}
export default function AddFriendIcon({ color = '#076EB8' }: AddFriendProp) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="vuesax/linear/profile-add">
        <g id="profile-add">
          <path
            id="Vector"
            d="M18.5 19.5H14.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_2"
            d="M16.5 21.5V17.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_3"
            d="M12.1596 10.87C12.0596 10.86 11.9396 10.86 11.8296 10.87C9.44961 10.79 7.55961 8.84 7.55961 6.44C7.54961 3.99 9.53961 2 11.9896 2C14.4396 2 16.4296 3.99 16.4296 6.44C16.4296 8.84 14.5296 10.79 12.1596 10.87Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_4"
            d="M11.99 21.8102C10.17 21.8102 8.36004 21.3502 6.98004 20.4302C4.56004 18.8102 4.56004 16.1702 6.98004 14.5602C9.73004 12.7202 14.24 12.7202 16.99 14.5602"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
