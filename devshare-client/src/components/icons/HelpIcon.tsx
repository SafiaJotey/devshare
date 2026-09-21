export const HelpIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 transition-colors ${className}`}
  >
    {/* Outer Circle - The Shell */}
    {/* <circle 
      cx="12" cy="12" r="10"
      fill="currentColor"
      className="opacity-60"
    /> */}
    {/* Inner Cutout (Follows site background) */}
    {/* <circle 
      cx="12" cy="12" r="7"
      fill="var(--background)"
    /> */}
    {/* Question Mark Curve */}
    <path 
      d="M9.1 9C9.1 7.4 10.4 6.1 12 6.1C13.6 6.1 14.9 7.4 14.9 9C14.9 10.6 13.5 11.5 12.5 12.1C12 12.4 11.6 12.8 11.6 13.5" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round"
    />
    {/* Dot */}
    <circle 
      cx="11.8" cy="17.5" r="1.2" 
      fill="currentColor" 
    />
  </svg>
);