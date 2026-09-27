"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Eye,
  Heart,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Globe,
  Share2,
  Bookmark,
  Search,
  Check,
  Award,
  Layers,
  Monitor,
  Server,
  Zap,
  Cpu,
  Shield,
  ExternalLink,
  Mail,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── TYPES ───────────────────────────────────────────────────────────
interface IAuthor {
  name: string;
  username: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  website: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  skills: string[];
  stats: {
    totalArticles: number;
    totalViews: number;
    totalLikes: number;
    followers: number;
  };
}

interface IAuthorArticle {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  readTime: string;
  category: "Frontend" | "Backend" | "DevOps" | "AI & Data" | "Security";
  views: number;
  likes: number;
  featured?: boolean;
}

// ─── MOCK DATA ───────────────────────────────────────────────────────
const MOCK_AUTHOR: IAuthor = {
  name: "Alex Sterling",
  username: "asterling",
  title: "Principal Distributed Systems Engineer",
  company: "CloudNative Labs",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  bio: "Writing about resilient backend microservices, high-throughput message brokers, and distributed caching in Go and Rust. Advocate for open telemetry and zero-trust infrastructure.",
  location: "San Francisco, CA (Remote)",
  joinedDate: "Member since Jan 2024",
  website: "https://asterling.dev",
  socials: {
    github: "https://github.com",
    twitter: "https://x.com",
    linkedin: "https://linkedin.com",
  },
  skills: [
    "Distributed Systems",
    "Go",
    "Rust",
    "Kubernetes",
    "Kafka",
    "PostgreSQL",
    "Next.js 15",
    "Zero-Trust",
  ],
  stats: {
    totalArticles: 24,
    totalViews: 384500,
    totalLikes: 14200,
    followers: 3890,
  },
};

const MOCK_ARTICLES: IAuthorArticle[] = [
  {
    id: "1",
    title: "Architecting a Multi-Region Distributed Cache with Raft Consensus",
    description:
      "A deep dive into partition tolerance, consensus leader elections, and minimizing replication lag across transatlantic AWS regions.",
    slug: "architecting-multi-region-distributed-cache",
    publishedAt: "Oct 12, 2025",
    readTime: "9 min read",
    category: "Backend",
    views: 84200,
    likes: 3100,
    featured: true,
  },
  {
    id: "2",
    title: "Zero-Allocation JSON Parsing in High-Throughput Go Microservices",
    description:
      "How to avoid garbage collector latency spikes by leveraging buffer pooling and unsafe pointer memory manipulation under heavy load.",
    slug: "zero-allocation-json-parsing-go",
    publishedAt: "Sep 28, 2025",
    readTime: "6 min read",
    category: "Backend",
    views: 42100,
    likes: 1840,
  },
  {
    id: "3",
    title: "Building Deterministic State Machines for Edge IoT Devices in Rust",
    description:
      "Handling sporadic disconnects and unreliable sensory inputs without running out of constrained SRAM allocations.",
    slug: "deterministic-state-machines-edge-rust",
    publishedAt: "Aug 15, 2025",
    readTime: "11 min read",
    category: "DevOps",
    views: 31800,
    likes: 1240,
  },
  {
    id: "4",
    title: "Modern Next.js 15 Partial Prerendering (PPR) Architecture Patterns",
    description:
      "A practical case study combining static shell CDN distribution with streaming dynamic islands for authenticated developer portals.",
    slug: "nextjs-15-ppr-architecture-patterns",
    publishedAt: "Jul 02, 2025",
    readTime: "7 min read",
    category: "Frontend",
    views: 65400,
    likes: 2980,
  },
];

const CATEGORY_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Frontend: { icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
  Backend: { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  DevOps: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  "AI & Data": { icon: Cpu, color: "text-amber-500", bg: "bg-amber-500/10" },
  Security: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function AuthorDetailsPage() {
  const [author] = useState<IAuthor>(MOCK_AUTHOR);
  const [articles] = useState<IAuthorArticle[]>(MOCK_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtered publications
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const categories = ["All", "Backend", "Frontend", "DevOps", "AI & Data"];

  return (
    <div className="min-h-screen pb-20 animate-in fade-in-50 duration-500">
      {/* ─── 1. AMBIENT HERO BANNER ────────────────────────────────────────── */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-foreground/[0.08] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent">
        {/* Subtle generative tech grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Ambient glow flare */}
        <div className="pointer-events-none absolute -right-10 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ─── 2. AUTHOR IDENTITY BAR (OVERLAPPING BANNER) ─────────────────── */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-foreground/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar with Verified Ring */}
            <div className="relative">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl p-1 bg-background border-2 border-foreground/10 shadow-xl overflow-hidden">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-full w-full object-cover rounded-[22px]"
                />
              </div>
              <div
                className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center shadow-md"
                title="Verified Technical Contributor"
              >
                <CheckCircle2 size={15} strokeWidth={2.5} />
              </div>
            </div>

            {/* Author Name & Handle */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {author.name}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Staff Author
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-foreground/50">
                @{author.username} &bull;{" "}
                <span className="text-foreground/80">{author.title}</span> at{" "}
                <span className="font-semibold text-foreground">
                  {author.company}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Follow & Share */}
          <div className="flex items-center gap-2.5 self-start sm:self-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9.5 px-3.5 rounded-xl border-foreground/10 bg-background/80 hover:bg-foreground/5 text-xs text-foreground/80 cursor-pointer transition-all"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="mr-1.5 text-primary" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="mr-1.5 opacity-60" />
                  <span>Share</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              size="sm"
              className={`h-9.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                isFollowing
                  ? "bg-foreground/10 text-foreground hover:bg-foreground/15 border border-foreground/10"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={14} className="mr-1.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1.5" />
                  <span>Follow Author</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ─── 3. BIO & METADATA CHIPS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-normal">
              {author.bio}
            </p>

            {/* Author Meta Details */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-foreground/50 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-foreground/40" />
                {author.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-foreground/40" />
                {author.joinedDate}
              </span>
              <a
                href={author.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                <Globe size={13} />
                {author.website.replace("https://", "")}
              </a>
            </div>

            {/* Core Tech Stack Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground/40 block mb-2">
                Specialized Domains & Stacks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {author.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] text-xs font-mono font-medium text-foreground/70"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Articles
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {author.stats.totalArticles}
                </h4>
                <span className="text-[11px] text-foreground/40 font-mono">live</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Total Reads
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(author.stats.totalViews)}
                </h4>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Appreciation
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(author.stats.totalLikes)}
                </h4>
                <span className="text-[11px] text-red-500 font-mono">likes</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Community
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(author.stats.followers)}
                </h4>
                <span className="text-[11px] text-foreground/40 font-mono">peers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. MAIN WORKSPACE: PUBLICATIONS + SIDEBAR ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Filterable Publications List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Bar: Category Tabs & Article Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-foreground/[0.08]">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-foreground/[0.03] text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* In-author Search */}
              <div className="relative min-w-[200px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] focus:border-primary/40 focus:outline-none transition-all placeholder:text-foreground/40 text-foreground"
                />
              </div>
            </div>

            {/* Articles List */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => {
                  const CategoryConfig =
                    CATEGORY_MAP[article.category] || {
                      icon: Layers,
                      color: "text-foreground",
                      bg: "bg-foreground/5",
                    };
                  const CategoryIcon = CategoryConfig.icon;

                  return (
                    <article
                      key={article.id}
                      className="group relative p-5 sm:p-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.03] hover:border-primary/30 transition-all duration-300 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${CategoryConfig.bg} ${CategoryConfig.color}`}
                        >
                          <CategoryIcon size={11} />
                          {article.category}
                        </span>

                        <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1">
                          <Clock size={11} />
                          {article.readTime}
                        </span>

                        <span className="text-[11px] font-mono text-foreground/30">
                          &bull; {article.publishedAt}
                        </span>
                      </div>

                      <Link href={`/blogs/${article.slug}`}>
                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-2 mb-1.5">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-foreground/65 line-clamp-2 leading-relaxed mb-4">
                        {article.description}
                      </p>

                      {/* Footer telemetry */}
                      <div className="flex items-center justify-between border-t border-foreground/[0.06] pt-3 text-xs font-mono text-foreground/50">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <Eye size={13} className="text-blue-500" />
                            {formatNumber(article.views)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={13} className="text-red-500" />
                            {formatNumber(article.likes)}
                          </span>
                        </div>

                        <Link
                          href={`/blogs/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
                        >
                          <span>Read Deep-Dive</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.01]">
                <p className="text-sm font-semibold text-foreground/70">
                  No matching publications found
                </p>
                <p className="text-xs text-foreground/40 mt-1">
                  Try adjusting your search keyword or selected category tab.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT 1 COLUMN: SIDEBAR (Credentials, Newsletter, Pinned) */}
          <div className="space-y-6">
            {/* Pinned Top-Read Story */}
            <div className="p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-semibold mb-2">
                <Sparkles size={13} />
                <span>Featured Masterpiece</span>
              </div>
              <h4 className="font-bold text-sm text-foreground mb-1.5 line-clamp-2">
                Architecting a Multi-Region Distributed Cache with Raft Consensus
              </h4>
              <p className="text-xs text-foreground/60 line-clamp-2 mb-3">
                Over 84k engineers read this breakdown on partition tolerance.
              </p>
              <Link
                href="/blogs/architecting-multi-region-distributed-cache"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Read Reference Guide</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            {/* Author Verified Credentials */}
            <div className="p-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-1.5">
                <Award size={14} className="text-primary" />
                <span>Community Accolades</span>
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Top 1% Distributed Systems Author
                    </h5>
                    <p className="text-[11px] text-foreground/50">
                      Ranked by dev community bookmarks and algorithmic impact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Peer Reviewer & Code Mentor
                    </h5>
                    <p className="text-[11px] text-foreground/50">
                      Authored 15+ community architectural blueprints.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Dispatch Newsletter */}
            <div className="p-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <h4 className="text-sm font-bold text-foreground">
                  Subscribe to {author.name}&apos;s Dispatches
                </h4>
              </div>

              <p className="text-xs text-foreground/60 leading-relaxed">
                Receive notifications whenever Alex publishes a new architecture breakdown or code walkthrough.
              </p>

              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="engineer@company.com"
                  className="w-full h-9 px-3 rounded-xl bg-background border border-foreground/10 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary/40 focus:outline-none"
                />
                <Button className="w-full h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer">
                  Join 3.8k Subscribers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}