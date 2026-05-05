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
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent dark:bg-dark-accent/20 dark:text-dark-accent">
              <Sparkles className="h-4 w-4" />
              New Article Every Week
            </span>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-secondary dark:text-dark-text sm:text-4xl  lg:text-5xl max-w-3xl">
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
        <BannerSvg/>
        </div>

        {/* Scrolling indicator */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="h-6 w-4 rounded-full bg-primary dark:bg-dark-primary" />
            <span className="mt-2 text-xs text-secondary/60 dark:text-dark-text/60">Scroll Down</span>
          </div>
        </div> */}
      </section>
    </div>
  );
}