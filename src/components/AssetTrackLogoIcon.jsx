/**
 * Inline SVG mark for AssetTrack — inventory box with a status check badge.
 * Uses currentColor for strokes; badge fill uses the parent text color.
 */
function AssetTrackLogoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="8"
        width="20"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 14h10M10 18h7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="23" cy="9" r="5" fill="currentColor" />
      <path
        d="M20.75 9l1.25 1.25 2.5-2.75"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AssetTrackLogoIcon
