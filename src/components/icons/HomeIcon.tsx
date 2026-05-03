export const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 transition-all duration-300 ${className}`}
  >
    {/* 
      1. THE FLOATING ROOF 
      We use your gold accent color here. 
      The 'broken' peak makes it look professional and unique.
    */}
    <path 
      d="M3 10.5L12 3L21 10.5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 

    />

    {/* 
      2. THE SIDE WALLS (Broken Frame)
      Notice we don't draw the floor. This 'open bottom' style 
      is what gives it a high-end, modern look.
    */}
    <path 
      d="M5 13V19C5 20.1046 5.89543 21 7 21H9" 
      stroke="currentColor" 
    //   strokeWidth="2" 
      strokeLinecap="round" 
      className="text-primary/60"
    />
    <path 
      d="M19 13V19C19 20.1046 18.1046 21 17 21H15" 
      stroke="currentColor" 
    //   strokeWidth="2" 
      strokeLinecap="round" 
    className="opacity-60" 
    />

    {/* 
      3. THE 'CORE' (The Developer cursor)
      Instead of a door, we use a small 'underscore' or 'dash'. 
      This is a subtle nod to a terminal cursor.
    */}
    <path 
      d="M11 17H13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
 
    />
  </svg>
);