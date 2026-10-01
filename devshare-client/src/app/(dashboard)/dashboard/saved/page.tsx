"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  BookmarkX,
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  Layers,
  Monitor,
  Server,
  Zap,
  Cpu,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getMySavedBlogsApi,
  toggleSaveApi,
  IBlog,
} from "@/lib/api";

const CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "AI/ML", "Security"];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Backend: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DevOps: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "AI/ML": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Security: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function SavedArticlesPage() {
  const [articles, setArticles] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSavedArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMySavedBlogsApi({ limit: 50 });
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load saved articles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedArticles();
  }, [fetchSavedArticles]);

  const handleRemove = async (articleId: string, title: string) => {
    try {
      setRemovingId(articleId);
      await toggleSaveApi(articleId);
      setArticles((prev) => prev.filter((a) => a._id !== articleId));
      toast.success(`Removed "${title}" from saved articles`);
    } catch {
      toast.error("Failed to remove article");
    } finally {
      setRemovingId(null);
    }
  };

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

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ─── 1. HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-foreground/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-widest mb-1.5">
            <Bookmark size={14} className="text-primary fill-primary/20" />
            <span>Personal Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Saved Articles
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            Articles and engineering guides you have saved to read or reference later.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/blogs">
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs cursor-pointer">
              <BookOpen size={14} />
              <span>Explore More Articles</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. SEARCH & CATEGORY FILTER ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-foreground/[0.03] text-foreground/60 hover:bg-foreground/[0.08] hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search saved articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-foreground/30 outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* ─── 3. ARTICLES GRID ─────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-4 space-y-4 animate-pulse"
            >
              <div className="h-40 rounded-xl bg-foreground/5" />
              <div className="h-4 bg-foreground/10 rounded w-1/3" />
              <div className="h-6 bg-foreground/10 rounded w-3/4" />
              <div className="h-12 bg-foreground/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        /* Empty State */
        <div className="py-20 px-4 text-center rounded-3xl border border-dashed border-foreground/10 bg-foreground/[0.01]">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Bookmark size={26} />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {articles.length === 0
              ? "No saved articles yet"
              : "No articles match your search"}
          </h3>
          <p className="text-xs text-foreground/50 max-w-md mx-auto mt-2 mb-6">
            {articles.length === 0
              ? "When browsing the community blog, click the 'Bookmark' icon on any article to save it to your personal reading list."
              : "Try clearing your search query or selecting a different category filter."}
          </p>
          {articles.length === 0 ? (
            <Link href="/blogs">
              <Button size="sm" className="rounded-xl gap-2 font-medium cursor-pointer">
                <BookOpen size={14} />
                <span>Browse Community Articles</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="rounded-xl cursor-pointer"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        /* Grid of Saved Articles */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const categoryBadgeClass =
              CATEGORY_COLORS[article.category] || "bg-foreground/5 text-foreground/70";

            return (
              <div
                key={article._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-foreground/[0.08] bg-background/50 hover:bg-foreground/[0.01] hover:border-foreground/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Article Cover Image */}
                <Link
                  href={`/blogs/${article.slug || article._id}`}
                  className="block aspect-video relative w-full overflow-hidden bg-foreground/5"
                >
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary/40 font-mono text-xs">
                      DevShare Article
                    </div>
                  )}

                  {/* Category Pill */}
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-xs ${categoryBadgeClass}`}
                  >
                    {article.category}
                  </span>

                  {/* Read Time */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-background/80 text-foreground/70 px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1">
                    <Clock size={11} /> {article.readTime || "4 min"}
                  </span>
                </Link>

                {/* Article Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author Meta */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-foreground/5 border border-foreground/10 shrink-0">
                        {article.author?.avatar ? (
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-foreground/50">
                            {article.author?.name?.[0] || "A"}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-foreground/70 truncate">
                        {article.author?.name || "Author"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${article.slug || article._id}`}>
                      <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed">
                      {article.description || "No preview description provided."}
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-foreground/5 flex items-center justify-between">
                    <Link
                      href={`/blogs/${article.slug || article._id}`}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-1.5 transition-all"
                    >
                      <span>Read article</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      disabled={removingId === article._id}
                      onClick={() => handleRemove(article._id!, article.title)}
                      className="text-foreground/40 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Remove from saved articles"
                    >
                      {removingId === article._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <BookmarkX size={14} />
                      )}
                      <span className="text-[11px] hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
