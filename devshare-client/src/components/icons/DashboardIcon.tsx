export const DashboardIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 transition-colors ${className}`}
  >
    {/* Large Main Block - The "Shell" */}
    <rect 
      x="3" y="3" width="8" height="11" rx="1.5"
      fill="currentColor"
      className="opacity-60"
    />
    {/* Creative Accent Block - Full Strength */}
    <rect 
      x="13" y="3" width="8" height="7" rx="1.5"
      fill="currentColor"
    />
    {/* Bottom Left Block - Faint */}
    <rect 
      x="3" y="16" width="8" height="5" rx="1.5"
      fill="currentColor" 
      className="opacity-30"
    />
    {/* Bottom Right Block - Medium */}
    <rect 
      x="13" y="12" width="8" height="9" rx="1.5"
      fill="currentColor"
      className="opacity-70"
    />
  </svg>
);