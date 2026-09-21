export const ProfileIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
       strokeWidth="30"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-all duration-300 ${className}`}
  >
    {/* 
      1. THE HEAD 
      Simple, perfectly aligned circle. 
    */}
    <circle 
      cx="12" 
      cy="8" 
      r="4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />

    {/* 
      2. THE SHOULDERS (Broken Path)
      Professional Tip: We don't close the circle. 
      Leaving the ends open makes the UI feel less 'cluttered'.
    */}
    <path 
      d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      className="opacity-60" /* Lower opacity for the body to make the head/action clearer */
    />
    
    {/* 
      3. THE 'DEV' DETAIL (Optional Creative Touch)
      A small dash or 'cursor' to signify this is a Developer Profile.
    */}
    {/* <path 
      d="M14 14L16 16" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
     className="text-accent" 
    /> */}
  </svg>
);