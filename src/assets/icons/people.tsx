interface PeopleIconProps {
  color?: string; // Thuộc tính 'color' là tùy chọn
}
export default function PeopleIcon({ color = 'white' }: PeopleIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="vuesax/linear/people">
        <g id="people">
          <g id="Group">
            <path
              id="Vector"
              d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M16.9704 14.4402C18.3404 14.6702 19.8504 14.4302 20.9104 13.7202C22.3204 12.7802 22.3204 11.2402 20.9104 10.3002C19.8404 9.59016 18.3104 9.35016 16.9404 9.59016"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g id="Group_2">
            <path
              id="Vector_3"
              d="M5.97047 7.16C6.03047 7.15 6.10047 7.15 6.16047 7.16C7.54047 7.11 8.64047 5.98 8.64047 4.58C8.64047 3.15 7.49047 2 6.06047 2C4.63047 2 3.48047 3.16 3.48047 4.58C3.49047 5.98 4.59047 7.11 5.97047 7.16Z"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_4"
              d="M7.00043 14.4402C5.63043 14.6702 4.12043 14.4302 3.06043 13.7202C1.65043 12.7802 1.65043 11.2402 3.06043 10.3002C4.13043 9.59016 5.66043 9.35016 7.03043 9.59016"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g id="Group_3">
            <path
              id="Vector_5"
              d="M12.0001 14.6288C11.9401 14.6188 11.8701 14.6188 11.8101 14.6288C10.4301 14.5788 9.33008 13.4488 9.33008 12.0488C9.33008 10.6188 10.4801 9.46875 11.9101 9.46875C13.3401 9.46875 14.4901 10.6288 14.4901 12.0488C14.4801 13.4488 13.3801 14.5888 12.0001 14.6288Z"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_6"
              d="M9.08973 17.7794C7.67973 18.7194 7.67973 20.2594 9.08973 21.1994C10.6897 22.2694 13.3097 22.2694 14.9097 21.1994C16.3197 20.2594 16.3197 18.7194 14.9097 17.7794C13.3197 16.7194 10.6897 16.7194 9.08973 17.7794Z"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
