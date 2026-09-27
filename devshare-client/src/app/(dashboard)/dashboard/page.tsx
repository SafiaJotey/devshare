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
  Plus,
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
      {/* ─── 1. HERO WELCOME CARD WITH AUTHOR VECTOR ─────────────────────── */}
      <div className="relative overflow-hidden  p-6 sm:p-8 lg:py-0 lg:px-6 shadow-sm rounded-lg">
        {/* Soft background ambient blurs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl " />
        <div className="pointer-events-none absolute left-1/3 -bottom-16 h-56 w-56 rounded-full  bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* LEFT: Text & Action CTAs */}
          <div className="flex-1 space-y-2 max-w-xl text-left">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium">
              <Sparkles size={13} className="animate-pulse" />
              <span>DevShare Editorial Suite</span>
            </div> */}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Welcome back,{" "}
              <span className="text-primary">{user?.name || "Developer"}</span>{" "}
              👋
            </h1>

            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              {blogs.length > 0
                ? `You have ${blogs.length} technical post${blogs.length === 1 ? "" : "s"} live with ${formatNumber(totalViews)} impressions. Ready to publish your next architecture walkthrough or engineering deep-dive?`
                : "Your developer workspace is ready. Turn your real-world debugging sessions, system designs, and code insights into impactful articles."}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link href="/dashboard/create-blog">
                <Button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Plus size={15} />
                  <span>New Article</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                className="h-10 px-3.5 rounded-xl border-foreground/10 bg-background/60 hover:bg-foreground/5 text-foreground/75 text-xs cursor-pointer backdrop-blur-xs"
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
                  className="h-10 px-3.5 rounded-xl border-foreground/10 bg-background/60 hover:bg-foreground/5 text-foreground/75 text-xs font-semibold cursor-pointer backdrop-blur-xs"
                >
                  <span>Library ({blogs.length})</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: High-End Author / Technical Vector */}
          <div className="relative shrink-0 flex items-center justify-center w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]">
            {/* If you download the specific vector file from your link to /public/illustrations/author.svg, 
                you can simply replace this SVG with: 
                <img src="/illustrations/author.svg" alt="Author Study" className="w-full h-auto drop-shadow-lg" />
            */}
            <svg
              viewBox="0 0 400 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto drop-shadow-xl select-none"
            >
              <defs>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F5132" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="bookGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="bookGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>

              {/* Ambient Circular Studio Light */}
              <circle cx="200" cy="160" r="120" fill="currentColor" className="text-primary/5" />

              {/* Work Desk Surface */}
              <rect x="40" y="240" width="320" height="8" rx="4" fill="currentColor" className="text-foreground/20" />
              <rect x="70" y="248" width="6" height="40" rx="3" fill="currentColor" className="text-foreground/15" />
              <rect x="324" y="248" width="6" height="40" rx="3" fill="currentColor" className="text-foreground/15" />

              {/* High-Performance Monitor */}
              <rect x="130" y="90" width="140" height="96" rx="8" fill="currentColor" className="text-card stroke-foreground/15" strokeWidth="2" />
              <rect x="136" y="96" width="128" height="84" rx="4" fill="url(#screenGrad)" />
              
              {/* Code lines on screen */}
              <rect x="144" y="108" width="40" height="4" rx="2" fill="#10B981" />
              <rect x="188" y="108" width="24" height="4" rx="2" fill="#3B82F6" />
              <rect x="144" y="118" width="64" height="3" rx="1.5" fill="currentColor" className="text-foreground/30" />
              <rect x="152" y="126" width="80" height="3" rx="1.5" fill="currentColor" className="text-foreground/30" />
              <rect x="152" y="134" width="50" height="3" rx="1.5" fill="currentColor" className="text-foreground/30" />
              <rect x="144" y="142" width="30" height="3" rx="1.5" fill="currentColor" className="text-foreground/40" />
              <rect x="144" y="154" width="45" height="3.5" rx="1.75" fill="#10B981" />

              {/* Monitor Stand */}
              <path d="M195 186H205V230H195V186Z" fill="currentColor" className="text-foreground/25" />
              <rect x="180" y="230" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/30" />

              {/* Modern Mechanical Keyboard & Trackpad */}
              <rect x="150" y="236" width="65" height="4" rx="2" fill="currentColor" className="text-foreground/40" />
              <rect x="225" y="236" width="24" height="3" rx="1.5" fill="currentColor" className="text-foreground/25" />

              {/* Research & Engineering Books Stack (Library theme) */}
              {/* Book 1 (Bottom) */}
              <rect x="65" y="228" width="60" height="12" rx="2" fill="url(#bookGrad2)" />
              <rect x="67" y="231" width="12" height="6" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              {/* Book 2 (Middle) */}
              <rect x="68" y="215" width="55" height="13" rx="2" fill="url(#bookGrad1)" />
              <rect x="71" y="218" width="40" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
              {/* Book 3 (Top - Open Note) */}
              <path d="M72 204C82 201 92 206 95 208C98 206 108 201 118 204V215C108 212 98 217 95 218C92 217 82 212 72 215V204Z" fill="currentColor" className="text-card stroke-foreground/20" strokeWidth="1.5" />

              {/* Ceramic Coffee Mug */}
              <rect x="280" y="222" width="16" height="18" rx="3" fill="currentColor" className="text-foreground/30" />
              <path d="M296 226C299 226 301 228 301 231C301 234 299 236 296 236" stroke="currentColor" className="text-foreground/30" strokeWidth="2" strokeLinecap="round" />
              {/* Steam waves */}
              <path d="M285 216C285 213 288 212 288 209" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
              <path d="M291 214C291 211 294 210 294 207" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />

              {/* Floating Engineering Badges */}
              {/* Badge 1: Code Tag < /> */}
              <g className="animate-bounce" style={{ animationDuration: "3.5s" }}>
                <rect x="80" y="110" width="38" height="38" rx="12" fill="currentColor" className="text-card stroke-primary/30" strokeWidth="1.5" />
                <path d="M94 125L88 129L94 133" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M104 125L110 129L104 133" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Badge 2: Git / Knowledge Node */}
              <g className="animate-bounce" style={{ animationDuration: "4.5s" }}>
                <rect x="285" y="130" width="36" height="36" rx="12" fill="currentColor" className="text-card stroke-blue-500/30" strokeWidth="1.5" />
                <circle cx="303" cy="143" r="3" fill="#3B82F6" />
                <circle cx="303" cy="153" r="3" fill="#3B82F6" />
                <path d="M303 146V150" stroke="#3B82F6" strokeWidth="1.5" />
              </g>

              {/* Floating Ideas & Sparkles */}
              <circle cx="120" cy="75" r="2.5" fill="#10B981" fillOpacity="0.8" />
              <circle cx="280" cy="95" r="3.5" fill="#F59E0B" fillOpacity="0.8" />
              <circle cx="225" cy="50" r="2" fill="#3B82F6" fillOpacity="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── 2. PERFORMANCE METRIC CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Publications */}
        <div className="p-5 rounded-2xl bg-card border border-foreground/5 hover:border-primary/20 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9  text-primary flex items-center justify-center">
              <FileText size={22} />
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
            <div className="w-9 h-9 text-blue-500 flex items-center justify-center">
              <Eye size={22} />
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
            <div className="w-9 h-9  text-red-500 flex items-center justify-center">
              <Heart size={22} />
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
            <div className="w-9 h-9  text-emerald-500 flex items-center justify-center">
              <TrendingUp size={22} />
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

      {/* ─── 3. TOPIC QUICK-START ─────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-foreground/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* <Sparkles size={14} className="text-primary" /> */}
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide font-mono">
                Quick Category Starter
              </h2>
            </div>
            <p className="text-xs text-foreground/60">
              Select a domain to start drafting an article under that technical track:
            </p>
          </div>

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