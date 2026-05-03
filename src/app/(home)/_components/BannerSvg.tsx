export const BannerSvg = () => (
   <div className="relative mt-16 flex-1 md:mt-0 w-full min-w-0">
            
            {/* Aspect Ratio Container - REMOVED MAX-WIDTH RESTRICTIONS */}
            {/* Now it will take up all available space in its flex column */}
            <div className="relative mx-auto aspect-[4/3] w-full">
              
              {/* Decorative frame */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl dark:from-dark-accent/10 dark:via-dark-primary/10 dark:to-secondary/10" />
              
              {/* Main image container */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                
                <svg 
                  viewBox="0 0 800 600" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id="soft-shadow" x="100" y="100" width="600" height="500" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="20" dx="0"/>
                      <feGaussianBlur stdDeviation="25"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.11 0 0 0 0 0.16 0 0 0 0 0.23 0 0 0 0.4 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                    <radialGradient id="glow-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 300) rotate(90) scale(350)">
                      <stop stopColor="#818CF8" stopOpacity="0.3"/> 
                      <stop offset="1" stopColor="#818CF8" stopOpacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Animated Background Blob */}
<circle 
  cx="450" 
  cy="300" 
  r="250" 
  /* 
     1. Remove the 'fill' attribute entirely.
     2. Use 'fill-primary' for light mode (#27548A).
     3. Use 'dark:fill-accent' for dark mode (#FFC470).
  */
  className="fill-primary  transition-colors duration-500"
>
  <animate attributeName="cx" values="450;430;450" dur="8s" repeatCount="indefinite" />
  <animate attributeName="cy" values="300;320;300" dur="9s" repeatCount="indefinite" />
</circle>
                  {/* Main Code Window */}
                  <g filter="url(#soft-shadow)">
                    {/* Window Body */}
                    <rect x="180" y="140" width="440" height="320" rx="16" fill="#1E293B"/> 
                    
                    {/* Window Header */}
                    <path d="M180 156C180 147.163 187.163 140 196 140H604C612.837 140 620 147.163 620 156V180H180V156Z" fill="#334155"/> 
                    
                    {/* Traffic Lights */}
                    <circle cx="210" cy="160" r="6" fill="#FF5F56"/>
                    <circle cx="230" cy="160" r="6" fill="#FFBD2E"/>
                    <circle cx="250" cy="160" r="6" fill="#27C93F"/>

                    {/* Code Mockup */}
                    {/* Line 1 */}
                    <rect x="220" y="210" width="40" height="8" rx="4" fill="#C084FC"/> 
                    <rect x="270" y="210" width="80" height="8" rx="4" fill="#E2E8F0"/> 
                    <rect x="360" y="210" width="30" height="8" rx="4" fill="#C084FC"/>
                    <rect x="400" y="210" width="60" height="8" rx="4" fill="#38BDF8"/> 

                    {/* Line 2 */}
                    <rect x="220" y="240" width="60" height="8" rx="4" fill="#818CF8"/> 
                    <rect x="290" y="240" width="100" height="8" rx="4" fill="#F472B6"/>
                    <rect x="400" y="240" width="20" height="8" rx="4" fill="#E2E8F0"/>

                    {/* Line 3 */}
                    <rect x="250" y="270" width="50" height="8" rx="4" fill="#C084FC"/>
                    <rect x="310" y="270" width="140" height="8" rx="4" fill="#E2E8F0"/>

                    {/* Line 4 */}
                    <rect x="250" y="300" width="40" height="8" rx="4" fill="#818CF8"/>
                    <rect x="300" y="300" width="10" height="8" rx="4" fill="#E2E8F0"/>
                    
                    {/* Line 5 */}
                    <rect x="280" y="330" width="200" height="8" rx="4" fill="#38BDF8"/>
                    
                    {/* Line 6 */}
                    <rect x="250" y="360" width="20" height="8" rx="4" fill="#E2E8F0"/>
                    <rect x="220" y="390" width="10" height="8" rx="4" fill="#E2E8F0"/>
                  </g>

                  {/* Floating Badge: React */}
                  <g transform="translate(140, 420)">
                    <animateTransform attributeName="transform" type="translate" values="140,420; 140,410; 140,420" dur="4s" repeatCount="indefinite" />
                    <rect width="80" height="30" rx="15" fill="#D97706" />
                    <text x="40" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">React</text>
                  </g>

                  {/* Floating Badge: Next.js */}
                  <g transform="translate(580, 260)">
                    <animateTransform attributeName="transform" type="translate" values="580,260; 580,270; 580,260" dur="5s" repeatCount="indefinite" />
                    <rect width="90" height="32" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="2"/> 
                    <text x="45" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Next.js</text>
                  </g>

                  {/* Floating Badge: Animation */}
                  <g transform="translate(500, 100)">
                    <animateTransform attributeName="transform" type="translate" values="500,100; 500,90; 500,100" dur="6s" repeatCount="indefinite" />
                    <rect width="100" height="30" rx="15" fill="#2563EB" /> 
                    <text x="50" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Animation</text>
                  </g>

                  {/* Decorative Circle */}
                  <circle cx="150" cy="180" r="6" fill="#6366F1" fillOpacity="0.6">
                    <animate attributeName="cy" values="180;160;180" dur="4s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent dark:from-dark-bg/40" />
              </div>
              
              {/* Article count badge */}
              <div className="absolute -bottom-6 -right-6 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg dark:bg-gray-800">
                <div className="h-2 w-2 rounded-full bg-accent dark:bg-dark-accent" />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent dark:from-dark-accent dark:to-dark-primary">
                  50+ Articles
                </span>
              </div>
            </div>
          </div>
);