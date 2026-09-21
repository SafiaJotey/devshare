"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  Bookmark, 
  MessageSquare, 
  Twitter, 
  Linkedin, 
  Copy,
  Terminal,

} from "lucide-react";

// Components
import WriteCTA from "@/components/shared/WriteCTA";
import ReadyToContribute from "@/components/shared/ReadyToContribute";
import Card, { Post } from "@/components/shared/Card";
import Section from "@/components/shared/Section";

// Mock data for the CURRENT post
const POST = {
  id: 1,
  title: "Deep Dive: How React 19's Actions Will Simplify Form Handling",
  description: "An in-depth exploration of the new 'useActionState' hook and why the future of forms is moving back to the platform.",
  author: "Arjun Sharma",
  authorRole: "Senior Frontend Engineer",
  date: "Oct 24, 2023",
  tag: "Frontend",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
  avatar: "https://i.pravatar.cc/150?u=arjun",
};

// Mock data for SUGGESTED/RELATED posts
const RELATED_POSTS: Post[] = [
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
];

export default function BlogDetails() {
  const [completion, setCompletion] = useState(0);


  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return (
    <main className="min-h-screen bg-background pb-20">

      <div className="fixed top-0 left-0 w-full h-1 bg-primary/10 z-50">
        <div 
          className="h-full bg-primary transition-all duration-150" 
          style={{ width: `${completion}%` }}
        />
      </div>


      <nav className="pt-12 pb-10 container-box">
        <Link 
          href="/blogs" 
          className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors group w-fit"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Feed</span>
        </Link>
      </nav>

      <article className="container-box">
        {/* 3. POST HEADER */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
            {POST.tag}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-8 leading-[1.1] tracking-tight text-foreground">
            {POST.title}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed mb-10">
            {POST.description}
          </p>

          <div className="flex items-center justify-center gap-6 pt-8 border-t border-foreground/5">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11">
                <Image src={POST.avatar} alt={POST.author} fill className="rounded-full object-cover" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{POST.author}</p>
                <p className="text-xs text-foreground/50">{POST.authorRole}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div className="flex gap-4 text-foreground/50 text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {POST.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {POST.readTime} read</span>
            </div>
          </div>
        </header>

        {/* 4. FEATURE IMAGE */}
        <div className="aspect-[21/9] relative rounded-[2rem] overflow-hidden mb-20 shadow-2xl">
          <Image src={POST.image} alt="Cover" fill className="object-cover" priority />
        </div>

        {/* 5. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-20">
          
          {/* MAIN PROSE */}
          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-primary">
            <p>
              React 19 is introducing a paradigm shift in how we handle side effects in forms. 
              The new <code>useActionState</code> (formerly <code>useFormState</code>) hook 
              streamlines the bridge between client-side UI and server-side logic.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">The Problem with Traditional Forms</h2>
            <p>
              Until now, developers had to manually manage <code>isLoading</code>, <code>isError</code>, 
              and <code>data</code> states. This led to boilerplate-heavy components that were 
              prone to synchronization bugs.
            </p>

            {/* CREATIVE CODE BLOCK */}
            <div className="my-10 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl">
              <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                  <Terminal size={12} /> action.ts
                </div>
              </div>
              <pre className="p-6 text-sm overflow-x-auto text-blue-300 font-mono leading-relaxed">
                {`const [state, formAction] = useActionState(
  async (prevState, formData) => {
    const result = await updateProfile(formData);
    return result;
  },
  { name: "", email: "" }
);`}
              </pre>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">Why this matters</h2>
            <p>
              By treating form submissions as &quot;Actions,&quot; React can automatically handle the 
              transition period, meaning you no longer need to wrap your fetch calls in 
              startTransition manually. It&apos;s a cleaner, more declarative way to build 
              interactive web applications.
            </p>

            <blockquote className="border-l-4 border-accent pl-8 my-12 italic text-2xl font-serif text-foreground/70 leading-relaxed">
              &quot;The best code is the code that feels like the platform it&apos;s built upon.&quot;
            </blockquote>
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block space-y-12">
            <div className="sticky top-32 space-y-10">
              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button className="flex items-center justify-center gap-3 text-sm font-bold bg-foreground text-background py-4 px-6 rounded-xl hover:bg-primary transition-all active:scale-95 shadow-lg">
                  <Bookmark size={18} /> Save for later
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 border border-foreground/10 py-3 rounded-xl hover:bg-foreground/5 transition-colors">
                    <Twitter size={16} />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-foreground/10 py-3 rounded-xl hover:bg-foreground/5 transition-colors">
                    <Linkedin size={16} />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-foreground/10 py-3 rounded-xl hover:bg-foreground/5 transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40">On this page</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-primary font-bold">Introduction</a></li>
                  <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">Traditional Forms</a></li>
                  <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">The New Action Hook</a></li>
                  <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">Conclusion</a></li>
                </ul>
              </div>

              {/* Discussion */}
              <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-3 text-accent">
                  <MessageSquare size={18} />
                  <span className="font-bold text-sm">Join the debate</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                  What do you think about the React 19 form changes? 12 developers are talking about this.
                </p>
                <button className="text-xs font-bold underline underline-offset-4 hover:text-accent transition-colors">Read 12 Comments</button>
              </div>
            </div>
          </aside>
        </div>
      </article>

  
      <Section
        variant="colorful"
        tag="More Insights"
        title={<>Continue your <span className="text-primary italic">learning journey.</span></>}
        linkText="Explore all articles"
        linkHref="/blogs"
        className="mt-32 border-t border-foreground/5 pt-20"
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {RELATED_POSTS.map((post) => (
            <Link key={post.id} href={`/blogs/${post.id}`}>
              <Card post={post} />
            </Link>
          ))}
        </div>
      </Section>

      <div className="mt-32">
        <ReadyToContribute />
      </div>
      <WriteCTA />
    </main>
  );
}