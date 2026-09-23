"use client";

import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";

export interface Post {
  id: string | number;
  title: string;
  author: string;
  tag: string;
  readTime: string;
  image: string;
  avatar: string;
}

interface CardProps {
  post: Post;
}

export default function Card({ post }: CardProps) {
  return (
    <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-foreground/10">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          {post.tag}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex translate-y-2 items-center justify-between text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span>Read article</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-foreground shadow-lg">
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
            {post.tag}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-foreground/45">
            <Clock size={13} className="text-accent" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>

        <h3 className="mt-3 min-h-[3.1rem] text-lg font-extrabold leading-[1.25] tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>

        <div className="mt-auto flex items-center gap-3 border-t border-foreground/10 pt-4">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-foreground/10 ring-2 ring-background">
            <Image
              src={post.avatar}
              alt={post.author}
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 text-xs">
            <p className="truncate font-bold text-foreground">{post.author}</p>
            <p className="mt-0.5 text-[11px] text-foreground/50">Contributor</p>
          </div>
          <ArrowUpRight
            className="ml-auto size-4 text-foreground/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-sm animate-pulse">
      {/* Media Skeleton */}
      <div className="relative aspect-[16/10] shrink-0 bg-foreground/10">
        <div className="absolute left-4 top-4 h-5 w-20 rounded-full bg-foreground/15" />
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3.5 w-16 rounded-full bg-foreground/15" />
          <div className="h-3.5 w-14 rounded-full bg-foreground/10" />
        </div>

        <div className="mt-3 space-y-2 min-h-[3.1rem]">
          <div className="h-4.5 w-full rounded-lg bg-foreground/15" />
          <div className="h-4.5 w-3/4 rounded-lg bg-foreground/10" />
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-foreground/10 pt-4">
          <div className="size-9 shrink-0 rounded-full bg-foreground/15" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-24 rounded bg-foreground/15" />
            <div className="h-2.5 w-16 rounded bg-foreground/10" />
          </div>
          <div className="size-4 rounded bg-foreground/10 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function LeadCardSkeleton() {
  return (
    <div className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden border border-foreground/10 bg-foreground/10 shadow-2xl animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full space-y-4 z-10">
        <div className="h-3.5 w-32 rounded-full bg-foreground/20" />
        <div className="space-y-2.5 max-w-xl">
          <div className="h-7 md:h-10 w-4/5 rounded-xl bg-foreground/25" />
          <div className="h-7 md:h-10 w-3/5 rounded-xl bg-foreground/25" />
        </div>
        <div className="flex items-center gap-4 pt-1">
          <div className="h-3.5 w-24 rounded bg-foreground/20" />
          <div className="h-3.5 w-2 rounded bg-foreground/15" />
          <div className="h-3.5 w-16 rounded bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}

Card.Skeleton = CardSkeleton;
Card.LeadSkeleton = LeadCardSkeleton;
