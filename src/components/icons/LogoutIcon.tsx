export const LogoutIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-all duration-300 ${className}`}
  >
    {/* 
      1. THE PORTAL (Secondary Element)
      Mirrored to the left side to represent the exit.
      Professional Tip: Kept at 40% opacity to maintain consistency with LoginIcon.
    */}
    <path 
      d="M9 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H9" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      className="opacity-40" 
    />

    {/* 
      2. THE ACTION (Primary Element)
      Arrow pointing outwards to the right.
      Creative Tip: Full opacity to indicate the directional movement of logging out.
    */}
    <path 
      d="M16 17L21 12L16 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M21 12H9" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);