export const BannerSvg = () => (
  <div className="relative mt-16 flex-1 md:mt-0 w-full min-w-0">
    {/* Aspect Ratio Container */}
    <div className="relative mx-auto aspect-[4/3] w-full">
      
      {/* Decorative frame */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl" />
      
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
          </defs>

          {/* Animated Background Blob (Existing) */}

        <circle 
  cx="450" 
  cy="300" 
  r="250" 
  style={{ 
    fill: 'var(--primary)', 
    opacity: 'var(--blob-opacity)', 
    transition: 'all 0.5s ease-in-out' 
  }}
>
            <animate attributeName="cx" values="450;430;450" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;320;300" dur="9s" repeatCount="indefinite" />
          </circle>

          {/* --- NEW DECORATIVE CIRCLES (Using your CSS Variables) --- */}
          <circle cx="100" cy="120" r="12" fill="var(--accent)" opacity="0.4">
            <animate attributeName="cy" values="120;100;120" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="700" cy="480" r="20" fill="var(--primary)" opacity="0.2">
            <animate attributeName="r" values="20;25;20" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="500" r="8" fill="var(--foreground)" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="720" cy="150" r="6" fill="var(--accent)" opacity="0.5" />

          {/* Main Code Window (Existing Colors Kept) */}
          <g filter="url(#soft-shadow)">
            <rect x="180" y="140" width="440" height="320" rx="16" fill="#1E293B"/> 
            <path d="M180 156C180 147.163 187.163 140 196 140H604C612.837 140 620 147.163 620 156V180H180V156Z" fill="#334155"/> 
            <circle cx="210" cy="160" r="6" fill="#FF5F56"/>
            <circle cx="230" cy="160" r="6" fill="#FFBD2E"/>
            <circle cx="250" cy="160" r="6" fill="#27C93F"/>

            {/* Code Mockup */}
            <rect x="220" y="210" width="40" height="8" rx="4" fill="#C084FC"/> 
            <rect x="270" y="210" width="80" height="8" rx="4" fill="#E2E8F0"/> 
            <rect x="360" y="210" width="30" height="8" rx="4" fill="#C084FC"/>
            <rect x="400" y="210" width="60" height="8" rx="4" fill="#38BDF8"/> 
            <rect x="220" y="240" width="60" height="8" rx="4" fill="#818CF8"/> 
            <rect x="290" y="240" width="100" height="8" rx="4" fill="#F472B6"/>
            <rect x="400" y="240" width="20" height="8" rx="4" fill="#E2E8F0"/>
            <rect x="250" y="270" width="50" height="8" rx="4" fill="#C084FC"/>
            <rect x="310" y="270" width="140" height="8" rx="4" fill="#E2E8F0"/>
          </g>

          {/* --- BADGES --- */}

          {/* JavaScript (New - Using Accent Color) */}
          <g transform="translate(110, 380)">
            <animateTransform attributeName="transform" type="translate" values="110,380; 110,370; 110,380" dur="4.5s" repeatCount="indefinite" />
            <rect width="90" height="30" rx="15" fill="var(--accent)" />
            <text x="45" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="var(--foreground)" textAnchor="middle">JavaScript</text>
          </g>

          {/* Optimization (New - Using Primary Color) */}
          <g transform="translate(580, 420)">
            <animateTransform attributeName="transform" type="translate" values="580,420; 590,420; 580,420" dur="6s" repeatCount="indefinite" />
            <rect width="100" height="30" rx="15" fill="var(--primary)" />
            <text x="50" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="var(--primary-foreground)" textAnchor="middle">Optimization</text>
          </g>

          {/* Testing (New - Using Foreground Color) */}
          <g transform="translate(60, 220)">
            <animateTransform attributeName="transform" type="translate" values="60,220; 70,230; 60,220" dur="5s" repeatCount="indefinite" />
            <rect width="80" height="30" rx="15" fill="var(--foreground)" />
            <text x="40" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="var(--background)" textAnchor="middle">Testing</text>
          </g>

          {/* Existing Badges (Unchanged colors) */}
          <g transform="translate(140, 440)">
            <animateTransform attributeName="transform" type="translate" values="140,440; 140,430; 140,440" dur="4s" repeatCount="indefinite" />
            <rect width="80" height="30" rx="15" fill="#D97706" />
            <text x="40" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">React</text>
          </g>

          <g transform="translate(580, 260)">
            <animateTransform attributeName="transform" type="translate" values="580,260; 580,270; 580,260" dur="5s" repeatCount="indefinite" />
            <rect width="90" height="32" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="2"/> 
            <text x="45" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Next.js</text>
          </g>

          <g transform="translate(500, 80)">
            <animateTransform attributeName="transform" type="translate" values="500,80; 500,70; 500,80" dur="6s" repeatCount="indefinite" />
            <rect width="100" height="30" rx="15" fill="#2563EB" /> 
            <text x="50" y="20" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Animation</text>
          </g>

        </svg>

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
      </div>
    </div>
  </div>
);