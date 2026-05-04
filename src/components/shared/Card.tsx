"use client";

import Image from "next/image";

// 1. Define the shape of the post object
export interface Post {
  id: number;
  title: string;
  author: string;
  tag: string;
  readTime: string;
  image: string;
  avatar: string;
}

// 2. Define the props for the Card component
interface CardProps {
  post: Post;
}

export default function Card({ post }: CardProps) {
  return (
    <article className="group cursor-pointer">
      {/* Main Post Image */}
      <div className="aspect-[16/10] bg-foreground/10 mb-2 overflow-hidden relative">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
          <span className="text-white text-xs font-medium">Read Article →</span>
        </div>
      </div>

      <span className="text-accent text-xs font-bold uppercase tracking-widest">
        {post.tag}
      </span>

      <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
        {post.title}
      </h3>

      <div className="mt-2 flex items-center gap-3">
        {/* Author Avatar Image */}
        <div className="w-8 h-8 rounded-full bg-foreground/10 overflow-hidden relative">
          <Image
            src={post.avatar}
            alt={post.author}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-xs">
          <p className="font-bold">{post.author}</p>
          <p className="text-foreground/50">{post.readTime} read</p>
        </div>
      </div>
    </article>
  );
}