"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Cpu,
  Server,
  Monitor,
  Zap,
  Shield,
  Layers,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { getMyBlogsApi, IBlog } from "@/lib/api";

const CATEGORY_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Frontend: { icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
  Backend: { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  DevOps: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  "AI & Data": { icon: Cpu, color: "text-amber-500", bg: "bg-amber-500/10" },
  Security: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

const POPULAR_TAGS = [
  { name: "React 19", category: "Frontend" },
  { name: "Next.js 15", category: "Frontend" },
  { name: "Distributed Cache", category: "DevOps" },
  { name: "Serwist PWA", category: "Frontend" },
  { name: "LLM Fine-Tuning", category: "AI & Data" },
  { name: "Microservices", category: "Backend" },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserBlogs = useCallback(async () => {
    try {
      const res = await getMyBlogsApi({ limit: 10 });
      if (res && res.data) {
        setBlogs(res.data);
      }
    } catch (err) {
      console.error("Failed to load user blogs for overview:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchUserBlogs();
  };

  // Live calculated stats
  const publishedCount = blogs.filter((b) => b.status === "Published").length;
  const draftCount = blogs.filter((b) => b.status === "Draft").length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes || 0), 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* ─── 1. GREETING & STATUS BAR ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-foreground/50">
              Workspace Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Welcome back,{" "}
            <span className="text-primary">
              {user?.name || "Developer"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            Your publication metrics, community readership, and technical portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="h-9 px-3 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/70 text-xs cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw
              size={13}
              className={`mr-1.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Link href="/dashboard/blogs">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/70 text-xs font-semibold cursor-pointer"
            >
              <span>Library ({blogs.length})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. PERFORMANCE METRIC CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Publications */}
        <div className="p-5 rounded-2xl bg-card border border-foreground/5 hover:border-primary/20 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText size={18} />
            </div>
            {draftCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-mono">
                {draftCount} in draft
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 font-mono">
            Publications
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              {isLoading ? "—" : publishedCount}
            </h3>
            <span className="text-xs text-foreground/50">
              {publishedCount === 1 ? "article live" : "articles live"}
            </span>
          </div>
        </div>

        {/* Card 2: Readership / Views */}
        <div className="p-5 rounded-2xl bg-card border border-foreground/5 hover:border-primary/20 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Eye size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-mono">
              Impressions
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 font-mono">
            Total Readership
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              {isLoading ? "—" : formatNumber(totalViews)}
            </h3>
            <span className="text-xs text-foreground/50">views</span>
          </div>
        </div>

        {/* Card 3: Developer Likes */}
        <div className="p-5 rounded-2xl bg-card border border-foreground/5 hover:border-primary/20 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Heart size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-mono">
              Reactions
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 font-mono">
            Appreciation
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              {isLoading ? "—" : formatNumber(totalLikes)}
            </h3>
            <span className="text-xs text-foreground/50">likes</span>
          </div>
        </div>

        {/* Card 4: Contributor Status */}
        <div className="p-5 rounded-2xl bg-card border border-foreground/5 hover:border-primary/20 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono flex items-center gap-1">
              <CheckCircle2 size={11} /> Verified
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 font-mono">
            Author Role
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-xl sm:text-2xl font-black text-foreground truncate">
              {user?.role === "admin" ? "Admin" : "Contributor"}
            </h3>
          </div>
        </div>
      </div>

      {/* ─── 3. TOPIC QUICK-START (NOT A REDUNDANT DUPLICATE BUTTON) ────────── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-foreground/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide font-mono">
                Quick Category Starter
              </h2>
            </div>
            <p className="text-xs text-foreground/60">
              Select a domain to start drafting an article under that technical track:
            </p>
          </div>

          {/* Category Chips that pre-select category */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(CATEGORY_MAP).map(([cat, cfg]) => {
              const Icon = cfg.icon;
              return (
                <Link
                  key={cat}
                  href={`/dashboard/create-blog?category=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-foreground/10 bg-background hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground/80 hover:text-primary cursor-pointer group"
                >
                  <Icon size={13} className={cfg.color} />
                  <span>{cat}</span>
                  <ChevronRight size={11} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 4. RECENT PUBLICATIONS + SIDEBAR ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT (2 Columns): Real Recent Publications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Recent Publications
              </h2>
              <p className="text-xs text-foreground/50">
                Your latest authored posts on DevShare
              </p>
            </div>
            <Link
              href="/dashboard/blogs"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-12 text-center rounded-2xl bg-card border border-foreground/5 space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
              <p className="text-xs text-foreground/50">Loading articles...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-3">
              {blogs.slice(0, 4).map((blog) => {
                const CategoryConfig =
                  CATEGORY_MAP[blog.category] || {
                    icon: Layers,
                    color: "text-foreground",
                    bg: "bg-foreground/5",
                  };
                const CategoryIcon = CategoryConfig.icon;

                return (
                  <div
                    key={blog._id}
                    className="p-4 rounded-xl bg-card border border-foreground/5 hover:border-primary/20 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${CategoryConfig.bg} ${CategoryConfig.color}`}
                      >
                        <CategoryIcon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${CategoryConfig.bg} ${CategoryConfig.color}`}
                          >
                            {blog.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              blog.status === "Published"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {blog.status}
                          </span>
                          <span className="text-[11px] text-foreground/40 font-mono flex items-center gap-1">
                            <Clock size={11} /> {blog.readTime || "4 min"}
                          </span>
                        </div>

                        <Link
                          href={`/blogs/${blog.slug || blog._id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {blog.title}
                        </Link>
                      </div>
                    </div>

                    {/* Right: Metrics & Link */}
                    <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-foreground/5">
                      <div className="flex items-center gap-3 text-xs text-foreground/50 font-mono">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye size={12} className="text-blue-500" />
                          {blog.views || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Likes">
                          <Heart size={12} className="text-red-500" />
                          {blog.likes || 0}
                        </span>
                      </div>

                      <Link href={`/blogs/${blog.slug || blog._id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-foreground/40 group-hover:text-primary transition-colors cursor-pointer"
                        >
                          <ArrowUpRight size={15} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="p-8 text-center rounded-2xl bg-card border border-dashed border-foreground/15 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <BookOpen size={22} />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                No publications yet
              </h3>
              <p className="text-xs text-foreground/50 max-w-xs mx-auto">
                Share your first technical article or code walkthrough to start building your readership.
              </p>
              <Link href="/dashboard/create-blog">
                <Button size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs h-9 cursor-pointer">
                  Start Writing
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT (1 Column): Profile & Community Trends */}
        <div className="space-y-4">
          {/* Author Card */}
          <div className="p-5 rounded-2xl bg-card border border-foreground/5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 font-mono mb-3">
              Author Card
            </h3>

            <div className="flex items-center gap-3 mb-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="w-11 h-11 rounded-full object-cover border border-primary/20"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : "D"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {user?.name || "Developer"}
                </h4>
                <p className="text-xs text-foreground/50 truncate">
                  {user?.title || "Contributor & Engineer"}
                </p>
              </div>
            </div>

            {user?.bio && (
              <p className="text-xs text-foreground/60 italic mb-3 line-clamp-2">
                &ldquo;{user.bio}&rdquo;
              </p>
            )}

            <div className="pt-3 border-t border-foreground/5 flex items-center justify-between text-xs">
              <span className="text-foreground/50">Standing</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Contributor
              </span>
            </div>
          </div>

          {/* Trending Community Tags */}
          <div className="p-5 rounded-2xl bg-card border border-foreground/5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 font-mono mb-2">
              Trending on DevShare
            </h3>
            <p className="text-xs text-foreground/50 mb-3">
              High-demand topics across the developer community:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/blogs?category=${encodeURIComponent(tag.category)}`}
                  className="px-2.5 py-1 rounded-lg bg-foreground/[0.03] border border-foreground/5 hover:border-primary/30 hover:bg-primary/5 text-[11px] font-mono font-medium text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}