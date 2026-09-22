"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Hash,
  Monitor,
  Server,
  Cpu,
  Shield,
  Zap,
  RefreshCw,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { getMyBlogsApi, deleteBlogApi, IBlog, IPaginationMeta } from "@/lib/api";

// --- Category Config for Badges & Icons ---
const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Frontend: { icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
  Backend: { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  DevOps: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  "AI & Data": { icon: Cpu, color: "text-accent", bg: "bg-accent/10" },
  Security: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function MyBlogsDashboard() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyBlogs = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const res = await getMyBlogsApi({
          status: statusFilter !== "All" ? statusFilter : undefined,
          search: search.trim() || undefined,
          page,
          limit: 10,
        });

        if (res.success && res.data) {
          setBlogs(res.data);
          if (res.meta) {
            setMeta(res.meta);
          }
        }
      } catch (err: any) {
        console.warn("Could not load workspace publications:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [statusFilter, search, page]
  );

  // Debounced search & filter load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMyBlogs();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchMyBlogs]);

  const handleDelete = async (blogId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(blogId);
    const toastId = toast.loading("Deleting publication...");

    try {
      const res = await deleteBlogApi(blogId);
      if (res.success) {
        toast.success("Publication deleted successfully", { id: toastId });
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
        setMeta((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
      } else {
        throw new Error(res.message || "Failed to delete publication");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete publication", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
            <Hash size={12} /> Workspace / Content_Manager
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
            My Publications
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchMyBlogs(true)}
            disabled={isRefreshing || isLoading}
            className="rounded-xl text-foreground/40 hover:text-primary transition-colors disabled:opacity-50"
            title="Refresh publications"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin text-primary" : ""}
            />
          </Button>
          <Link href="/dashboard/create-blog">
            <Button className="bg-primary text-white rounded-xl gap-2 h-12 px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              <Plus size={20} /> Write New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. SEARCH & FILTER ACTION BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <Input
            placeholder="Search your records by title or description..."
            className="pl-12 h-14 bg-foreground/[0.02] border-foreground/5 rounded-2xl focus-visible:ring-primary/20 text-md font-medium transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className={`h-14 px-6 rounded-2xl border-foreground/10 font-bold uppercase tracking-widest text-[10px] gap-3 transition-all ${
            showFilters
              ? "bg-foreground text-background border-foreground"
              : ""
          }`}
        >
          <ListFilter size={18} />
          {showFilters ? "Close Filters" : "Advanced Filters"}
        </Button>
      </div>

      {/* 3. EXPANDABLE FILTER DRAWER */}
      {showFilters && (
        <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
              <CheckCircle2 size={12} /> Lifecycle Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "Published", "Draft", "Archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl border text-[11px] font-bold transition-colors ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-foreground/10 hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
              Active Count
            </label>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Showing {blogs.length} records of {meta.total} total publications in your workspace account.
            </p>
          </div>
        </div>
      )}

      {/* 4. DATA LEDGER TABLE */}
      <div className="bg-background border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-foreground/[0.02]">
        <Table>
          <TableHeader className="bg-foreground/[0.02] border-b border-foreground/5">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%] py-6 pl-10 font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                Resource / Title
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                Category
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                Lifecycle
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-center">
                Timeline
              </TableHead>
              <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                Management
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
                      Loading your publications...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => {
                const config =
                  CATEGORY_CONFIG[blog.category] || CATEGORY_CONFIG.Frontend;
                const CategoryIcon = config.icon;
                const updatedDate = blog.updatedAt
                  ? new Date(blog.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Recently";

                return (
                  <TableRow
                    key={blog._id}
                    className="group border-foreground/5 transition-all hover:bg-foreground/[0.01]"
                  >
                    <TableCell className="py-6 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <FileText size={20} />
                        </div>
                        <div className="flex flex-col">
                          <Link
                            href={`/blogs/${blog._id}`}
                            className="font-bold text-foreground group-hover:text-primary transition-colors text-base line-clamp-1"
                          >
                            {blog.title}
                          </Link>
                          <span className="text-[10px] font-mono text-foreground/30 mt-0.5 uppercase tracking-tighter">
                            UID: {blog._id.slice(-8).toUpperCase()} // {blog.readTime || "5 min"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-foreground/5 ${config.bg}`}
                      >
                        <CategoryIcon size={14} className={config.color} />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}
                        >
                          {blog.category}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusIndicator status={blog.status} />
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col items-center gap-1 opacity-60">
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">
                          Last Updated
                        </span>
                        <span className="text-xs font-mono font-bold tracking-tighter">
                          {updatedDate}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-10">
                      <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/blogs/${blog._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary"
                            title="View Public Article"
                          >
                            <Eye size={18} />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl hover:bg-foreground/5"
                            >
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 rounded-2xl border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl"
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground/30 px-3 py-2">
                              Quick Actions
                            </DropdownMenuLabel>
                            <Link href={`/blogs/${blog._id}`}>
                              <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                                <Eye size={16} className="text-primary" /> View
                                Production
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-foreground/5" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(blog._id, blog.title)}
                              disabled={deletingId === blog._id}
                              className="rounded-xl gap-3 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                            >
                              <Trash2 size={16} /> Delete Entry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center mb-4 text-foreground/30">
                      <FileText size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      No publications found
                    </h3>
                    <p className="text-xs text-foreground/50 leading-relaxed mb-6">
                      {search || statusFilter !== "All"
                        ? "No articles matched your current search or status filter."
                        : "You have not authored any articles in your workspace yet."}
                    </p>
                    <Link href="/dashboard/create-blog">
                      <Button className="bg-primary text-white rounded-xl gap-2 px-6 h-11 font-bold shadow-lg shadow-primary/20">
                        <Plus size={16} /> Write Your First Post
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. MODERN PAGINATION */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between mt-12 px-6">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
                Active Index
              </span>
              <span className="text-xs font-mono font-bold">
                {blogs.length > 0
                  ? `01 — ${String(blogs.length).padStart(2, "0")}`
                  : "00 — 00"}{" "}
                <span className="opacity-30">of {meta.total} articles</span>
              </span>
            </div>
            <div className="h-8 w-px bg-foreground/10 hidden md:block" />
            <div className="hidden md:flex gap-1">
              {Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      n === page
                        ? "bg-primary text-white"
                        : "hover:bg-foreground/5"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border-foreground/10 h-11 px-5 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
            >
              <ChevronLeft size={16} className="mr-2" /> Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= (meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border-foreground/10 h-11 px-5 font-black text-[10px] uppercase tracking-widest hover:border-primary transition-all disabled:opacity-30"
            >
              Next <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Status Indicator Component ---
function StatusIndicator({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    Draft: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    Archived: "bg-slate-400 shadow-none",
  };

  const currentStyle = styles[status] || styles.Published;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-2 h-2 rounded-full ${currentStyle} transition-all duration-1000 ${
          status === "Published" ? "animate-pulse" : ""
        }`}
      />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
        {status}
      </span>
    </div>
  );
}