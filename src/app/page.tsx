"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

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
,
    {
      id: 7,
      title: "Mastering Next.js 15: Advanced Techniques",
      description: "Explore the latest features and optimization strategies for Next.js 15 applications.",
      category: "Technology",
      date: "May 15, 2024",
      readTime: "8 min read",
      image: "/images/tech.png"
    },
    {
      id: 8,
      title: "The Art of UI Animation with Framer Motion",
      description: "Learn how to create smooth, engaging animations that enhance user experience.",
      category: "Design",
      date: "June 2, 2024",
      readTime: "12 min read",
      image: "/images/tech.png"
    },
    {
      id: 9,
      title: "Building Scalable CSS with Tailwind",
      description: "Strategies for maintaining large-scale CSS architectures using Tailwind.",
      category: "Development",
      date: "June 10, 2024",
      readTime: "6 min read",
      image: "/images/tech.png"
    },
    {
      id: 10,
      title: "Modern Authentication Patterns",
      description: "Implementing secure auth with NextAuth.js and OAuth providers.",
      category: "Security",
      date: "June 18, 2024",
      readTime: "10 min read",
      image: "/images/tech.png"
    },
    {
      id: 11,
      title: "Optimizing React Performance",
      description: "Advanced techniques to make your React applications blazing fast.",
      category: "Performance",
      date: "June 25, 2024",
      readTime: "14 min read",
      image: "/images/tech.png"
    },
    {
      id: 12,
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
  const [visiblePosts, setVisiblePosts] = useState(6);
 
 const loadMorePosts = () => {
  setVisiblePosts(prev => prev + 6);
};
const displayedPosts = blogPosts.slice(0, visiblePosts);


const hasMorePosts = visiblePosts < blogPosts.length;
  

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-light/20 via-transparent to-light/10 dark:from-dark-bg/30 dark:via-dark-bg/10 dark:to-dark-bg/20" />
          
          {/* Floating blobs */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-10 top-1/4 h-32 w-32 rounded-full bg-accent/10 blur-3xl dark:bg-dark-accent/10"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
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
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent dark:bg-dark-accent/20 dark:text-dark-accent"
            >
              <Sparkles className="h-4 w-4" />
              New Article Every Week
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
            >
              <Button 
                size="lg" 
                className="group gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary/30 dark:border-dark-text/30 group transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="bg-gradient-to-r from-accent to-primary dark:from-dark-accent dark:to-dark-primary bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent">
                  Meet The Authors
                </span>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
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
                    <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>5.0 Rating</span>
              </div>
            </motion.div>
          </div>

          {/* Image with fancy frame */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="relative mt-16 flex-1 md:mt-0 w-full max-w-xl"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
              {/* Decorative frame */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10 opacity-70 blur-xl dark:from-dark-accent/10 dark:via-dark-primary/10 dark:to-secondary/10" />
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 dark:from-dark-accent/20 dark:via-dark-primary/20 dark:to-secondary/20" />
              
              {/* Main image */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
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
                <motion.div
                  key={idx}
                  className={`absolute ${badge.position} rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badge.bg}`}
                  initial={{ opacity: 0 }}
                  animate={badge.animation}
                  transition={{
                    delay: badge.delay,
                    duration: badge.duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {badge.text}
                </motion.div>
              ))}

              {/* Article count badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute -bottom-6 -right-6 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg dark:bg-gray-800"
              >
                <div className="h-2 w-2 rounded-full bg-accent dark:bg-dark-accent" />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent dark:from-dark-accent dark:to-dark-primary">
                  50+ Articles
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-6 w-4 rounded-full bg-primary dark:bg-dark-primary"
            />
            <span className="mt-2 text-xs text-secondary/60 dark:text-dark-text/60">Scroll Down</span>
          </div>
        </motion.div>
      </section>





      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-22 sm:px-6 lg:px-8 ">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex flex-col lg:flex-row gap-8"
  >
    {/* Sidebar Filters - Sticky on large screens */}
    <aside className="  lg:w-1/4 space-y-6 lg:sticky lg:top-36 self-start h-fit">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
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
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-secondary dark:text-dark-text">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={category.id} />
              <Label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-secondary dark:text-dark-text">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {["NextJS", "React", "Tailwind", "Animation", "UI/UX", "Performance", "TypeScript", "Framer"].map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="cursor-pointer hover:bg-accent/20 transition-colors duration-200"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </motion.div>
    </aside>

    {/* Blog Posts Grid */}
    <div className="lg:w-3/4">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-8 text-secondary dark:text-dark-text"
      >
        Latest Articles
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ delay: index * 0.1 }}
                >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-secondary/20 dark:border-dark-text/20 group">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  {post.category}{post.id}
                </Badge>
                <CardTitle className="text-secondary dark:text-dark-text group-hover:text-primary dark:group-hover:text-dark-primary transition-colors duration-300">
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
                <Button 
                  variant="outline" 
                  className="group-hover:bg-primary group-hover:text-white transition-colors duration-300 gap-1"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMorePosts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-12 text-center"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 group hover:bg-primary hover:text-white transition-colors duration-300"
                  onClick={loadMorePosts}
                >
                  Load More Articles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            )}
    </div>
  </motion.div>
</div>


    </div>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}