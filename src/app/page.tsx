import ButtonGroup from "@/components/ui/ButtonGroup";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-light/20 via-transparent to-light/10 dark:from-dark-bg/30 dark:via-dark-bg/10 dark:to-dark-bg/20" />
          
          {/* Floating blobs */}
          <div className="absolute right-10 top-1/4 h-32 w-32 rounded-full bg-accent/10 blur-3xl dark:bg-dark-accent/10" />
          <div className="absolute left-1/4 bottom-1/3 h-40 w-40 rounded-full bg-primary/10 blur-3xl dark:bg-dark-primary/10" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        </div>

        {/* Added max-w-7xl to the main container to allow more horizontal spread */}
        <div className="container relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-24 md:flex-row md:gap-12 md:py-22 lg:px-8">
          
          {/* Text content - Adjusted to flex-1 to split space evenly */}
          <div className="flex-1 space-y-8 text-center md:space-y-10 md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent dark:bg-dark-accent/20 dark:text-dark-accent">
              <Sparkles className="h-4 w-4" />
              New Article Every Week
            </span>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-secondary dark:text-dark-text sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              Elevate Your{" "}
              <span className="relative whitespace-nowrap text-primary dark:text-dark-primary">
                <span className="relative inline-block">
                  Development
                  <svg
                    className="absolute -bottom-3 left-0 h-4 w-full text-accent dark:text-dark-accent"
                    viewBox="0 0 200 20"
                  >
                    <path
                      d="M0 12 Q 50 22, 100 12 T 200 12"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>{" "}
              Skills With Expert Insights
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary/80 dark:text-dark-text/80 md:mx-0 md:text-xl">
              Discover cutting-edge tutorials, industry trends, and practical guides that bridge the gap between{" "}
              <span className="relative mx-1 inline-block font-medium text-accent dark:text-dark-accent">
                theory
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-accent/30 dark:bg-dark-accent/30" />
              </span>{" "}
              and{" "}
              <span className="relative mx-1 inline-block font-medium text-primary dark:text-dark-primary">
                practice
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary/30 dark:bg-dark-primary/30" />
              </span>
              . Transform your workflow today.
            </p>

            <ButtonGroup />

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-secondary/60 dark:text-dark-text/60 md:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 dark:border-gray-800 dark:bg-gray-700" />
                  ))}
                </div>
                <span>Join 10k+ Developers</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span>5.0 Rating</span>
              </div>
            </div>
          </div>

          {/* Image with fancy frame - MASSIVELY INCREASED WIDTH HERE */}
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
                    <filter id="soft-shadow" x="100" y="100" width="600" height="500" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="20" dx="0"/>
                      <feGaussianBlur stdDeviation="25"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.11 0 0 0 0 0.16 0 0 0 0 0.23 0 0 0 0.4 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                    <radialGradient id="glow-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 300) rotate(90) scale(350)">
                      <stop stop-color="#818CF8" stop-opacity="0.3"/> 
                      <stop offset="1" stop-color="#818CF8" stop-opacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Animated Background Blob */}
                  <circle cx="450" cy="300" r="250" fill="url(#glow-gradient)">
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
                    <text x="40" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">React</text>
                  </g>

                  {/* Floating Badge: Next.js */}
                  <g transform="translate(580, 260)">
                    <animateTransform attributeName="transform" type="translate" values="580,260; 580,270; 580,260" dur="5s" repeatCount="indefinite" />
                    <rect width="90" height="32" rx="16" fill="#1E293B" stroke="#334155" stroke-width="2"/> 
                    <text x="45" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">Next.js</text>
                  </g>

                  {/* Floating Badge: Animation */}
                  <g transform="translate(500, 100)">
                    <animateTransform attributeName="transform" type="translate" values="500,100; 500,90; 500,100" dur="6s" repeatCount="indefinite" />
                    <rect width="100" height="30" rx="15" fill="#2563EB" /> 
                    <text x="50" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">Animation</text>
                  </g>

                  {/* Decorative Circle */}
                  <circle cx="150" cy="180" r="6" fill="#6366F1" fill-opacity="0.6">
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
        </div>

        {/* Scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="h-6 w-4 rounded-full bg-primary dark:bg-dark-primary" />
            <span className="mt-2 text-xs text-secondary/60 dark:text-dark-text/60">Scroll Down</span>
          </div>
        </div>
      </section>
    </div>
  );
}