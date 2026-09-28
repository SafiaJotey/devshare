"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Terminal } from "lucide-react";
import { Block } from "../type";
import { useAuth } from "@/providers/auth-provider";

interface PreviewModeProps {
  category: string;
  title: string;
  description: string;
  blocks: Block[];
  coverImage?: string;
}

export const PreviewMode = ({
  category,
  title,
  description,
  blocks,
  coverImage,
}: PreviewModeProps) => {
  const { user } = useAuth();

  // Calculate dynamic reading time
  const totalWords = blocks
    .filter((b) => b.type !== "image")
    .map((b) => b.content)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(totalWords / 180));

  const author = {
    name: user?.name || "DevShare Author",
    role: user?.title || "Developer & Contributor",
    avatar:
      user?.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.name || "DevShare"
      )}`,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: `${readTimeMinutes} min`,
  };
const renderSingleBlock = (block: Block) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={block.id} className="text-3xl font-bold mt-8 mb-4 break-words leading-tight">
          {block.content}
        </h2>
      );
    case "h3":
      return (
        <h3 key={block.id} className="text-2xl font-bold mt-6 mb-3 break-words leading-tight">
          {block.content}
        </h3>
      );
    case "h4":
      return (
        <h4 key={block.id} className="text-xl font-bold mt-5 mb-2 break-words leading-snug">
          {block.content}
        </h4>
      );
    case "h5":
      return (
        <h5 key={block.id} className="text-lg font-bold mt-4 mb-2 break-words leading-snug">
          {block.content}
        </h5>
      );
    case "h6":
      return (
        <h6 key={block.id} className="text-base font-semibold uppercase tracking-wider text-foreground/75 mt-4 mb-1 break-words">
          {block.content}
        </h6>
      );

    case "ul":
      return (
        <ul key={block.id} className="list-disc pl-5 space-y-1.5 my-4 text-foreground/85 text-base leading-relaxed marker:text-primary">
          {block.content
            .split("\n")
            .filter((item) => item.trim().length > 0)
            .map((item, idx) => (
              <li key={idx} className="break-words">{item}</li>
            ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={block.id} className="list-decimal pl-5 space-y-1.5 my-4 text-foreground/85 text-base leading-relaxed marker:text-primary marker:font-semibold">
          {block.content
            .split("\n")
            .filter((item) => item.trim().length > 0)
            .map((item, idx) => (
              <li key={idx} className="break-words">{item}</li>
            ))}
        </ol>
      );

    case "p":
      return (
        <p key={block.id} className="mb-4 leading-relaxed whitespace-pre-wrap break-words">
          {block.content}
        </p>
      );

    case "quote":
      return (
        <blockquote key={block.id} className="border-l-4 border-accent pl-4 my-6 italic text-lg font-serif text-foreground/70 leading-relaxed bg-accent/5 py-4 rounded-r-xl break-words whitespace-pre-wrap shadow-sm">
          &quot;{block.content}&quot;
        </blockquote>
      );

    case "code":
      return (
        <div key={block.id} className="my-6 rounded-xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl">
          <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
              {block.metadata || "script.ts"}
            </span>
          </div>
          <pre className="p-4 text-xs overflow-x-auto text-blue-300 font-mono leading-relaxed break-words whitespace-pre-wrap bg-transparent">
            <code>{block.content}</code>
          </pre>
        </div>
      );

    case "image":
      return block.content ? (
        <div key={block.id} className="my-6 rounded-2xl overflow-hidden shadow-xl aspect-video relative">
          <img src={block.content} className="w-full h-full object-cover" alt="Column media" />
        </div>
      ) : null;

    default:
      return null;
  }
};
  // Find effective cover image (either explicit or first image block)
  const firstImage = blocks.find((b) => b.type === "image" && b.content);
  const effectiveCover = coverImage || firstImage?.content;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. BLOG HEADER */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        {/* Dynamic Category */}
        <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
          {category || "Category"}
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-8 leading-[1.1] tracking-tight text-foreground break-words whitespace-pre-wrap px-4">
          {title || "Untitled Masterpiece"}
        </h1>

        {/* Description */}
        <p className="text-xl text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto break-words whitespace-pre-wrap px-4">
          {description || "No description provided."}
        </p>

        <div className="flex items-center justify-center gap-6 pt-8 border-t border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-foreground/5 rounded-full overflow-hidden border border-foreground/10 shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">{author.name}</p>
              <p className="text-xs text-foreground/50">{author.role}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex gap-4 text-foreground/50 text-sm">
            <span className="flex items-center gap-1 shrink-0">
              <Calendar size={14} /> {author.date}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock size={14} /> {author.readTime} read
            </span>
          </div>
        </div>
      </header>

      {/* 2. COVER IMAGE (IF AVAILABLE) */}
      {effectiveCover && (
        <div className="aspect-[21/9] relative rounded-[2rem] overflow-hidden mb-16 shadow-2xl border border-foreground/10">
          <Image
            src={effectiveCover}
            alt="Cover"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* 3. DYNAMIC CONTENT RENDERING (Blocks) */}
      <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-primary mx-auto px-4 md:px-0">
      {blocks.map((block) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={block.id} className="text-3xl font-bold mt-12 mb-6 break-words leading-tight">
          {block.content}
        </h2>
      );
    case "h3":
      return (
        <h3 key={block.id} className="text-2xl font-bold mt-10 mb-5 break-words leading-tight">
          {block.content}
        </h3>
      );
    case "h4":
      return (
        <h4 key={block.id} className="text-xl font-bold mt-8 mb-4 break-words leading-snug">
          {block.content}
        </h4>
      );
    case "h5":
      return (
        <h5 key={block.id} className="text-lg font-bold mt-6 mb-3 break-words leading-snug">
          {block.content}
        </h5>
      );
    case "h6":
      return (
        <h6 key={block.id} className="text-base font-semibold uppercase tracking-wider text-foreground/75 mt-6 mb-2 break-words leading-normal">
          {block.content}
        </h6>
      );

    case "ul":
      return (
        <ul key={block.id} className="list-disc pl-6 space-y-2 my-6 text-foreground/85 text-lg leading-relaxed marker:text-primary">
          {block.content
            .split("\n")
            .filter((item) => item.trim().length > 0)
            .map((item, idx) => (
              <li key={idx} className="break-words">{item}</li>
            ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={block.id} className="list-decimal pl-6 space-y-2 my-6 text-foreground/85 text-lg leading-relaxed marker:text-primary marker:font-semibold">
          {block.content
            .split("\n")
            .filter((item) => item.trim().length > 0)
            .map((item, idx) => (
              <li key={idx} className="break-words">{item}</li>
            ))}
        </ol>
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
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono tracking-widest uppercase">
              <Terminal size={12} /> {block.metadata || "script.ts"}
            </div>
          </div>
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
case "layout": {
  let cols: any[] = [];
  try {
    cols = JSON.parse(block.content);
  } catch {
    cols = [];
  }
  const is3Cols = cols.length === 3;

  return (
    <div
      key={block.id}
      className={`grid gap-6 my-10 items-start ${
        is3Cols ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {cols.map((col, idx) => (
        <div key={col.id || idx} className="space-y-4">
          {col.blocks.map((subBlock: any) => renderSingleBlock(subBlock))}
        </div>
      ))}
    </div>
  );
}
    default:
      return null;
  }
})}
      </div>

      {/* FOOTER */}
      <div className="mt-20 pt-10 border-t border-foreground/5 text-center">
        <p className="text-xs text-foreground/30 font-mono uppercase tracking-[0.2em]">
        Dev share preview
        </p>
      </div>
    </div>
  );
};

export default PreviewMode;