"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Terminal } from "lucide-react";
import { Block } from "../type";

interface PreviewModeProps {
  category: string;
  title: string;
  description: string;
  blocks: Block[];
}

export const PreviewMode = ({ category, title, description, blocks }: PreviewModeProps) => {
  // Mock data for the preview author info
  const author = {
    name: "Arjun Sharma",
    role: "Senior Frontend Engineer",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: "8 min"
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. BLOG HEADER */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        {/* Dynamic Category */}
        <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
          {category || "Category"}
        </span>
        
        {/* Title: added break-words to handle long titles */}
        <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-8 leading-[1.1] tracking-tight text-foreground break-words whitespace-pre-wrap px-4">
          {title || "Untitled Masterpiece"}
        </h1>

        {/* Description: added break-words and whitespace-pre-wrap */}
        <p className="text-xl text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto break-words whitespace-pre-wrap px-4">
          {description || "No description provided."}
        </p>

        <div className="flex items-center justify-center gap-6 pt-8 border-t border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-foreground/5 rounded-full overflow-hidden border border-foreground/10 shrink-0">
               <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">{author.name}</p>
              <p className="text-xs text-foreground/50">{author.role}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex gap-4 text-foreground/50 text-sm">
            <span className="flex items-center gap-1 shrink-0"><Calendar size={14} /> {author.date}</span>
            <span className="flex items-center gap-1 shrink-0"><Clock size={14} /> {author.readTime} read</span>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC CONTENT RENDERING (Blocks) */}
      <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-primary mx-auto px-4 md:px-0">
        {blocks.map((block) => {
          switch (block.type) {
            case "h2":
              return (
                <h2 key={block.id} className="text-3xl font-bold mt-12 mb-6 break-words leading-tight">
                  {block.content}
                </h2>
              );

            case "p":
              return (
                <p key={block.id} className="mb-6 leading-relaxed whitespace-pre-wrap break-words">
                  {block.content}
                </p>
              );

            case "quote":
              return (
                <blockquote key={block.id} className="border-l-4 border-accent pl-8 my-12 italic text-2xl font-serif text-foreground/70 leading-relaxed bg-accent/5 py-6 rounded-r-2xl break-words whitespace-pre-wrap shadow-sm">
                  &quot;{block.content}&quot;
                </blockquote>
              );

            case "code":
              return (
                <div key={block.id} className="my-10 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl">
                  <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex  items-center gap-2 text-[10px] text-white/40 font-mono tracking-widest uppercase">
                      <Terminal size={12} /> {block.metadata || "script.ts"}
                    </div>
                  </div>
                  {/* Code pre uses overflow-x-auto to allow horizontal scrolling for long code lines */}
                  <pre className="p-6 text-sm overflow-x-auto text-blue-300 font-mono leading-relaxed break-words whitespace-pre-wrap bg-transparent">
                    <code>{block.content}</code>
                  </pre>
                </div>
              );

            case "image":
              return (
                <div key={block.id} className="my-12">
                  {block.content && (
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
                      <img 
                        src={block.content} 
                        className="w-full h-full object-cover transition-transform hover:scale-[1.02] duration-500" 
                        alt="Blog Visual" 
                      />
                    </div>
                  )}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-20 pt-10 border-t border-foreground/5 text-center">
        <p className="text-xs text-foreground/30 font-mono uppercase tracking-[0.2em]">
          End of Preview // System Stable
        </p>
      </div>
    </div>
  );
};