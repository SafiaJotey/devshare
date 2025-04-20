
"use client"; 

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { div } from "framer-motion/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {

  
// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Mastering Next.js 15: Advanced Techniques",
    description: "Explore the latest features and optimization strategies for Next.js 15 applications.",
    category: "Technology",
    date: "May 15, 2024",
    readTime: "8 min read",
    image: "/images/tech.png"
  },
  {
    id: 2,
    title: "The Art of UI Animation with Framer Motion",
    description: "Learn how to create smooth, engaging animations that enhance user experience.",
    category: "Design",
    date: "June 2, 2024",
    readTime: "12 min read",
    image: "/images/tech.png"
  },
  {
    id: 3,
    title: "Building Scalable CSS with Tailwind",
    description: "Strategies for maintaining large-scale CSS architectures using Tailwind.",
    category: "Development",
    date: "June 10, 2024",
    readTime: "6 min read",
    image: "/images/tech.png"
  },
  {
    id: 4,
    title: "Modern Authentication Patterns",
    description: "Implementing secure auth with NextAuth.js and OAuth providers.",
    category: "Security",
    date: "June 18, 2024",
    readTime: "10 min read",
    image: "/images/tech.png"
  },
  {
    id: 5,
    title: "Optimizing React Performance",
    description: "Advanced techniques to make your React applications blazing fast.",
    category: "Performance",
    date: "June 25, 2024",
    readTime: "14 min read",
    image: "/images/tech.png"
  },
  {
    id: 6,
    title: "The Future of Web Development",
    description: "Emerging trends and technologies shaping the web of tomorrow.",
    category: "Technology",
    date: "July 3, 2024",
    readTime: "9 min read",
    image: "/images/tech.png"
  }
];

const categories = [
  { id: "technology", label: "Technology" },
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "security", label: "Security" },
  { id: "performance", label: "Performance" }
];


  return (
<div>
    <section className="relative overflow-hidden ">
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

{/* Main Content Area */}
<div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 space-y-6">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-background"
              />
            </motion.div>

            {/* Categories Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-secondary dark:text-dark-text">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox id={category.id} />
                    <Label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-secondary dark:text-dark-text">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #NextJS
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #React
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #Tailwind
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #Animation
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #UI/UX
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  #Performance
                </Badge>
              </div>
            </motion.div>
          </aside>

          {/* Blog Posts Grid */}
          <div className="lg:w-3/4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-8 text-secondary dark:text-dark-text"
            >
              Latest Articles
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-secondary/20 dark:border-dark-text/20 pt-0">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {post.category}
                      </Badge>
                      <CardTitle className="text-secondary dark:text-dark-text">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-secondary/80 dark:text-dark-text/80">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-secondary/60 dark:text-dark-text/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="group gap-1">
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <Button variant="outline" size="lg" className="px-8">
                Load More Articles
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
