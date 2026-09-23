"use client";

import { useState, useEffect, useMemo } from "react";
import Card, {
  Post,
  CardSkeleton,
  LeadCardSkeleton,
} from "@/components/shared/Card";
import {
  Search,
  Terminal,
  ChevronRight,
  Zap,
  Loader2,
  X,
  SlidersHorizontal,
  BookOpen,
  ArrowUpRight,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogsApi, IBlog } from "@/lib/api";

const CATEGORY_NAMES = [
  "All",
  "Frontend",
  "Backend",
  "DevOps",
  "AI & Data",
  "Security",
];

const mapBlogToPost = (b: IBlog): Post => ({
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
});

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbBlogs, setDbBlogs] = useState<IBlog[]>([]);
  const [allDbBlogs, setAllDbBlogs] = useState<IBlog[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial fetch of all published blogs to calculate categories and baseline
  useEffect(() => {
    let isCancelled = false;
    const fetchAll = async () => {
      try {
        const res = await getBlogsApi({ limit: 100 });
        if (!isCancelled && res.success && res.data) {
          setAllDbBlogs(res.data);
        }
      } catch (err) {
        console.warn("Could not load blogs list from server:", err);
      } finally {
        if (!isCancelled) {
          setIsInitialLoading(false);
        }
      }
    };
    fetchAll();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Filtered query fetch when category or search changes
  useEffect(() => {
    let isCancelled = false;
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const res = await getBlogsApi({
          category: activeCategory !== "All" ? activeCategory : undefined,
          search: searchQuery.trim() || undefined,
          limit: 50,
        });

        if (!isCancelled && res.success && res.data) {
          setDbBlogs(res.data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Could not query filtered blogs:", err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchFiltered, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeCategory, searchQuery]);

  // Real DB blogs mapped to Post format
  const displayPosts: Post[] = useMemo(() => {
    return dbBlogs.map(mapBlogToPost);
  }, [dbBlogs]);

  // Calculate dynamic counts per category from all published DB blogs
  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_NAMES.map((name) => {
      if (name === "All") {
        return { name, count: allDbBlogs.length };
      }
      const count = allDbBlogs.filter((p) => p.category === name).length;
      return { name, count };
    });
  }, [allDbBlogs]);

  // Lead article: latest published article from DB
  const leadPost = useMemo(() => {
    if (allDbBlogs.length > 0) return mapBlogToPost(allDbBlogs[0]);
    if (dbBlogs.length > 0) return mapBlogToPost(dbBlogs[0]);
    return null;
  }, [allDbBlogs, dbBlogs]);

  const hasActiveFilters = activeCategory !== "All" || searchQuery.trim().length > 0;

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
  };

  const ContributorWidget = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`p-6 rounded-3xl bg-foreground text-background relative overflow-hidden group ${
        isMobile ? "mt-20" : "mt-16"
      }`}
    >
      <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
        <PenLine size={120} />
      </div>
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Share what you learned
      </h4>
      <p className="text-[11px] opacity-50 mb-6 leading-relaxed">
        Turn a useful lesson, technical decision, or hard-earned fix into an article that helps another engineer.
      </p>
      <Link
        href="/dashboard/create-blog"
        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground transition-colors hover:bg-accent/90"
      >
        Start writing <ArrowUpRight size={14} />
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION & LEAD ARTICLE */}
      <section className="pt-22 pb-20 border-b border-foreground/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none" />
        <div className="container-box relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full mb-6">
                <Zap size={14} className="fill-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
                  Knowledge Base v2.0
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8 uppercase">
                Engineering <br />
                <span className="text-primary italic font-serif lowercase">
                  Insights &
                </span>{" "}
                Wisdom
              </h1>
              <p className="text-lg text-foreground/60 max-w-xl leading-relaxed">
                A curated collection of technical deep-dives, architectural
                patterns, and real-world engineering experiences.
              </p>
            </div>
            <div className="lg:col-span-6 relative">
              {isInitialLoading ? (
                <LeadCardSkeleton />
              ) : leadPost ? (
                <Link href={`/blogs/${leadPost.id}`} className="group block">
                  <div className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src={leadPost.image}
                      alt={leadPost.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-background">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-4 block">
                        Lead Article // {leadPost.tag}
                      </span>
                      <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight line-clamp-2">
                        {leadPost.title}
                      </h2>
                      <div className="flex items-center gap-4 text-xs font-mono opacity-60">
                        <span>{leadPost.author}</span>
                        <span>/</span>
                        <span>{leadPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden border border-dashed border-foreground/15 bg-foreground/[0.02] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 text-foreground/40">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-base font-bold text-foreground/80">No articles published yet</h3>
                  <p className="text-xs text-foreground/50 mt-1 max-w-xs">
                    Be the first to share your engineering insights and experience.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG WITH SEARCH & SIDEBAR */}
      <div className="container-box py-10 lg:py-20">
        <div className="mb-10 flex flex-col gap-6 border-b border-foreground/10 pb-8 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              <BookOpen size={13} />
              Explore the library
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Find your next useful idea.</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60 sm:text-base">
              Search practical notes, deep dives, and field-tested patterns from the DevShare community.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/50">
              {isLoading
                ? "Loading..."
                : searchQuery.trim()
                ? `${displayPosts.length} matching search`
                : `${categoriesWithCounts.find((category) => category.name === activeCategory)?.count ?? 0} in ${activeCategory}`}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
              >
                Clear filters <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Mobile Search & Filter */}
          <div className="lg:hidden space-y-6">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-3.5 pl-11 pr-11 text-sm font-medium outline-none transition-all placeholder:text-foreground/35 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categoriesWithCounts.map((cat) => (
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

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-10">
            <div className="sticky top-32">
              <div className="mb-8 rounded-3xl border border-foreground/10 bg-foreground/[0.025] p-5">
                <div className="mb-3 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  <Search size={12} /> Search library
                </div>
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                  <input
                    type="text"
                    placeholder="Topic, article, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-foreground/10 bg-background py-3 pl-10 pr-9 text-sm font-medium outline-none transition-all placeholder:text-foreground/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-foreground/10 bg-background p-3 shadow-sm">
                <div className="mb-3 flex items-center px-2 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    <SlidersHorizontal size={12} /> Filter by topic
                  </div>
                </div>
                <nav className="space-y-1">
                  {categoriesWithCounts.map((cat) => (
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
                        <div
                          className={`w-1 h-4 rounded-full transition-all ${
                            activeCategory === cat.name
                              ? "bg-accent scale-y-100"
                              : "bg-transparent scale-y-0"
                          }`}
                        />
                        <span
                          className={`font-bold ${
                            activeCategory === cat.name
                              ? "translate-x-0"
                              : "-translate-x-2 group-hover:translate-x-0 transition-transform"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          activeCategory === cat.name
                            ? "bg-white/20 text-white"
                            : "bg-foreground/5 text-foreground/40"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </nav>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-foreground/10 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-primary"
                  >
                    Reset catalog <X size={12} />
                  </button>
                )}
              </div>

              <ContributorWidget />
            </div>
          </aside>

          {/* Main Grid */}
          <div className="lg:col-span-9">
            <div className="mb-8 flex flex-col gap-4 border-b border-foreground/10 pb-6 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">
                  <Terminal size={14} className="text-primary" />
                  <span className="hidden sm:inline">Library</span>
                  <ChevronRight size={10} className="hidden sm:inline" />
                  <span className="text-foreground underline decoration-accent/50 underline-offset-4">
                    {activeCategory}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">
                  {searchQuery.trim() ? `Results for “${searchQuery.trim()}”` : `${activeCategory} articles`}
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.025] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">
                {isLoading ? <Loader2 size={12} className="animate-spin text-primary" /> : <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                {isLoading ? "Loading..." : `${displayPosts.length} ${displayPosts.length === 1 ? "result" : "results"}`}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : displayPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {displayPosts.map((post, i) => (
                  <div key={post.id} className="relative group">
                    <div className="absolute -top-4 -left-4 text-[9px] font-mono text-foreground/10 group-hover:text-primary transition-colors hidden xl:block">
                      {`00${i + 1}`}
                    </div>
                    <Link href={`/blogs/${post.id}`}>
                      <Card post={post} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-foreground/[0.015] px-6 py-20 text-center">
                <Terminal size={40} className="mx-auto mb-6 text-foreground/10" />
                <h3 className="text-xl font-bold tracking-tight">No articles found</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground/55">Try a broader search, or return to the full library to discover another topic.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Browse all articles <ArrowUpRight size={14} />
                </button>
              </div>
            )}

            <div className="lg:hidden">
              <ContributorWidget isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
