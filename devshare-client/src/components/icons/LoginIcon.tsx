export const LoginIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
        strokeWidth="20"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-all duration-300 ${className}`}
  >
    {/* 
      1. THE PORTAL (Secondary Element)
      We use a 'broken' bracket shape. 
      Professional Tip: We set this to a lower opacity (40%) to make the arrow pop.
    */}
    <path 
      d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      className="opacity-40" 
    />

    {/* 
      2. THE ACTION (Primary Element)
      A sharp, precise chevron and line.
      Creative Tip: We give this a full opacity to draw the eye.
    */}
    <path 
      d="M10 17L15 12L10 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M15 12H3" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);