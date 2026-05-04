import React, { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

// --- Types ---

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  center?: boolean;
  linkText?: string;
  linkHref?: string;
}

interface SectionProps extends SectionHeaderProps {
  children: ReactNode;
  headerComponent?: ReactNode;
  bgColor?: string;
  noPaddingX?: boolean;
  centerHeader?: boolean;
  className?: string;
}

// --- Components ---

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  tag, 
  center, 
  linkText, 
  linkHref 
}) => {
  if (!title && !subtitle && !tag) return null;

  return (
    <div className={`flex flex-col md:flex-row md:items-center gap-6 mb-12 ${
      center ? 'items-center text-center' : 'items-end justify-between text-left'
    }`}>
      <div className={`flex-1 ${center ? 'max-w-3xl' : 'max-w-5xl'}`}>
        {tag && (
          <span className="text-accent font-mono text-xs md:text-sm font-bold tracking-widest uppercase block mb-3">
            {tag}
          </span>
        )}
        
        {title && (
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {title}
          </h2>
        )}
        
         {subtitle && (
          /* Added line-clamp-2 to handle the 2-line limit and ellipsis */
          <p className={`mt-4 text-lg text-muted-foreground leading-relaxed line-clamp-2 ${center ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>

      {(linkText || linkHref) && (
        <a 
          href={linkHref || "#"} 
          className={`flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 group whitespace-nowrap ${
            center ? 'mt-4' : 'mb-2'
          }`}
        >
          {linkText || "View all"} 
          <ArrowUpRight size={20} className="group-hover:-translate-y-1 transition-transform" />
        </a>
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
  bgColor = "bg-transparent", 
  noPaddingX = false, 
  centerHeader = false,
  className = "" 
}) => {
  return (
    <section className={`${bgColor} py-16 md:py-28 overflow-hidden ${className}`}>
      <div className={`mx-auto ${noPaddingX ? 'w-full' : 'container px-6 lg:px-8'}`}>
        
        {/* Render custom header if provided, otherwise default header */}
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