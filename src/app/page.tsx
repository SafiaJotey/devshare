
"use client"; 

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-light/30 via-light/10 to-light dark:from-dark-bg/30 dark:via-dark-bg/10 dark:to-dark-bg"
        />
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-10 top-1/4 h-12 w-12 rounded-full bg-accent/10 blur-lg dark:bg-dark-accent/10"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute left-1/4 bottom-1/3 h-16 w-16 rounded-full bg-primary/10 blur-lg dark:bg-dark-primary/10"
        />
      </div>

      <div className="container relative mx-auto flex min-h-[90vh] flex-col items-center justify-center px-6 py-24 md:flex-row md:py-32">
        {/* Text content */}
        <div className="flex-1 space-y-8 text-center md:space-y-10 md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent dark:bg-dark-accent/10 dark:text-dark-accent"
          >
            <Sparkles className="h-4 w-4" />
            New Article Every Week
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold leading-tight tracking-tight text-secondary dark:text-dark-text sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Elevate Your{" "}
            <span className="relative whitespace-nowrap text-primary dark:text-dark-primary">
              <span className="relative inline-block">
                Knowledge
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
            With Our Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary/80 dark:text-dark-text/80 md:mx-0 md:text-xl"
          >
            Dive into expertly crafted articles that bridge the gap between 
            <span className="relative mx-1 inline-block font-medium text-accent dark:text-dark-accent">
              theory
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-accent/30 dark:bg-dark-accent/30" />
            </span> 
            and 
            <span className="relative mx-1 inline-block font-medium text-primary dark:text-dark-primary">
              practice
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary/30 dark:bg-dark-primary/30" />
            </span>
            . Transform how you think about modern technology and design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
          >
            <Button size="lg" className="group gap-2 shadow-lg hover:shadow-primary/20">
              Explore Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-secondary/30 dark:border-dark-text/30"
            >
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent dark:from-dark-accent dark:to-dark-primary">
                Meet The Authors
              </span>
            </Button>
            <ThemeToggle/>
          </motion.div>
        </div>

        {/* Image with fancy frame */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="relative mt-16 flex-1 md:mt-0"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            {/* Decorative frame */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl dark:from-dark-accent/10 dark:via-dark-primary/10 dark:to-secondary/10" />
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 dark:from-dark-accent/20 dark:via-dark-primary/20 dark:to-secondary/20" />
            
            {/* Main image */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/hero.png" 
                alt="Blog hero image"
                fill
                className="object-cover"
                priority
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent dark:from-dark-bg/40" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg dark:bg-gray-800">
              <div className="h-2 w-2 rounded-full bg-accent dark:bg-dark-accent" />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent dark:from-dark-accent dark:to-dark-primary">
                50+ Articles
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
