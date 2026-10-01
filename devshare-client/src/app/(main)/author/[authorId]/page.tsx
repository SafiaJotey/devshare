"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
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
  Mail,
  UserPlus,
  UserCheck,
  Loader2,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getAuthorDetailsApi,
  IAuthorDetailsResponse,
  IBlog,
} from "@/lib/api";

const CATEGORY_MAP: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  Frontend: {
    icon: Monitor,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  Backend: {
    icon: Server,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  DevOps: {
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  "AI/ML": {
    icon: Cpu,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  Security: {
    icon: Shield,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
};

const CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "AI/ML", "Security"];

export default function AuthorDetailsPage() {
  const params = useParams();
  const authorId = params?.authorId as string;

  const [author, setAuthor] = useState<IAuthorDetailsResponse["author"] | null>(null);
  const [stats, setStats] = useState<IAuthorDetailsResponse["stats"] | null>(null);
  const [articles, setArticles] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!authorId) return;

    let isCancelled = false;
    const fetchAuthor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAuthorDetailsApi(authorId);
        if (!isCancelled && res.success && res.data) {
          setAuthor(res.data.author);
          setStats(res.data.stats);
          setArticles(res.data.articles || []);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to load author profile.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAuthor();
    return () => {
      isCancelled = true;
    };
  }, [authorId]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Profile link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    toast.success(`Subscribed to ${author?.name || "author"}'s publications!`);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 2000);
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

  // Featured top article by views
  const featuredArticle = useMemo(() => {
    if (articles.length === 0) return null;
    return [...articles].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  }, [articles]);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <div className="h-48 sm:h-64 w-full bg-muted/40 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 mb-8 flex items-end gap-5">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-muted animate-pulse" />
            <div className="space-y-2 pb-2">
              <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-72 bg-muted/60 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-24 bg-muted/40 rounded-2xl animate-pulse" />
              <div className="h-40 bg-muted/30 rounded-2xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-muted/40 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <BookOpen size={28} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Contributor Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
          {error || "We couldn't find an author profile matching this ID or username."}
        </p>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={14} />
              Return Home
            </Button>
          </Link>
          <Link href="/blogs">
            <Button size="sm" className="gap-2">
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cleanDomain = author.primaryDomain || "Frontend";
  const domainConfig = CATEGORY_MAP[cleanDomain] || {
    icon: Layers,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  };
  const DomainIcon = domainConfig.icon;

  return (
    <div className="min-h-screen pb-20">
      {/* ─── 1. AMBIENT HERO BANNER ────────────────────────────────────────── */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-foreground/[0.08] bg-gradient-to-r from-primary/15 via-primary/5 to-transparent">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ─── 2. AUTHOR IDENTITY BAR ─────────────────────────────────────── */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-foreground/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar with Verified Ring */}
            <div className="relative shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl p-1 bg-background border-2 border-foreground/10 shadow-xl overflow-hidden flex items-center justify-center">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-full w-full object-cover rounded-[22px]"
                  />
                ) : (
                  <span className="text-3xl font-mono font-bold text-muted-foreground uppercase">
                    {author.name.slice(0, 2)}
                  </span>
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center shadow-md"
                title="Verified Contributor"
              >
                <CheckCircle2 size={15} strokeWidth={2.5} />
              </div>
            </div>

            {/* Author Name & Byline */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {author.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${domainConfig.bg} ${domainConfig.color} ${domainConfig.border}`}
                >
                  <DomainIcon size={12} />
                  {cleanDomain} Contributor
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground/70">
                {author.title || "Technical Contributor"}
              </p>
            </div>
          </div>

          {/* Action Buttons: Share & Follow */}
          <div className="flex items-center gap-2.5 self-start sm:self-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 px-3.5 rounded-xl border-foreground/10 bg-background/80 hover:bg-foreground/5 text-xs text-foreground/80 cursor-pointer transition-all shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="mr-1.5 text-primary" />
                  <span className="text-primary font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="mr-1.5 opacity-60" />
                  <span>Share</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setIsFollowing(!isFollowing);
                toast.success(
                  isFollowing
                    ? `Unfollowed ${author.name}`
                    : `Following ${author.name}`
                );
              }}
              size="sm"
              className={`h-9 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${isFollowing
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
              {author.bio ||
                "Technical contributor on DevShare, publishing articles and engineering insights."}
            </p>

            {/* Author Meta Details */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-foreground/50 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-foreground/40" />
                {author.location || "Global"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-foreground/40" />
                {author.joinedDate}
              </span>
              {author.socialLinks?.website && (
                <a
                  href={
                    author.socialLinks.website.startsWith("http")
                      ? author.socialLinks.website
                      : `https://${author.socialLinks.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe size={13} />
                  {author.socialLinks.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>

            {/* Social Links Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {author.socialLinks?.github && (
                <a
                  href={
                    author.socialLinks.github.startsWith("http")
                      ? author.socialLinks.github
                      : `https://github.com/${author.socialLinks.github.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg border border-foreground/10 bg-muted/40 hover:border-foreground/30 text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium">GitHub</span>
                  <ArrowUpRight size={11} className="opacity-50" />
                </a>
              )}
              {author.socialLinks?.twitter && (
                <a
                  href={
                    author.socialLinks.twitter.startsWith("http")
                      ? author.socialLinks.twitter
                      : `https://x.com/${author.socialLinks.twitter.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg border border-foreground/10 bg-muted/40 hover:border-foreground/30 text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium">X / Twitter</span>
                  <ArrowUpRight size={11} className="opacity-50" />
                </a>
              )}
              {author.socialLinks?.linkedin && (
                <a
                  href={
                    author.socialLinks.linkedin.startsWith("http")
                      ? author.socialLinks.linkedin
                      : `https://linkedin.com/in/${author.socialLinks.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg border border-foreground/10 bg-muted/40 hover:border-foreground/30 text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium">LinkedIn</span>
                  <ArrowUpRight size={11} className="opacity-50" />
                </a>
              )}
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="px-2.5 py-1 rounded-lg border border-foreground/10 bg-muted/40 hover:border-foreground/30 text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Mail size={12} className="opacity-70" />
                  <span className="font-medium">Contact</span>
                </a>
              )}
            </div>

            {/* Core Tech Stack Badges */}
            {author.skills && author.skills.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground/40 block mb-2">
                  Specialized Stack & Technical Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {author.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/20 text-xs font-mono font-medium text-foreground/70 transition-colors"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Articles
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {stats?.totalArticles ?? 0}
                </h4>
                <span className="text-[11px] text-foreground/40 font-mono">shared</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Total Reads
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(stats?.totalViews ?? 0)}
                </h4>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Appreciation
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(stats?.totalLikes ?? 0)}
                </h4>
                <span className="text-[11px] text-red-500 font-mono">likes</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/40">
                Community
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="font-mono text-2xl font-black text-foreground tabular-nums">
                  {formatNumber(stats?.followers ?? 12)}
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
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${selectedCategory === cat
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
                  className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] focus:border-primary/40 focus:outline-none transition-all placeholder:text-foreground/40 text-foreground"
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
                      border: "border-foreground/10",
                    };
                  const CategoryIcon = CategoryConfig.icon;
                  const isSaved = bookmarkedArticles.includes(article._id);
                  const publishedDate = new Date(article.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );

                  return (
                    <article
                      key={article._id}
                      className="group relative p-5 sm:p-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.03] hover:border-primary/30 transition-all duration-200 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${CategoryConfig.bg} ${CategoryConfig.color} ${CategoryConfig.border}`}
                          >
                            <CategoryIcon size={11} />
                            {article.category}
                          </span>

                          <span className="text-[11px] font-mono text-foreground/40 flex items-center gap-1">
                            <Clock size={11} />
                            {article.readTime || "5 min read"}
                          </span>

                          <span className="text-[11px] font-mono text-foreground/30">
                            &bull; {publishedDate}
                          </span>
                        </div>

                        {/* Interactive Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(article._id, e)}
                          className="text-foreground/30 hover:text-foreground p-1 transition-colors cursor-pointer"
                          title={isSaved ? "Saved" : "Save article"}
                        >
                          <Bookmark
                            size={14}
                            className={
                              isSaved ? "fill-primary text-primary" : "stroke-current"
                            }
                          />
                        </button>
                      </div>

                      <Link href={`/blogs/${article.slug || article._id}`}>
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
                            {formatNumber(article.views || 0)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={13} className="text-red-500" />
                            {formatNumber(article.likes || 0)}
                          </span>
                        </div>

                        <Link
                          href={`/blogs/${article.slug || article._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
                        >
                          <span>Read Article</span>
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
                  Try selecting another category or clearing your search term.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT 1 COLUMN: SIDEBAR */}
          <div className="space-y-6">
            {/* Pinned Top-Read Story */}
            {featuredArticle && (
              <div className="p-5 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-semibold mb-2">
                  <Sparkles size={13} />
                  <span>Top Read Publication</span>
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1.5 line-clamp-2">
                  {featuredArticle.title}
                </h4>
                <p className="text-xs text-foreground/60 line-clamp-2 mb-3">
                  {featuredArticle.description}
                </p>
                <Link
                  href={`/blogs/${featuredArticle.slug || featuredArticle._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Read Publication</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            )}

            {/* Author Verified Credentials */}
            <div className="p-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-1.5">
                <Award size={14} className="text-primary" />
                <span>Contributor Recognition</span>
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Verified {cleanDomain} Contributor
                    </h5>
                    <p className="text-[11px] text-foreground/50">
                      Authoring verified technical guides on DevShare.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Open Knowledge Sharing
                    </h5>
                    <p className="text-[11px] text-foreground/50">
                      Active contributor sharing production patterns and code architectures.
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
                  Stay Updated with {author.name}
                </h4>
              </div>

              <p className="text-xs text-foreground/60 leading-relaxed">
                Receive notifications when {author.name} publishes new engineering breakdowns or tutorials.
              </p>

              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>Subscribed! You&apos;ll receive updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="developer@domain.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-background border border-foreground/10 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary/40 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    className="w-full h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer"
                  >
                    Subscribe to Updates
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}