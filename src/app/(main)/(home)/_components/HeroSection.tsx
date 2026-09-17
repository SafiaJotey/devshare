import ButtonGroup from "@/components/ui/ButtonGroup";
import { Sparkles } from "lucide-react";
import { BannerSvg } from "./BannerSvg";

export default function HeroSection() {
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


        <div className="container relative mx-auto flex min-h-[60vh] max-w-9xl  flex-col-reverse items-center justify-center  md:flex-row md:gap-12  md:px-10 lg:py-8">
          {/* left-text */}
          <div className="flex-1 space-y-4 text-center md:space-y-10 md:text-left">
            <span className="flex items-center gap-2  text-lg font-medium text-accent dark:bg-dark-accent/20 dark:text-dark-accent">
              <Sparkles className="h-4 w-4" />
              New Article Every Week
            </span>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-secondary dark:text-dark-text sm:text-4xl  lg:text-5xl max-w-3xl">
              Elevate Your{" "}
              <span className="relative whitespace-nowrap text-primary dark:text-dark-primary">
                <span className="relative inline-block">
                  Development
                   
                
                </span>
              </span>{" "}
              Skills With Expert Insights
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary/80 dark:text-dark-text/80 md:mx-0 md:text-xl">
              Discover cutting-edge tutorials, industry trends, and practical guides that bridge the gap between{" "}
                 theory
              and{" "}
             
                practice
               
              
              . Transform your workflow today.
            </p>

            <ButtonGroup />

      
          </div>

        
        <BannerSvg/>
        </div>

        
      </section>
    </div>
  );
}