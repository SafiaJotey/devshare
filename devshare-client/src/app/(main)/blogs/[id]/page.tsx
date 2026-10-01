"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Terminal,
  Loader2,
  Heart,
  Send,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// Components
import WriteCTA from "@/components/shared/WriteCTA";
import ReadyToContribute from "@/components/shared/ReadyToContribute";
import Card, { Post } from "@/components/shared/Card";
import Section from "@/components/shared/Section";
import {
  getBlogByIdApi,
  IBlog,
  toggleLikeApi,
  toggleSaveApi,
  addCommentApi,
  deleteCommentApi,
  getBlogInteractionStateApi,
  getRelatedBlogsApi,
  IBlogComment,
} from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

// Fallback Mock data for static demo ID
const FALLBACK_POST = {
  id: 1,
  title: "Deep Dive: How React 19's Actions Will Simplify Form Handling",
  description:
    "An in-depth exploration of the new 'useActionState' hook and why the future of forms is moving back to the platform.",
  author: "Arjun Sharma",
  authorRole: "Senior Frontend Engineer",
  date: "Oct 24, 2023",
  tag: "Frontend",
  readTime: "8 min read",
  image:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
  avatar: "https://i.pravatar.cc/150?u=arjun",
};

// TOC item derived from headings
interface TocItem {
  id: string;
  text: string;
  level: "h2" | "h3";
}

// ─── Comments Section ─────────────────────────────────────────────────────────

interface CommentsSectionProps {
  blogId: string;
  initialComments: IBlogComment[];
  currentUserId?: string;
}

const CommentsSection = ({
  blogId,
  initialComments,
  currentUserId,
}: CommentsSectionProps) => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<IBlogComment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when parent re-fetches
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast.error("Sign in to join the discussion");
      router.push("/auth");
      return;
    }
    const trimmed = newComment.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) {
      toast.error("Comment must be under 1000 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addCommentApi(blogId, trimmed);
      if (res.success && res.data) {
        setComments(res.data);
        setNewComment("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        toast.success("Comment posted!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const res = await deleteCommentApi(blogId, commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Comment deleted");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="discussion" className="mt-20 pt-12 border-t border-foreground/5">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare size={22} className="text-accent" />
        <h2 className="text-2xl font-bold text-foreground">
          Discussion{" "}
          <span className="text-foreground/40 font-normal text-base ml-1">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Comment Input */}
      <div className="mb-10 p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/8">
        {isLoggedIn && user ? (
          <div className="flex items-start gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-foreground/10 shrink-0 mt-0.5">
              <Image
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                }
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={autoResize}
                placeholder="Share your thoughts, questions, or insights..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/30 resize-none outline-none min-h-[60px] leading-relaxed"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-foreground/5">
                <span className="text-[11px] text-foreground/30 font-mono">
                  Ctrl+Enter to post
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-foreground/50 mb-3">
              Join the conversation — sign in to comment
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Sign in to comment
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-16 text-foreground/30">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No comments yet. Be the first to spark the discussion!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 group/comment"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-foreground/10 shrink-0 mt-0.5">
                <Image
                  src={
                    comment.userAvatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userName)}`
                  }
                  alt={comment.userName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-sm font-bold text-foreground">
                    {comment.userName}
                  </span>
                  <span className="text-[11px] text-foreground/40 font-mono">
                    {formatDate(comment.createdAt)}
                  </span>
                  {(comment.userId === currentUserId) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="ml-auto opacity-0 group-hover/comment:opacity-100 transition-opacity text-foreground/30 hover:text-red-500 p-1 rounded-lg"
                      title="Delete comment"
                    >
                      {deletingId === comment.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── BlogDetails ──────────────────────────────────────────────────────────────

export default function BlogDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { isLoggedIn, user } = useAuth();

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completion, setCompletion] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  // Sidebar interactions
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Table of contents
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Comments
  const [comments, setComments] = useState<IBlogComment[]>([]);

  const fetchedIdRef = useRef<string | null>(null);

  // ─── Fetch blog ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      if (id === "1") {
        setIsLoading(false);
        return;
      }

      if (fetchedIdRef.current === id) return;
      fetchedIdRef.current = id;

      try {
        const response = await getBlogByIdApi(id);
        if (response.success && response.data) {
          const fetchedBlog = response.data;
          setBlog(fetchedBlog);
          setLikesCount(fetchedBlog.likes || 0);
          setComments((fetchedBlog as any).comments || []);

          // Fetch related posts
          if (fetchedBlog.category) {
            getRelatedBlogsApi(fetchedBlog._id, fetchedBlog.category, 3)
              .then((res) => {
                if (res.success && res.data) {
                  setRelatedPosts(
                    res.data.map((b) => ({
                      id: b._id,
                      title: b.title,
                      author: b.author?.name || "Anonymous",
                      tag: b.category,
                      readTime: b.readTime,
                      image: b.coverImage || "",
                      avatar: b.author?.avatar || "",
                      slug: b.slug,
                    }))
                  );
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.warn("Could not fetch article dynamically", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ─── Fetch interaction state for logged-in user ──────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !id || id === "1") return;
    getBlogInteractionStateApi(id)
      .then((res) => {
        if (res.success && res.data) {
          setLiked(res.data.liked);
          setSaved(res.data.saved);
          setLikesCount(res.data.likes);
        }
      })
      .catch(() => {});
  }, [isLoggedIn, id]);

  // ─── Build TOC from blocks ───────────────────────────────────────────────────
  useEffect(() => {
    if (!blog?.blocks) return;
    const items: TocItem[] = [];
    blog.blocks.forEach((block) => {
      if (block.type === "h2" || block.type === "h3") {
        const text = block.content?.trim();
        if (text) {
          const tocId = `heading-${block.id}`;
          items.push({ id: tocId, text, level: block.type });
        }
      }
    });
    setTocItems(items);
    if (items.length > 0) setActiveSection(items[0].id);
  }, [blog]);

  // ─── IntersectionObserver for active TOC section ─────────────────────────────
  useEffect(() => {
    if (tocItems.length === 0) return;
    const observers: IntersectionObserver[] = [];

    tocItems.forEach(({ id: tocId }) => {
      const el = document.getElementById(tocId);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(tocId);
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [tocItems]);

  // ─── Scroll progress ─────────────────────────────────────────────────────────
  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  // ─── Interaction handlers ─────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Sign in to like articles");
      router.push("/auth");
      return;
    }
    if (isLiking || id === "1") return;
    setIsLiking(true);
    const prev = liked;
    const prevCount = likesCount;
    // Optimistic update
    setLiked(!prev);
    setLikesCount(prev ? prevCount - 1 : prevCount + 1);
    try {
      const res = await toggleLikeApi(id);
      if (res.success && res.data) {
        setLiked(res.data.liked);
        setLikesCount(res.data.likes);
      }
    } catch (err: any) {
      // Revert
      setLiked(prev);
      setLikesCount(prevCount);
      toast.error(err.message || "Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      toast.error("Sign in to save articles");
      router.push("/auth");
      return;
    }
    if (isSaving || id === "1") return;
    setIsSaving(true);
    const prev = saved;
    setSaved(!prev);
    try {
      const res = await toggleSaveApi(id);
      if (res.success && res.data) {
        setSaved(res.data.saved);
        toast.success(res.data.saved ? "Saved for later!" : "Removed from saved");
      }
    } catch (err: any) {
      setSaved(prev);
      toast.error(err.message || "Failed to update save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `"${title}" - ${window.location.href} via @DevShare`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  const scrollToDiscussion = () => {
    const el = document.getElementById("discussion");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ─── Derived values ─────────────────────────────────────────────────────────
  const title = blog ? blog.title : FALLBACK_POST.title;
  const description = blog ? blog.description : FALLBACK_POST.description;
  const category = blog ? blog.category : FALLBACK_POST.tag;
  const authorName = blog ? blog.author?.name : FALLBACK_POST.author;
  const authorRole = blog
    ? blog.author?.title || "Contributor"
    : FALLBACK_POST.authorRole;
  const authorAvatar = blog?.author?.avatar || FALLBACK_POST.avatar;
  const coverImage = blog
    ? blog.coverImage || FALLBACK_POST.image
    : FALLBACK_POST.image;
  const readTime = blog ? blog.readTime : FALLBACK_POST.readTime;
  const dateFormatted = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : FALLBACK_POST.date;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
          Loading Article...
        </span>
      </div>
    );
  }

  // Helper to slugify heading text into a DOM id
  const getHeadingId = (blockId: string) => `heading-${blockId}`;

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Read progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary/10 z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${completion}%` }}
        />
      </div>

      <nav className="pt-12 pb-10 container-box">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors group w-fit"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Feed</span>
        </Link>
      </nav>

      <article className="container-box">
        {/* 1. POST HEADER */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">
            {category}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-8 leading-[1.1] tracking-tight text-foreground break-words whitespace-pre-wrap">
            {title}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed mb-10 break-words whitespace-pre-wrap">
            {description}
          </p>

          <div className="flex items-center justify-center gap-6 pt-8 border-t border-foreground/5">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-foreground/10 shrink-0">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{authorName}</p>
                <p className="text-xs text-foreground/50">{authorRole}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div className="flex gap-4 text-foreground/50 text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {dateFormatted}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {readTime}
              </span>
            </div>
            {/* Quick like count in header */}
            <div className="h-8 w-px bg-foreground/10" />
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-all ${
                liked
                  ? "text-red-500"
                  : "text-foreground/40 hover:text-red-500"
              }`}
            >
              <Heart
                size={15}
                className={`transition-transform ${liked ? "fill-red-500 scale-110" : ""}`}
              />
              <span className="font-mono">{likesCount}</span>
            </button>
          </div>
        </header>

        {/* 2. FEATURE COVER IMAGE */}
        {coverImage && (
          <div className="aspect-[21/9] relative rounded-[2rem] overflow-hidden mb-20 shadow-2xl border border-foreground/5">
            <Image
              src={coverImage}
              alt="Cover"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* 3. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-20">
          {/* MAIN PROSE */}
          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-primary">
            {blog && blog.blocks && blog.blocks.length > 0 ? (
              blog.blocks.map((block) => {
                const headingId = getHeadingId(block.id);
                switch (block.type) {
                  case "h2":
                    return (
                      <h2
                        key={block.id}
                        id={headingId}
                        className="text-3xl font-bold mt-12 mb-6 text-foreground break-words scroll-mt-28"
                      >
                        {block.content}
                      </h2>
                    );

                  case "h3":
                    return (
                      <h3
                        key={block.id}
                        id={headingId}
                        className="text-2xl font-bold mt-10 mb-4 text-foreground break-words scroll-mt-28"
                      >
                        {block.content}
                      </h3>
                    );

                  case "h4":
                  case "h5":
                  case "h6":
                    return (
                      <h4
                        key={block.id}
                        className="text-xl font-semibold mt-8 mb-3 text-foreground break-words scroll-mt-28"
                      >
                        {block.content}
                      </h4>
                    );

                  case "p":
                    return (
                      <p
                        key={block.id}
                        className="mb-6 leading-relaxed whitespace-pre-wrap break-words"
                      >
                        {block.content}
                      </p>
                    );

                  case "ul":
                    return (
                      <ul
                        key={block.id}
                        className="list-disc pl-6 mb-6 space-y-1"
                      >
                        {block.content
                          .split("\n")
                          .filter(Boolean)
                          .map((item, i) => (
                            <li
                              key={i}
                              className="text-foreground/80 leading-relaxed"
                            >
                              {item}
                            </li>
                          ))}
                      </ul>
                    );

                  case "ol":
                    return (
                      <ol
                        key={block.id}
                        className="list-decimal pl-6 mb-6 space-y-1"
                      >
                        {block.content
                          .split("\n")
                          .filter(Boolean)
                          .map((item, i) => (
                            <li
                              key={i}
                              className="text-foreground/80 leading-relaxed"
                            >
                              {item}
                            </li>
                          ))}
                      </ol>
                    );

                  case "quote":
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-4 border-accent pl-8 my-12 italic text-2xl font-serif text-foreground/70 leading-relaxed bg-accent/5 py-6 rounded-r-2xl break-words whitespace-pre-wrap"
                      >
                        &quot;{block.content}&quot;
                      </blockquote>
                    );

                  case "code":
                    return (
                      <div
                        key={block.id}
                        className="my-10 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl"
                      >
                        <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/40" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                            <div className="w-3 h-3 rounded-full bg-green-500/40" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                            <Terminal size={12} /> {block.metadata || "snippet.ts"}
                          </div>
                        </div>
                        <pre className="p-6 text-sm overflow-x-auto text-blue-300 font-mono leading-relaxed break-words whitespace-pre-wrap bg-transparent">
                          <code>{block.content}</code>
                        </pre>
                      </div>
                    );

                  case "image":
                    return (
                      <div key={block.id} className="my-12">
                        {block.content && (
                          <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.content}
                              className="w-full h-full object-cover transition-transform hover:scale-[1.02] duration-500"
                              alt="Article Visual"
                            />
                          </div>
                        )}
                      </div>
                    );

                  case "layout":
                    // Render layout blocks inline
                    try {
                      const cols = JSON.parse(block.content);
                      if (Array.isArray(cols)) {
                        return (
                          <div
                            key={block.id}
                            className={`my-8 grid gap-6 ${
                              cols.length === 3
                                ? "grid-cols-1 md:grid-cols-3"
                                : "grid-cols-1 md:grid-cols-2"
                            }`}
                          >
                            {cols.map((col: any) => (
                              <div
                                key={col.id}
                                className="space-y-4 p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5"
                              >
                                {(col.blocks || []).map((subBlock: any) => {
                                  if (!subBlock.content?.trim()) return null;
                                  if (subBlock.type === "p")
                                    return (
                                      <p
                                        key={subBlock.id}
                                        className="text-sm text-foreground/80 leading-relaxed"
                                      >
                                        {subBlock.content}
                                      </p>
                                    );
                                  if (
                                    ["h2", "h3", "h4"].includes(subBlock.type)
                                  )
                                    return (
                                      <h3
                                        key={subBlock.id}
                                        className="font-bold text-foreground text-lg"
                                      >
                                        {subBlock.content}
                                      </h3>
                                    );
                                  if (subBlock.type === "code")
                                    return (
                                      <pre
                                        key={subBlock.id}
                                        className="text-xs p-3 bg-[#0d1117] text-blue-300 rounded-lg overflow-x-auto font-mono"
                                      >
                                        <code>{subBlock.content}</code>
                                      </pre>
                                    );
                                  return null;
                                })}
                              </div>
                            ))}
                          </div>
                        );
                      }
                    } catch {}
                    return null;

                  default:
                    return null;
                }
              })
            ) : (
              // Static Fallback prose if no blocks
              <>
                <p>
                  React 19 is introducing a paradigm shift in how we handle
                  side effects in forms. The new{" "}
                  <code>useActionState</code> (formerly{" "}
                  <code>useFormState</code>) hook streamlines the bridge
                  between client-side UI and server-side logic.
                </p>

                <h2
                  id="heading-fallback-1"
                  className="text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-28"
                >
                  The Problem with Traditional Forms
                </h2>
                <p>
                  Until now, developers had to manually manage{" "}
                  <code>isLoading</code>, <code>isError</code>, and{" "}
                  <code>data</code> states. This led to boilerplate-heavy
                  components that were prone to synchronization bugs.
                </p>

                <div className="my-10 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl">
                  <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/40" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                      <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                      <Terminal size={12} /> action.ts
                    </div>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto text-blue-300 font-mono leading-relaxed">
                    {`const [state, formAction] = useActionState(
  async (prevState, formData) => {
    const result = await updateProfile(formData);
    return result;
  },
  { name: "", email: "" }
);`}
                  </pre>
                </div>

                <h2
                  id="heading-fallback-2"
                  className="text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-28"
                >
                  Why this matters
                </h2>
                <p>
                  By treating form submissions as &quot;Actions,&quot; React
                  can automatically handle the transition period, meaning you
                  no longer need to wrap your fetch calls in{" "}
                  <code>startTransition</code> manually.
                </p>

                <blockquote className="border-l-4 border-accent pl-8 my-12 italic text-2xl font-serif text-foreground/70 leading-relaxed">
                  &quot;The best code is the code that feels like the platform
                  it&apos;s built upon.&quot;
                </blockquote>
              </>
            )}

            {/* Comments Section embedded in prose column */}
            {blog && (
              <CommentsSection
                blogId={blog._id}
                initialComments={comments}
                currentUserId={user?._id}
              />
            )}
          </div>

          {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
          <aside className="hidden lg:block space-y-10">
            <div className="sticky top-28 space-y-8">
              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                {/* Save for Later */}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-3 text-sm font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-60 ${
                    saved
                      ? "bg-primary text-primary-foreground shadow-primary/20"
                      : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20"
                  }`}
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : saved ? (
                    <BookmarkCheck size={18} />
                  ) : (
                    <Bookmark size={18} />
                  )}
                  {saved ? "Saved!" : "Save for later"}
                </button>

                {/* Social share row */}
                <div className="flex gap-2">
                  {/* Like */}
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex-1 flex items-center justify-center gap-1.5 border py-3 rounded-xl transition-all font-mono text-xs font-bold ${
                      liked
                        ? "border-red-500/30 text-red-500 bg-red-500/5"
                        : "border-foreground/10 text-foreground/60 hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/5"
                    }`}
                    title="Like this article"
                  >
                    {isLiking ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Heart
                        size={14}
                        className={liked ? "fill-red-500" : ""}
                      />
                    )}
                    {likesCount > 0 && <span>{likesCount}</span>}
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={shareOnTwitter}
                    className="flex-1 flex items-center justify-center border border-foreground/10 py-3 rounded-xl hover:bg-foreground/5 hover:border-sky-400/30 hover:text-sky-400 transition-colors"
                    title="Share on Twitter / X"
                  >
                    <Twitter size={16} />
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex-1 flex items-center justify-center border border-foreground/10 py-3 rounded-xl hover:bg-foreground/5 hover:border-blue-500/30 hover:text-blue-500 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={16} />
                  </button>

                  {/* Copy link */}
                  <button
                    onClick={handleCopyLink}
                    className={`flex-1 flex items-center justify-center border py-3 rounded-xl transition-all ${
                      copied
                        ? "border-green-500/30 text-green-500 bg-green-500/5"
                        : "border-foreground/10 hover:bg-foreground/5 text-foreground/60"
                    }`}
                    title="Copy article link"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              {tocItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    On this page
                  </h4>
                  <nav>
                    <ul className="space-y-1">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(item.id);
                              if (el) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }
                            }}
                            className={`block text-sm py-1 transition-all border-l-2 ${
                              item.level === "h3" ? "pl-4" : "pl-3"
                            } ${
                              activeSection === item.id
                                ? "border-accent text-foreground font-semibold"
                                : "border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20"
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Join Discussion CTA */}
              <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-2.5 text-accent">
                  <MessageSquare size={18} />
                  <span className="font-bold text-sm">Join the debate</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                  {comments.length > 0
                    ? `${comments.length} developer${comments.length > 1 ? "s" : ""} already sharing thoughts. Jump in!`
                    : "What do you think about this article? Share your thoughts with the DevShare community."}
                </p>
                <button
                  onClick={scrollToDiscussion}
                  className="text-xs font-bold underline underline-offset-4 hover:text-accent transition-colors"
                >
                  {comments.length > 0
                    ? `View ${comments.length} comment${comments.length > 1 ? "s" : ""}`
                    : "Join Discussion"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Related Articles */}
      <Section
        variant="colorful"
        tag="More Insights"
        title={
          <>
            Continue your{" "}
            <span className="text-primary italic">learning journey.</span>
          </>
        }
        linkText="Explore all articles"
        linkHref="/blogs"
        className="mt-32 border-t border-foreground/5 pt-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {(relatedPosts.length > 0
            ? relatedPosts
            : [
                {
                  id: 2,
                  title: "Building Scalable Microservices with Go and gRPC",
                  author: "Sarah Chen",
                  tag: "Backend",
                  readTime: "12 min",
                  image:
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2026",
                  avatar: "https://i.pravatar.cc/150?u=sarah",
                },
                {
                  id: 4,
                  title:
                    "Implementing Vector Search in PostgreSQL for AI Apps",
                  author: "Elena Rodriguez",
                  tag: "AI & Data",
                  readTime: "15 min",
                  image:
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
                  avatar: "https://i.pravatar.cc/150?u=elena",
                },
                {
                  id: 5,
                  title: "Mastering CSS Grid: Building Complex Layouts",
                  author: "James Wilson",
                  tag: "Frontend",
                  readTime: "6 min",
                  image:
                    "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070",
                  avatar: "https://i.pravatar.cc/150?u=james",
                },
              ]
          ).map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${(post as any).slug || post.id}`}
            >
              <Card post={post} />
            </Link>
          ))}
        </div>
      </Section>

      <div className="mt-32">
        <ReadyToContribute />
      </div>
      <WriteCTA />
    </main>
  );
}