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
  // animateProps allows passing any standard SVG animate attributes
  animateProps?: React.SVGAttributes<SVGAnimateElement>;
}

// --- Sub-components for organization ---

/**
 * FloatingBadge: A decorative SVG group containing a rounded rectangle and text
 * that floats up and down using an animateTransform.
 */
const FloatingBadge: React.FC<FloatingBadgeProps> = ({ 
  x, y, label, bgColor, textColor = "white", width = 90, dur = "5s", animOffset = 10, stroke = "none" 
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values={`${x},${y}; ${x},${y - animOffset}; ${x},${y}`} 
      dur={dur} 
      repeatCount="indefinite" 
    />
    <rect 
      width={width} 
      height="32" 
      rx="16" 
      fill={bgColor} 
      stroke={stroke} 
      strokeWidth={stroke !== "none" ? 2 : 0} 
    />
    <text 
      x={width / 2} 
      y="21" 
      fontFamily="sans-serif" 
      fontSize="12" 
      fontWeight="bold" 
      fill={textColor} 
      textAnchor="middle"
    >
      {label}
    </text>
  </g>
);

/**
 * CodeLine: Represents a single "line of code" inside the mock IDE window.
 */
const CodeLine: React.FC<CodeLineProps> = ({ x, y, w, color }) => (
  <rect x={x} y={y} width={w} height="8" rx="4" fill={color} />
);

/**
 * DecorativeCircle: Background elements that can optionally include an <animate> tag.
 */
const DecorativeCircle: React.FC<DecorativeCircleProps> = ({ cx, cy, r, fill, opacity, animateProps }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity}>
    {animateProps && <animate {...animateProps} repeatCount="indefinite" />}
  </circle>
);

/**
 * BannerSvg: The main export containing the hero illustration.
 * Features:
 * 1. An animated background blob using CSS variables.
 * 2. A simulated macOS-style code editor window.
 * 3. Animated floating tech-stack badges.
 */
export const BannerSvg: React.FC = () => (
  <div className="relative mt-16 flex-1 md:mt-0 w-full min-w-0">
    <div className="relative mx-auto aspect-[4/3] w-full">
      
      {/* Decorative frame shadow/glow */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl" />
      
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <svg 
          viewBox="0 0 800 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="soft-shadow" x="100" y="100" width="600" height="500" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="25"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.11 0 0 0 0 0.16 0 0 0 0 0.23 0 0 0 0.4 0"/>
              <feBlend mode="normal" in="SourceGraphic" />
            </filter>
          </defs>

          {/* Main Animated Background Blob */}
          <circle 
            cx="450" cy="300" r="250" 
            style={{
              fill: 'var(--primary)',
              opacity: 'var(--blob-opacity)',
              transition: 'all 0.5s ease-in-out'
            } as React.CSSProperties}
          >
            <animate attributeName="cx" values="450;430;450" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;320;300" dur="9s" repeatCount="indefinite" />
          </circle>

          {/* Decorative Background Elements */}
          <DecorativeCircle cx="100" cy="120" r="12" fill="var(--accent)" opacity="0.4" animateProps={{ attributeName: "cy", values: "120;100;120", dur: "5s" }} />
          <DecorativeCircle cx="700" cy="480" r="20" fill="var(--primary)" opacity="0.2" animateProps={{ attributeName: "r", values: "20;25;20", dur: "4s" }} />
          <DecorativeCircle cx="150" cy="500" r="8" fill="var(--foreground)" opacity="0.3" animateProps={{ attributeName: "opacity", values: "0.3;0.7;0.3", dur: "3s" }} />
          <DecorativeCircle cx="720" cy="150" r="6" fill="var(--accent)" opacity="0.5" />

          {/* Main Mockup Code Window */}
          <g filter="url(#soft-shadow)">
            {/* Window Body */}
            <rect x="180" y="140" width="440" height="320" rx="16" fill="#1E293B"/> 
            {/* Title Bar */}
            <path d="M180 156C180 147.163 187.163 140 196 140H604C612.837 140 620 147.163 620 156V180H180V156Z" fill="#334155"/> 
            {/* Window Controls (Traffic Lights) */}
            <circle cx="210" cy="160" r="6" fill="#FF5F56"/><circle cx="230" cy="160" r="6" fill="#FFBD2E"/><circle cx="250" cy="160" r="6" fill="#27C93F"/>

            {/* Code Lines Mockup - Visual representation of code */}
            <CodeLine x="220" y="210" w="40" color="#C084FC" />
            <CodeLine x="270" y="210" w="80" color="#E2E8F0" />
            <CodeLine x="360" y="210" w="30" color="#C084FC" />
            <CodeLine x="400" y="210" w="60" color="#38BDF8" />
            <CodeLine x="220" y="240" w="60" color="#818CF8" />
            <CodeLine x="290" y="240" w="100" color="#F472B6" />
            <CodeLine x="400" y="240" w="20" color="#E2E8F0" />
            <CodeLine x="250" y="270" w="50" color="#C084FC" />
            <CodeLine x="310" y="270" w="140" color="#E2E8F0" />
          </g>

          {/* Floating Technology Badges */}
          <FloatingBadge x={110} y={380} label="JavaScript" bgColor="var(--accent)" textColor="var(--primary-foreground)" dur="4.5s" />
          <FloatingBadge x={580} y={420} label="Optimization" bgColor="var(--primary)" textColor="var(--primary-foreground)" width={100} dur="6s" />
          <FloatingBadge x={60} y={220} label="Testing" bgColor="var(--foreground)" textColor="var(--background)" width={80} dur="5s" />
          <FloatingBadge x={140} y={440} label="React" bgColor="#D97706" width={80} dur="4s" />
          <FloatingBadge x={580} y={260} label="Next.js" bgColor="#1E293B" stroke="#334155" dur="5s" />
          <FloatingBadge x={500} y={80} label="Animation" bgColor="#2563EB" width={100} dur="6s" />

        </svg>
        {/* Bottom Fade Gradient for better text legibility if placed over text */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
      </div>
    </div>
  </div>
);