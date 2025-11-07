import IconWrapper from "../IconWrapper";

interface ApiIconProps {
  size?: number;
  color?: string;
}

export default function ApiIcon({
  size = 20,
  color = "currentColor",
}: ApiIconProps) {
  return (
    <IconWrapper>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    </IconWrapper>
  );
}
