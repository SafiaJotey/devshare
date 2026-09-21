"use client";

import { useState } from "react";
import Card, { Post } from "@/components/shared/Card";
import { Search, Terminal, Layers, ChevronRight, BellRing, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
];

const CATEGORIES = [
  { name: "All", count: 42 },
  { name: "Frontend", count: 12 },
  { name: "Backend", count: 15 },
  { name: "DevOps", count: 5 },
  { name: "AI & Data", count: 8 },
  { name: "Security", count: 2 },
];

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = DEMO_POSTS.filter((post) =>
    (activeCategory === "All" || post.tag === activeCategory) &&
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const SubscriptionWidget = ({ isMobile = false }) => (
    <div className={`p-6 rounded-3xl bg-foreground text-background relative overflow-hidden group ${isMobile ? "mt-20" : "mt-16"}`}>
      <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
        <BellRing size={120} />
      </div>
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Updates Pipeline
      </h4>
      <p className="text-[11px] opacity-50 mb-6 leading-relaxed">Join 5,000+ engineers receiving our weekly technical logic.</p>
      <div className="space-y-2">
        <input placeholder="engineer@dev.com" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-accent/50 placeholder:text-white/20" />
        <button className="w-full bg-accent text-foreground py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors">Connect</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">

      <section className="pt-22 pb-20 border-b border-foreground/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none" />
        <div className="container-box relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full mb-6">
                <Zap size={14} className="fill-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Knowledge Base v2.0</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8 uppercase">
                Engineering <br />
                <span className="text-primary italic font-serif lowercase">Insights &</span> Wisdom
              </h1>
              <p className="text-lg text-foreground/60 max-w-xl leading-relaxed">
                A curated collection of technical deep-dives, architectural patterns, and real-world engineering experiences.
              </p>
            </div>
            <div className="lg:col-span-6 relative">
              <Link href={`/blogs/${DEMO_POSTS[0].id}`} className="group block">
                <div className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <Image src={DEMO_POSTS[0].image} alt="Featured" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 text-background">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-4 block">Lead Article</span>
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">{DEMO_POSTS[0].title}</h2>
                    <div className="flex items-center gap-4 text-xs font-mono opacity-60">
                      <span>{DEMO_POSTS[0].author}</span>
                      <span>/</span>
                      <span>{DEMO_POSTS[0].readTime} READ</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <div className="bg-foreground text-background py-3 overflow-hidden border-y border-white/10 select-none">
        <div className="flex animate-marquee whitespace-nowrap gap-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-20 items-center font-mono text-[10px] uppercase tracking-[0.4em]">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> System Online</span>
              <span>Next.js Primitives</span>
              <span className="text-accent">●</span>
              <span>Distributed Logic</span>
              <span className="text-accent">●</span>
              <span>Scalable UI Patterns</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-box py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
        
          <div className="lg:hidden space-y-6">
            <div className="group">
              <input 
                type="text" 
                placeholder="Search topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            
       
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.name 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-foreground/5 text-foreground/60"
                  }`}
                >
                  {cat.name} <span className="opacity-40 ml-1">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-3 space-y-10">
            <div className="sticky top-32">
              <div className="mb-10 group">
                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-3 px-1">
                  <Search size={12} /> Search Explorer
                </div>
                <input 
                  type="text" 
                  placeholder="Find a topic..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-foreground/20"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-4 px-1">
                  <Layers size={12} /> Library Catalog
                </div>
                <nav className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        activeCategory === cat.name 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-4 rounded-full transition-all ${activeCategory === cat.name ? "bg-accent scale-y-100" : "bg-transparent scale-y-0"}`} />
                        <span className={`font-bold ${activeCategory === cat.name ? "translate-x-0" : "-translate-x-2 group-hover:translate-x-0 transition-transform"}`}>
                           {cat.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${activeCategory === cat.name ? "bg-white/20 text-white" : "bg-foreground/5 text-foreground/40"}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <SubscriptionWidget />
            </div>
          </aside>


          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-8 lg:mb-12 pb-6 border-b border-foreground/5">
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">
                  <Terminal size={14} className="text-primary" />
                  <span className="hidden sm:inline hover:text-foreground cursor-pointer transition-colors">Root</span>
                  <ChevronRight size={10} className="hidden sm:inline" />
                  <span className="text-foreground underline underline-offset-4 decoration-accent/50">{activeCategory}</span>
                </div>
                <div className="text-[10px] font-mono font-bold text-foreground/20 uppercase">
                  RESULTS: {filteredPosts.length}
                </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {filteredPosts.map((post, i) => (
                  <div key={post.id} className="relative group">
                    <div className="absolute -top-4 -left-4 text-[9px] font-mono text-foreground/10 group-hover:text-primary transition-colors hidden xl:block">
                      {`00${i+1}`}
                    </div>
                    <Link href={`/blogs/${post.id}`}>
                      <Card post={post} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-foreground/5 rounded-[2rem] bg-foreground/[0.01]">
                 <Terminal size={40} className="mx-auto mb-6 text-foreground/10" />
                 <h3 className="text-lg font-bold uppercase tracking-tighter">Null Result Set</h3>
                 <button onClick={() => {setActiveCategory("All"); setSearchQuery("");}} className="mt-6 text-xs font-bold text-primary underline underline-offset-8">
                  [ RESET_QUERY ]
                 </button>
              </div>
            )}

    
            <div className="lg:hidden">
                <SubscriptionWidget isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}