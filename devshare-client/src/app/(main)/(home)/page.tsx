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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Lead story */}
          <Link
            href={`/blogs/${activeMainPost.id}`}
            className="group relative isolate flex min-h-[440px] overflow-hidden rounded-3xl bg-foreground text-background shadow-sm lg:col-span-7 lg:min-h-[540px]"
          >
            <Image
              src={activeMainPost.image}
              alt={activeMainPost.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 to-foreground/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />

            <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-8 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-background">
                  {activeMainPost.category}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/60">
                  Featured / 01
                </span>
              </div>

              <div className="max-w-2xl pt-16">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  Deep dive
                </p>
                <h3 className="text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                  {activeMainPost.title}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-background/75 sm:text-base line-clamp-2">
                  {activeMainPost.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-background/20 pt-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-background/20 bg-background/10">
                    <Image
                      src={activeMainPost.avatar}
                      alt={activeMainPost.author}
                      fill
                      sizes="36px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{activeMainPost.author}</p>
                    <p className="text-xs text-background/60">{activeMainPost.date}</p>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-xs font-bold text-background/75">
                  <Clock size={14} className="text-accent" />
                  {activeMainPost.readTime}
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Companion stories */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {activeSidePosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blogs/${post.id}`}
                className="group relative flex min-h-[300px] overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-6 lg:min-h-0 lg:flex-1"
              >
                <div className="absolute inset-y-0 right-0 w-[42%] overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 42vw, (max-width: 1024px) 21vw, 18vw"
                    className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-35"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
                </div>

                <div className="relative z-10 flex w-full flex-col justify-between gap-8">
                  <div>
                    <div className="mb-8 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-foreground/35">
                        0{index + 2}
                      </span>
                    </div>
                    <h4 className="max-w-[82%] text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-2xl line-clamp-3">
                      {post.title}
                    </h4>
                  </div>

                  <div className="flex items-end justify-between gap-3 border-t border-foreground/10 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-foreground/10">
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
                        <p className="text-xs font-bold">{post.author}</p>
                        <p className="text-[11px] text-foreground/50">{post.date}</p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-foreground/60">
                      <Clock size={13} className="text-accent" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* CATEGORIES MARQUEE */}
      <Section
        tag="Ecosystem Navigation"
        bgColor="bg-primary/[0.06]"
        title="Build Your Stack"
        subtitle="Follow the disciplines, tools, and systems that move your work forward."
        centerHeader
        paddingTop
        paddingBottom
      >
        <div className="relative">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

          <div className="mb-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45">
            <span className="h-px w-8 bg-foreground/15" />
            06 paths to explore
            <span className="h-px w-8 bg-foreground/15" />
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-primary/[0.08] to-transparent sm:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-primary/[0.08] to-transparent sm:w-20" />
            <div className="animate-marquee flex gap-4 px-2 py-3 sm:gap-5">
            {[...categories, ...categories].map((cat, i) => (
              <Link
                key={`${cat.name}-${i}`}
                href="/blogs"
                className="group relative flex h-[190px] w-[230px] shrink-0 flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="absolute right-5 top-5 font-mono text-[10px] font-bold tracking-widest text-foreground/30">
                  0{(i % categories.length) + 1}
                </span>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/[0.05] transition-transform duration-500 group-hover:scale-150" />

                <div className="relative flex flex-1 flex-col items-start">
                  <div
                    className={`mb-5 rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/45">
                    {cat.count} articles
                  </p>
                </div>
                <div className="relative flex items-center gap-1.5 text-xs font-bold text-foreground/55 transition-colors group-hover:text-accent">
                  Explore topic
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
            </div>
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
      <section className="relative overflow-hidden bg-primary/[0.06] py-16 md:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

        <div className="container relative mx-auto mb-10 flex flex-col gap-6 px-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
              Community / Voices
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Meet the people building in public.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/60">
              Practical lessons, thoughtful experiments, and the generous people
              behind DevShare&apos;s best conversations.
            </p>
          </div>
          <Link
            href="/blogs"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"
          >
            Explore their writing
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-primary/[0.06] to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-primary/[0.06] to-transparent sm:w-32" />
          <div className="animate-marquee flex gap-5 px-4 py-4 sm:gap-6">
            {[...authors, ...authors].map((author, i) => (
              <Link
                key={`${author.name}-${i}`}
                href="/blogs"
                className="group relative flex w-[290px] shrink-0 flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 sm:w-[320px]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-primary/[0.08] transition-colors group-hover:bg-accent/15" />
                <div className="relative flex items-start justify-between">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={author.img}
                      alt={author.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-foreground/35">
                    0{(i % authors.length) + 1}
                  </span>
                </div>

                <div className="mt-7">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    Top contributor
                  </p>
                  <h4 className="mt-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                    {author.name}
                  </h4>
                  <p className="mt-1 text-sm text-foreground/55">{author.role}</p>
                </div>

                <div className="mt-7 flex items-end justify-between border-t border-foreground/10 pt-4">
                  <div>
                    <span className="block text-2xl font-extrabold leading-none text-primary">
                      {author.posts}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">
                      Articles shared
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 transition-colors group-hover:text-accent">
                    Read insights
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WriteCTA />
    </>
  );
}
