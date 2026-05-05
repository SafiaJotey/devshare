import React, { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// --- Types ---

interface SectionHeaderProps {
  title?: React.ReactNode; // Changed from string to ReactNode to allow spans
  subtitle?: string;
  tag?: string;
  center?: boolean;
  linkText?: string;
  linkHref?: string;
  variant?: 'default' | 'colorful'; // Added variant prop
}

interface SectionProps extends SectionHeaderProps {
  children: ReactNode;
  headerComponent?: ReactNode;
  bgColor?: string;
  noPaddingX?: boolean;
  centerHeader?: boolean;
  paddingTop?: boolean;
  paddingBottom?: boolean;
  className?: string;
}

// --- Components ---

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  tag, 
  center, 
  linkText, 
  linkHref,
  variant = 'default' 
}) => {
  if (!title && !subtitle && !tag) return null;

  // Use the specific layout for the colorful variant, otherwise default
  const isColorful = variant === 'colorful';

  return (
    <div className={`flex flex-col md:flex-row gap-6 mb-12 ${
      center ? 'items-center justify-center text-center' : isColorful ? 'items-end justify-between text-left' : 'items-end justify-between text-left'
    }`}>
      <div className={`flex-1 ${center ? 'max-w-3xl' : 'max-w-xl'}`}>
        {tag && (
          <span className={`font-bold tracking-[0.3em] uppercase text-xs block mb-3 ${isColorful ? 'text-accent' : 'text-accent font-mono tracking-widest'}`}>
            {tag}
          </span>
        )}
        
        {title && (
          <h2 className={`${isColorful ? 'text-3xl md:text-5xl font-bold leading-tight' : 'text-3xl md:text-5xl font-extrabold tracking-tight leading-tight'} text-foreground`}>
            {title}
          </h2>
        )}
        
         {subtitle && (
          <p className={`mt-4 text-lg text-muted-foreground leading-relaxed line-clamp-2 ${center ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>

      {(linkText || linkHref) && (
        <Link 
          href={linkHref || "#"} 
          className={`flex items-center gap-2 font-bold transition-all duration-300 group whitespace-nowrap pb-2 ${
            isColorful ? 'text-sm hover:text-primary' : 'text-primary hover:gap-3'
          } ${center ? 'mt-4' : ''}`}
        >
          {linkText || "View all"} 
          {isColorful ? (
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          ) : (
            <ArrowUpRight size={20} className="group-hover:-translate-y-1 transition-transform" />
          )}
        </Link>
      )}
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ 
  children, 
  title, 
  subtitle, 
  tag,
  linkText,
  linkHref,
  headerComponent, 
  variant = 'default',
  bgColor = "bg-transparent", 
  noPaddingX = false, 
  centerHeader = false,
  paddingTop=false,
  paddingBottom=false,
  className = "" 
}) => {
  return (
    <section className={`${bgColor} ${paddingTop?"pt-16 md:pt-28":''} ${paddingBottom?"pb-16 md:pb-28":''} overflow-hidden ${className}`}>
      <div className={`mx-auto ${noPaddingX ? 'w-full' : 'container px-6 lg:px-8'}`}>
        
        {headerComponent ? (
          <div className="mb-10">{headerComponent}</div>
        ) : (
          <SectionHeader 
            title={title} 
            subtitle={subtitle} 
            tag={tag} 
            center={centerHeader}
            linkText={linkText}
            linkHref={linkHref}
            variant={variant}
          />
        )}

        <div className="section-content">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;