"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { Eye, Rocket, AlertCircle, Edit3, Loader2, Bookmark } from "lucide-react";

import { FixedHeader } from "./_components/FixedHeader";
import { EditorBlock } from "./_components/EditorBlock";
import { Toolbar } from "./_components/Toolbar";
import { PreviewMode } from "./_components/PreviewMode";
import { Block, BlockType } from "./type";
import { useAuth } from "@/providers/auth-provider";
import { createBlogApi, getMyBlogByIdApi, updateBlogApi } from "@/lib/api";

export default function WriteNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn } = useAuth();
  const editId = searchParams.get("edit");

  const [isPreview, setIsPreview] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<"publish" | "draft" | null>(
    null
  );
  const [isLoadingArticle, setIsLoadingArticle] = useState(Boolean(editId));
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [blocks, setBlocks] = useState<Block[]>([
    { id: "init-1", type: "p", content: "" },
  ]);

  useEffect(() => {
    let isCurrent = true;
    if (!editId) {
      setEditingBlogId(null);
      setIsLoadingArticle(false);
      return;
    }

    const loadArticle = async () => {
      setIsLoadingArticle(true);
      try {
        const response = await getMyBlogByIdApi(editId);
        if (!response.success || !response.data) throw new Error(response.message || "Could not load this article");
        if (!isCurrent) return;
        const article = response.data;
        setEditingBlogId(article._id);
        setCategory(article.category);
        setTitle(article.title);
        setDescription(article.description);
        setCoverImage(article.coverImage || "");
        setBlocks(article.blocks.length ? article.blocks : [{ id: "init-1", type: "p", content: "" }]);
      } catch (error) {
        if (!isCurrent) return;
        toast.error(error instanceof Error ? error.message : "Could not load this article");
        router.replace("/dashboard/blogs");
      } finally {
        if (isCurrent) setIsLoadingArticle(false);
      }
    };
    loadArticle();
    return () => { isCurrent = false; };
  }, [editId, router]);

  const hasContentBlock = blocks.some((b) => b.content && b.content.trim().length > 0);
  const isReadyToPublish =
    category !== "" &&
    title.trim().length >= 3 &&
    description.trim().length >= 5 &&
    hasContentBlock;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      metadata: type === "code" ? "index.ts" : "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIdx = items.findIndex((i) => i.id === active.id);
        const newIdx = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }
  };

  const handleSubmit = async (status: "Published" | "Draft") => {
    if (!isLoggedIn) {
      toast.error("Authentication required", {
        description: "Please log in to your developer account before publishing.",
      });
      router.push("/auth");
      return;
    }

    if (!category) {
      toast.error("Missing Category", {
        description: "Please select a technical domain (e.g., Frontend, Backend, AI).",
      });
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      toast.error("Invalid Title", {
        description: "Article title must be at least 3 characters long.",
      });
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      toast.error("Missing Description", {
        description: "Please provide a short summary of your article.",
      });
      return;
    }

    // Filter out completely blank blocks unless it's the only block
    const cleanedBlocks = blocks.filter(
      (b) => b.content && b.content.trim().length > 0
    );

    if (cleanedBlocks.length === 0) {
      toast.error("Empty Content", {
        description: "Please write some content in at least one block before publishing.",
      });
      return;
    }

    const actionType = status === "Published" ? "publish" : "draft";
    setIsSubmitting(actionType);
    const toastId = toast.loading(
      status === "Published"
        ? "Publishing article to DevShare..."
        : "Saving draft..."
    );

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        blocks: cleanedBlocks,
        status,
        coverImage: coverImage.trim() || undefined,
      };
      const response = editingBlogId
        ? await updateBlogApi(editingBlogId, { ...payload, coverImage: coverImage.trim() })
        : await createBlogApi(payload);

      if (response.success && response.data) {
        toast.success(
          status === "Published"
            ? "Article published live! 🚀"
            : "Draft saved successfully! 📝",
          {
            id: toastId,
            description: `"${response.data.title}" has been saved to your workspace.`,
          }
        );

        // Redirect to newly published blog reader or dashboard
        if (status === "Published" && response.data._id) {
          router.push(`/blogs/${response.data.slug || response.data._id}`);
        } else {
          router.push("/dashboard/blogs");
        }
      } else {
        throw new Error(response.message || "Failed to create article");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while publishing.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/45">Loading article editor</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Top action header bar */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/5 h-20">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                isReadyToPublish
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-600"
              }`}
            >
              {isReadyToPublish ? <Rocket size={14} /> : <AlertCircle size={14} />}
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                {isReadyToPublish ? editingBlogId ? "Ready to Update" : "Ready to Publish" : "Incomplete Draft"}
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-foreground/30 font-mono uppercase tracking-widest italic">
              Auto-saved // {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsPreview(!isPreview)}
              className="rounded-xl font-bold h-11 gap-2 hover:bg-foreground/5"
            >
              {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
              {isPreview ? "Edit Mode" : "Preview UI"}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSubmit("Draft")}
              disabled={isSubmitting !== null}
              className="rounded-xl font-bold h-11 px-4 gap-2 border-foreground/10 hover:bg-foreground/5 disabled:opacity-50"
            >
              {isSubmitting === "draft" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Bookmark size={16} />
              )}
              <span className="hidden sm:inline">Save Draft</span>
            </Button>

            <Button
              onClick={() => handleSubmit("Published")}
              disabled={!isReadyToPublish || isSubmitting !== null}
              className="bg-primary text-primary-foreground rounded-xl px-7 h-11 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSubmitting === "publish" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  <span>{editingBlogId ? "Update & Publish" : "Publish Article"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor or Preview Content Container */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        {!isPreview ? (
          <div className="animate-in fade-in duration-500">
            <FixedHeader
              category={category}
              setCategory={setCategory}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              coverImage={coverImage}
              setCoverImage={setCoverImage}
            />

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <EditorBlock
                      key={block.id}
                      block={block}
                      onUpdate={(content: string, metadata?: string) => {
                        setBlocks(
                          blocks.map((b) =>
                            b.id === block.id
                              ? { ...b, content, metadata }
                              : b
                          )
                        );
                      }}
                      onDelete={() => {
                        if (blocks.length > 1) {
                          setBlocks(blocks.filter((b) => b.id !== block.id));
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Toolbar addBlock={addBlock} />
          </div>
        ) : (
          <PreviewMode
            category={category}
            title={title}
            description={description}
            blocks={blocks}
            coverImage={coverImage}
          />
        )}
      </div>
    </div>
  );
}
