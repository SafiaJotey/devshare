"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

import Section from "@/components/shared/Section";
import Card, { Post } from "@/components/shared/Card";
import WriteCTA from "@/components/shared/WriteCTA";
import HeroSection from "./_components/HeroSection";
import { getBlogsApi, IBlog } from "@/lib/api";

import {
  mainPost,
  sidePosts,
  benefits,
  posts,
  categories,
  authors,
} from "@/constants/home";

export default function Home() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);

  useEffect(() => {
    const fetchHomeBlogs = async () => {
      try {
        const res = await getBlogsApi({ limit: 12 });
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch home blogs from API:", err);
      }
    };

    fetchHomeBlogs();
  }, []);

  // Main Lead Featured Post: first blog in DB or default mainPost
  const activeMainPost = useMemo(() => {
    if (blogs.length > 0) {
      const b = blogs[0];
      return {
        id: b._id,
        category: b.category,
        title: b.title,
        description: b.description,
        author: b.author?.name || "DevShare Author",
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: b.readTime || "5 min read",
        avatar:
          b.author?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            b.author?.name || "Dev"
          )}`,
        image:
          b.coverImage ||
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      };
    }
    return mainPost;
  }, [blogs]);

  // Side Featured Posts: blogs 2 & 3 or default sidePosts
  const activeSidePosts = useMemo(() => {
    if (blogs.length > 1) {
      const sides = blogs.slice(1, 3).map((b) => ({
        id: b._id,
        category: b.category,
        title: b.title,
        author: b.author?.name || "DevShare Author",
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: b.readTime || "5 min read",
        avatar:
          b.author?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            b.author?.name || "Dev"
          )}`,
        image:
          b.coverImage ||
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      }));

      if (sides.length === 1) {
        return [sides[0], sidePosts[1]];
      }
      return sides;
    }
    return sidePosts;
  }, [blogs]);

  // The Insight Stream posts
  const activeStreamPosts: Post[] = useMemo(() => {
    if (blogs.length > 0) {
      const mappedDb: Post[] = blogs.map((b) => ({
        id: b._id,
        title: b.title,
        author: b.author?.name || "DevShare Author",
        tag: b.category,
        readTime: b.readTime || "5 min read",
        image:
          b.coverImage ||
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
        avatar:
          b.author?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            b.author?.name || "Dev"
          )}`,
      }));

      const remainder = posts.filter(
        (p) => !mappedDb.some((m) => m.title === p.title)
      );
      return [...mappedDb, ...remainder].slice(0, 8);
    }
    return posts;
  }, [blogs]);

  return (
    <>
      <HeroSection />

      {/* FEATURED DEEP DIVES */}
      <Section
        tag="Editor’s Choice"
        title="Featured Deep Dives"
        subtitle="In-depth technical storytelling and architectural breakdowns. Master the mental models behind high-performance engineering."
        linkText="All Insights"
        linkHref="/blogs"
        paddingTop
        paddingBottom
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Featured Post */}
          <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-bl-3xl bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 flex flex-col">
            <Link href={`/blogs/${activeMainPost.id}`}>
              <div className="relative aspect-video lg:aspect-auto lg:h-[350px] overflow-hidden">
                <Image
                  src={activeMainPost.image}
                  alt={activeMainPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-accent text-background px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {activeMainPost.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {activeMainPost.title}
                  </h3>
                  <p className="text-foreground/70 mb-6 line-clamp-2">
                    {activeMainPost.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 overflow-hidden relative">
                      <Image
                        src={activeMainPost.avatar}
                        alt={activeMainPost.author}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{activeMainPost.author}</p>
                      <p className="text-xs text-foreground/50">{activeMainPost.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-foreground/60 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {activeMainPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Stacked Posts */}
          <div className="flex flex-col gap-2">
            {activeSidePosts.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer flex flex-col h-full bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-br-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                <Link href={`/blogs/${post.id}`}>
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <h4 className="font-bold group-hover:text-primary transition-colors leading-snug mb-4 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 overflow-hidden relative">
                          <Image
                            src={post.avatar}
                            alt={post.author}
                            fill
                            sizes="32px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{post.author}</p>
                          <p className="text-xs text-foreground/50">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-foreground/60 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CATEGORIES MARQUEE */}
      <Section
        tag="Ecosystem Navigation"
        bgColor="bg-primary/5"
        title="Build Your Stack"
        subtitle="Explore our technical library categorized by the tools that define your workflow."
        centerHeader
        paddingTop
        paddingBottom
      >
        <div className="relative overflow-hidden w-full">
          <div className="animate-marquee flex gap-6">
            {[...categories, ...categories].map((cat, i) => (
              <Link key={i} href={`/blogs`} className="w-[200px] shrink-0">
                <div className="group bg-background border border-foreground/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-lg h-full">
                  <div
                    className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.color}`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-sm">{cat.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1 font-bold">
                    {cat.count} Articles
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* LATEST INSIGHTS STREAM */}
      <Section
        tag="Newly Published"
        title="The Insight Stream"
        subtitle="A continuous flow of refined technical knowledge."
        linkText="Explore All"
        linkHref="/blogs"
        paddingTop
        paddingBottom
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
          {activeStreamPosts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.id}`}>
              <Card post={post} />
            </Link>
          ))}
        </div>
      </Section>

      {/* CONTRIBUTOR CTA */}
      <Section
        tag="Collaboration"
        title="Shape the Future of Code"
        subtitle="We believe the best insights come from the community."
        paddingBottom
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
            <div className="p-6 rounded-2xl bg-primary text-primary-foreground flex flex-col justify-center">
              <span className="text-4xl font-black mb-1">50+</span>
              <p className="font-medium opacity-80">
                Community contributors onboard.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative p-8 md:p-10 rounded-3xl bg-foreground text-background overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to contribute?
                </h3>
                <p className="opacity-70 mb-8 leading-relaxed">
                  Whether it&apos;s a deep dive into Rust or a CSS trick,
                  we&apos;d love to hear from you.
                </p>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/dashboard/create-blog"
                    className="w-full py-4 bg-accent text-foreground dark:text-black font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                  >
                    Start Writing an Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/blogs"
                    className="w-full py-4 border border-background/20 text-background font-bold rounded-xl hover:bg-background/5 transition-all text-center"
                  >
                    Explore Guidelines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TOP CONTRIBUTORS */}
      <section className="py-20 bg-primary/5 overflow-hidden">
        <div className="container-box mb-12">
          <h2 className="text-center text-3xl font-bold">
            Meet Our Top Contributors
          </h2>
        </div>

        <div className="relative overflow-hidden w-full">
          <div className="animate-marquee flex gap-8 py-4 px-4">
            {[...authors, ...authors].map((author, i) => (
              <div
                key={i}
                className="w-[300px] shrink-0 bg-background p-6 rounded-3xl border border-foreground/5 flex flex-col items-center text-center shadow-sm transition-transform hover:scale-[1.02]"
              >
                <div className="w-20 h-20 rounded-full bg-foreground/10 overflow-hidden relative shrink-0 mb-4">
                  <Image
                    src={author.img}
                    alt={author.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h4 className="font-bold text-lg">{author.name}</h4>
                <p className="text-foreground/50 text-sm mb-4">{author.role}</p>
                <div className="w-full pt-4 border-t border-foreground/5 flex justify-between items-center px-4">
                  <span className="text-xs font-bold text-primary">
                    {author.posts} Articles
                  </span>
                  <button className="text-xs font-black uppercase text-accent hover:underline">
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WriteCTA />
    </>
  );
}