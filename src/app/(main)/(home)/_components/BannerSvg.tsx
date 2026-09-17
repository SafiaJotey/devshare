import React from 'react';

// --- Types & Interfaces ---

interface FloatingBadgeProps {
  x: number;
  y: number;
  label: string;
  bgColor: string;
  textColor?: string;
  width?: number;
  dur?: string;
  animOffset?: number;
  stroke?: string;
  dotColor?: string;
}

interface CodeLineProps {
  x: string | number;
  y: string | number;
  w: string | number;
  color: string;
}

interface DecorativeCircleProps {
  cx: string | number;
  cy: string | number;
  r: string | number;
  fill: string;
  opacity: string | number;
  animateProps?: React.SVGAttributes<SVGAnimateElement>;
}

// --- Sub-components ---

/**
 * FloatingBadge: Modern pill badge with floating animation,
 * border stroke, and an optional tech status dot.
 */
const FloatingBadge: React.FC<FloatingBadgeProps> = ({ 
  x, 
  y, 
  label, 
  bgColor, 
  textColor = "white", 
  width = 90, 
  dur = "5s", 
  animOffset = 10, 
  stroke = "none",
  dotColor
}) => (
  <g transform={`translate(${x}, ${y})`} filter="url(#badge-shadow)">
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values={`${x},${y}; ${x},${y - animOffset}; ${x},${y}`} 
      dur={dur} 
      repeatCount="indefinite" 
    />
    {/* Pill Body */}
    <rect 
      width={width} 
      height="34" 
      rx="17" 
      fill={bgColor} 
      stroke={stroke} 
      strokeWidth={stroke !== "none" ? 1.5 : 0} 
    />
    
 

    {/* Badge Text */}
    <text 
      x={dotColor ? (width / 2) + 6 : width / 2} 
      y="22" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="12.5" 
      fontWeight="600" 
      letterSpacing="0.2"
      fill={textColor} 
      textAnchor="middle"
    >
      {label}
    </text>
  </g>
);

const CodeLine: React.FC<CodeLineProps> = ({ x, y, w, color }) => (
  <rect x={x} y={y} width={w} height="8" rx="4" fill={color} />
);

const DecorativeCircle: React.FC<DecorativeCircleProps> = ({ cx, cy, r, fill, opacity, animateProps }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity}>
    {animateProps && <animate {...animateProps} repeatCount="indefinite" />}
  </circle>
);

export const BannerSvg: React.FC = () => (
  <div className="relative mt-16 flex-1 md:mt-0 w-full min-w-0">
    <div className="relative mx-auto aspect-[4/3] w-full">
      
      {/* Decorative frame glow */}
      <div className="absolute -inset-4 -z-10  blur-2xl opacity-0 bg-emerald-500/20" />
      
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <svg 
          viewBox="0 0 800 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Editor Drop Shadow */}
            <filter id="soft-shadow" x="120" y="90" width="560" height="440" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="22"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.04 0 0 0 0 0.11 0 0 0 0 0.08 0 0 0 0.45 0"/>
              <feBlend mode="normal" in="SourceGraphic" />
            </filter>

            {/* Badges Floating Shadow */}
            <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0A1C14" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Main Animated Background Blob (Themed) */}
          <circle 
            cx="450" cy="300" r="260" 
            style={{
              fill: 'var(--primary)',
              opacity: 'var(--blob-opacity)',
              transition: 'all 0.5s ease-in-out'
            } as React.CSSProperties}
          >
            <animate attributeName="cx" values="450;430;450" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;320;300" dur="9s" repeatCount="indefinite" />
          </circle>

          {/* Decorative Ambient Dots */}
          <DecorativeCircle cx="100" cy="110" r="10" fill="var(--accent)" opacity="0.3" animateProps={{ attributeName: "cy", values: "110;95;110", dur: "5s" }} />
          <DecorativeCircle cx="720" cy="470" r="18" fill="var(--primary)" opacity="0.2" animateProps={{ attributeName: "r", values: "18;22;18", dur: "4s" }} />
          <DecorativeCircle cx="130" cy="510" r="7" fill="var(--foreground)" opacity="0.25" animateProps={{ attributeName: "opacity", values: "0.25;0.6;0.25", dur: "3s" }} />
          <DecorativeCircle cx="720" cy="130" r="6" fill="var(--accent)" opacity="0.45" />

          {/* Code Window */}
          <g filter="url(#soft-shadow)">
            {/* Window Container */}
            <rect x="180" y="140" width="440" height="320" rx="16" fill="#0D1F17" stroke="#16382A" strokeWidth="1.5" /> 
            {/* Window Header */}
            <path d="M180 156C180 147.163 187.163 140 196 140H604C612.837 140 620 147.163 620 156V178H180V156Z" fill="#132B20"/> 
            {/* macOS Window Controls */}
            <circle cx="210" cy="159" r="5" fill="#EF4444" opacity="0.85" />
            <circle cx="228" cy="159" r="5" fill="#F59E0B" opacity="0.85" />
            <circle cx="246" cy="159" r="5" fill="#10B981" opacity="0.85" />

            {/* Code Lines Mockup */}
            <CodeLine x="220" y="205" w="45" color="#34D399" />
            <CodeLine x="275" y="205" w="85" color="#E6F4ED" />
            <CodeLine x="370" y="205" w="30" color="#6EE7B7" />
            <CodeLine x="410" y="205" w="65" color="#38BDF8" />
            
            <CodeLine x="220" y="235" w="70" color="#A78BFA" />
            <CodeLine x="300" y="235" w="95" color="#E6F4ED" />
            <CodeLine x="405" y="235" w="35" color="#34D399" />

            <CodeLine x="250" y="265" w="55" color="#38BDF8" />
            <CodeLine x="315" y="265" w="130" color="#94A3B8" />

            <CodeLine x="250" y="295" w="80" color="#34D399" />
            <CodeLine x="340" y="295" w="50" color="#E6F4ED" />
          </g>

          {/* ========================================================
              FLOATING BADGES
              Positioned symmetrically around perimeter & edges
             ======================================================== */}

          {/* 1. AI — Emerald pill with glow accent */}
          <FloatingBadge 
            x={480} 
            y={82} 
            label="AI" 
            width={68} 
            bgColor="#064E3B" 
            stroke="#34D399" 
            textColor="#A7F3D0" 
          
            dur="4.5s" 
            animOffset={9}
          />

          {/* 2. Next.js — Sleek obsidian dark pill */}
          <FloatingBadge 
            x={95} 
            y={105} 
            label="Next.js" 
            width={94} 
            bgColor="#0A1C14" 
            stroke="#10B981" 
            textColor="#E6F4ED" 
         
            dur="5.8s" 
            animOffset={12}
          />

          {/* 3. TypeScript — Dark slate teal */}
          <FloatingBadge 
            x={45} 
            y={235} 
            label="TypeScript" 
            width={112} 
            bgColor="#0B2B28" 
            stroke="#2DD4BF" 
            textColor="#99F6E4" 
       
            dur="5.0s" 
            animOffset={10}
          />

          {/* 4. React — Deep cyan-emerald */}
          <FloatingBadge 
            x={80} 
            y={375} 
            label="React" 
            width={88} 
            bgColor="#083344" 
            stroke="#38BDF8" 
            textColor="#BAE6FD" 
  
            dur="4.4s" 
            animOffset={8}
          />

          {/* 5. GraphQL — Muted plum accent (pairs with green palette) */}
          <FloatingBadge 
            x={150} 
            y={485} 
            label="GraphQL" 
            width={98} 
            bgColor="#231224" 
            stroke="#E879F9" 
            textColor="#F5D0FE" 
        
            dur="4.8s" 
            animOffset={7}
          />

          {/* 6. Redux — Subtle royal violet (complementary contrast to forest green) */}
          <FloatingBadge 
            x={625} 
            y={130} 
            label="Redux" 
            width={88} 
            bgColor="#1E1435" 
            stroke="#A78BFA" 
            textColor="#DDD6FE" 
      
            dur="5.2s" 
            animOffset={10}
          />

          {/* 7. Tailwind CSS — Deep sea teal */}
          <FloatingBadge 
            x={635} 
            y={265} 
            label="Tailwind CSS" 
            width={122} 
            bgColor="#082F38" 
            stroke="#22D3EE" 
            textColor="#CFFAFE" 
        
            dur="4.6s" 
            animOffset={11}
          />

          {/* 8. MCP Server — Forest green highlight */}
          <FloatingBadge 
            x={570} 
            y={405} 
            label="MCP Server" 
            width={120} 
            bgColor="#092E1F" 
            stroke="#10B981" 
            textColor="#A7F3D0" 
         
            dur="6.2s" 
            animOffset={12}
          />

          {/* 9. Optimization — Clean Primary-Foreground variant */}
          <FloatingBadge 
            x={410} 
            y={495} 
            label="Optimization" 
            width={118} 
            bgColor="#0F5132" 
            stroke="#6EE7B7" 
            textColor="#FFFFFF" 
     
            dur="5.4s" 
            animOffset={9}
          />

        </svg>

        {/* Bottom Fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  </div>
);