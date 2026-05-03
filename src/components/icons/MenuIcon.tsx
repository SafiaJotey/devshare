export const MenuIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-all duration-300 ${className}`}
  >
    {/* 
      1. THE TOP LINE 
      Extended further to the right (x=23)
    */}
    <path 
      d="M9 5H23" 
      stroke="currentColor" 
      strokeWidth="2.2" /* Slightly thicker for more 'bigness' */
      strokeLinecap="round" 
      className="text-primary"
    />

    {/* 
      2. THE MIDDLE LINE
      Extended to x=21
    */}
    <path 
      d="M9 12H21" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      className="text-primary/70"
    />

    {/* 
      3. THE BOTTOM LINE
      Full width from edge to edge (x=1 to x=23)
    */}
    <path 
      d="M1 19H23" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      className="text-primary/40"
    />

    {/* 
      4. THE CREATIVE ARROW
      Made larger and moved closer to the edge
    */}
    <path 
      d="M6 9L2 5L6 1" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-accent"
      transform="translate(0, 0)" 
    />
  </svg>
);