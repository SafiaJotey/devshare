"use client";

import { useState } from "react";
import Card, { Post } from "@/components/shared/Card";
import Section from "@/components/shared/Section";
import { Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. Demo Data
const DEMO_POSTS: Post[] = [
  {
    id: 1,
    title: "Deep Dive: How React 19's Actions Will Simplify Form Handling",
    author: "Arjun Sharma",
    tag: "Frontend",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
    avatar: "https://i.pravatar.cc/150?u=arjun",
  },
  {
    id: 2,
    title: "Building Scalable Microservices with Go and gRPC",
    author: "Sarah Chen",
    tag: "Backend",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2026",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 3,
    title: "Why Rust is Becoming the Favorite Language for DevOps Tools",
    author: "Marcus V. ",
    tag: "DevOps",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc549482b8?q=80&w=2070",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: 4,
    title: "Implementing Vector Search in PostgreSQL for AI Apps",
    author: "Elena Rodriguez",
    tag: "AI & Data",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    id: 5,
    title: "Mastering CSS Grid: Building Complex Layouts with Ease",
    author: "James Wilson",
    tag: "Frontend",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070",
    avatar: "https://i.pravatar.cc/150?u=james",
  },
  {
    id: 6,
    title: "Secure by Design: OWASP Top 10 for 2024",
    author: "Sophia Lee",
    tag: "Security",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    avatar: "https://i.pravatar.cc/150?u=sophia",
  },
  // Add more items here for pagination test
];

const CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "AI & Data", "Security"];

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Filter logic
  const filteredPosts = activeCategory === "All" 
    ? DEMO_POSTS 
    : DEMO_POSTS.filter(post => post.tag === activeCategory);

  const currentPosts = filteredPosts.slice(0, visibleCount);

  // Fake "Load More" logic
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoading(false);
    }, 800);
  };

  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. FEATURED HERO SECTION */}
      <section className="pt-32 pb-16 bg-foreground text-background">
        <div className="container-box">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={DEMO_POSTS[0].image} 
                alt="Featured" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-6">
              <span className="text-accent font-bold tracking-widest text-xs uppercase italic">Featured Insight</span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {DEMO_POSTS[0].title}
              </h1>
              <p className="text-background/70 text-lg leading-relaxed max-w-xl">
                The landscape of {DEMO_POSTS[0].tag} is shifting. We explore how these changes impact high-scale production environments.
              </p>
              <div className="flex items-center gap-4 group cursor-pointer w-fit">
                <div className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                  <ArrowRight size={20} className="group-hover:text-foreground" />
                </div>
                <span className="font-bold">Read the Deep Dive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH BAR (Sticky) */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/5 py-6">
        <div className="container-box flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {setActiveCategory(cat); setVisibleCount(6);}}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? "bg-primary text-white" 
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
            <input 
              type="text" 
              placeholder="Search engineering..." 
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-foreground/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. BLOG GRID */}
      <Section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {currentPosts.map((post) => (
             <Link key={post.id} href={`/blogs/${post.id}`}> 
            <Card key={post.id} post={post} />
            </Link>
          ))}
        </div>

        {/* 4. CREATIVE PAGINATION / LOAD MORE */}
        {visibleCount < filteredPosts.length && (
          <div className="mt-24 text-center">
            <div className="relative inline-block">
               {/* Decorative Circle */}
              <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
              
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="relative bg-background border-2 border-foreground px-12 py-4 rounded-full font-bold hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Syncing Knowledge...
                  </div>
                ) : (
                  "Load More Insights"
                )}
              </button>
            </div>
            <p className="mt-6 text-xs text-foreground/40 font-mono">
              Showing {currentPosts.length} of {filteredPosts.length} articles
            </p>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-foreground/20" size={32} />
            </div>
            <h3 className="text-xl font-bold">No articles found in this domain.</h3>
            <p className="text-foreground/50">Try broadening your search or choosing another category.</p>
          </div>
        )}
      </Section>
    </main>
  );
}