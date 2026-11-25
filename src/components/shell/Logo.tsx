export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle
        cx="16"
        cy="16"
        r="14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2.5"
      />
      <g fill="currentColor">
        <ellipse cx="16" cy="19.5" rx="5" ry="4" />
        <ellipse cx="9.5" cy="14" rx="2" ry="2.6" />
        <ellipse cx="14" cy="9.5" rx="2" ry="2.6" />
        <ellipse cx="18.8" cy="9.5" rx="2" ry="2.6" />
        <ellipse cx="22.5" cy="14" rx="2" ry="2.6" />
      </g>
    </svg>
  );
}
