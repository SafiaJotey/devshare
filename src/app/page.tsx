


import ButtonGroup from "@/components/ui/ButtonGroup";
import { Sparkles } from "lucide-react";
import Image from "next/image";



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
          <div
            
            className="absolute right-10 top-1/4 h-32 w-32 rounded-full bg-accent/10 blur-3xl dark:bg-dark-accent/10"
          />
          <div
          
            className="absolute left-1/4 bottom-1/3 h-40 w-40 rounded-full bg-primary/10 blur-3xl dark:bg-dark-primary/10"
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        </div>

        <div className="container relative mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-24 md:flex-row md:py-22 lg:px-8">
          {/* Text content */}
          <div className="flex-1 space-y-8 text-center md:space-y-10 md:text-left">
            <span 
             
              className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent dark:bg-dark-accent/20 dark:text-dark-accent"
            >
              <Sparkles className="h-4 w-4" />
              New Article Every Week
            </span>

            <h1 
            
              className="text-4xl font-bold leading-tight tracking-tight text-secondary dark:text-dark-text sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl"
            >
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

            <p
              
              className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary/80 dark:text-dark-text/80 md:mx-0 md:text-xl"
            >
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

         <ButtonGroup/>

            {/* Trust indicators */}
            <div
            
              className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-secondary/60 dark:text-dark-text/60 md:justify-start"
            >
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
                  key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400"
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

          {/* Image with fancy frame */}
          <div 
          
            className="relative mt-16 flex-1 md:mt-0 w-full max-w-xl"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
              {/* Decorative frame */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl dark:from-dark-accent/10 dark:via-dark-primary/10 dark:to-secondary/10" />
              <div className="" />
              
              {/* Main image */}
              <div className="relative h-full w-full overflow-hidden ">
                <Image
                  src="/images/hero.png" 
                  alt="Developer working on code"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent dark:from-dark-bg/40" />
              </div>
              
              {/* Floating badges with more refined animations */}
              {[
                { 
                  text: "JavaScript", 
                  position: "top-4 left-4", 
                  animation: { 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.8, 1.05, 1.05, 0.8],
                    y: [10, -5, -5, 10]
                  },
                  delay: 1.2,
                  duration: 8,
                  bg: "bg-white/90 dark:bg-gray-800 text-black dark:text-white"
                },
                { 
                  text: "Next.js", 
                  position: "top-1/3 -right-4", 
                  animation: { 
                    opacity: [0, 1, 1, 0], 
                    x: [10, -5, -5, 10]
                  },
                  delay: 1.6,
                  duration: 7,
                  bg: "bg-primary text-white"
                },
                { 
                  text: "React", 
                  position: "bottom-1/4 -left-4", 
                  animation: { 
                    opacity: [0, 1, 1, 0], 
                    y: [10, -5, -5, 10],
                    rotate: [0, 5, -5, 0]
                  },
                  delay: 2,
                  duration: 9,
                  bg: "bg-accent text-white"
                },
                { 
                  text: "Tailwind", 
                  position: "bottom-8 right-8", 
                  animation: { 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.9, 1.1, 1.1, 0.9]
                  },
                  delay: 2.4,
                  duration: 6,
                  bg: "bg-white/90 dark:bg-gray-800 text-black dark:text-white"
                },
                { 
                  text: "Animation", 
                  position: "top-8 right-1/4", 
                  animation: { 
                    opacity: [0, 1, 1, 0], 
                    y: [-10, 5, 5, -10]
                  },
                  delay: 1.8,
                  duration: 7.5,
                  bg: "bg-primary text-white"
                }
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`absolute ${badge.position} rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badge.bg}`}
                  
                >
                  {badge.text}
                </div>
              ))}

              {/* Article count badge */}
              <div
              
      
                className="absolute -bottom-6 -right-6 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg dark:bg-gray-800"
              >
                <div className="h-2 w-2 rounded-full bg-accent dark:bg-dark-accent" />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent dark:from-dark-accent dark:to-dark-primary">
                  50+ Articles
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <div
       
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <div
            
              className="h-6 w-4 rounded-full bg-primary dark:bg-dark-primary"
            />
            <span className="mt-2 text-xs text-secondary/60 dark:text-dark-text/60">Scroll Down</span>
          </div>
        </div>
      </section>






    </div>
  );
}
