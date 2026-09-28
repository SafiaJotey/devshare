"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  closestCorners,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { Eye, Rocket, AlertCircle, Edit3, Loader2, Bookmark, GripVertical } from "lucide-react";

import { FixedHeader } from "./_components/FixedHeader";
import { EditorBlock } from "./_components/EditorBlock";
import { Toolbar } from "./_components/Toolbar";
import { PreviewMode } from "./_components/PreviewMode";
import { Block, BlockType, ColumnData, ColumnItem } from "./type";
import { useAuth } from "@/providers/auth-provider";
import { createBlogApi, getMyBlogByIdApi, updateBlogApi } from "@/lib/api";

// Simple Preview badge while dragging
const DragItemGhost = ({ item }: { item: Block | ColumnItem | null }) => {
  if (!item) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-background border-2 border-primary/60 shadow-2xl rounded-xl opacity-95 max-w-sm pointer-events-none scale-105 transition-transform">
      <GripVertical size={16} className="text-primary shrink-0" />
      <span className="text-xs font-mono font-bold uppercase text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
        {item.type}
      </span>
      <span className="text-xs text-foreground/80 truncate">
        {item.content ? item.content.slice(0, 40) : "Empty block"}
      </span>
    </div>
  );
};

function WriteNewEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn } = useAuth();
  const editId = searchParams.get("edit");

  const [isPreview, setIsPreview] = useState(false);
  const [activeItem, setActiveItem] = useState<Block | ColumnItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<"publish" | "draft" | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(Boolean(editId));
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [blocks, setBlocks] = useState<Block[]>([
    { id: "init-1", type: "p", content: "" },
  ]);
  const categoryParam = searchParams.get("category");
  const [category, setCategory] = useState(categoryParam || "");

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
        if (!response.success || !response.data)
          throw new Error(response.message || "Could not load this article");
        if (!isCurrent) return;
        const article = response.data;
        setEditingBlogId(article._id);
        setCategory(article.category);
        setTitle(article.title);
        setDescription(article.description);
        setCoverImage(article.coverImage || "");
        setBlocks(
          article.blocks.length
            ? article.blocks
            : [{ id: "init-1", type: "p", content: "" }]
        );
      } catch (error) {
        if (!isCurrent) return;
        toast.error(
          error instanceof Error ? error.message : "Could not load this article"
        );
        router.replace("/dashboard/blogs");
      } finally {
        if (isCurrent) setIsLoadingArticle(false);
      }
    };
    loadArticle();
    return () => {
      isCurrent = false;
    };
  }, [editId, router]);

  useEffect(() => {
    if (!editId && categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam, editId]);

  const hasContentBlock = blocks.some(
    (b) => b.content && b.content.trim().length > 0
  );
  const isReadyToPublish =
    category !== "" &&
    title.trim().length >= 3 &&
    description.trim().length >= 5 &&
    hasContentBlock;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Avoid accidental drags on text editing
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Smooth multi-container collision strategy
  const customCollisionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;
    return closestCorners(args);
  };

  const addBlock = (type: BlockType, metadata?: string, content?: string) => {
    let initialContent = content || "";
    let initialMetadata = metadata || (type === "code" ? "index.ts" : "");

    if (type === "layout" && !initialContent) {
      const colCount = Number(metadata) === 3 ? 3 : 2;
      const defaultCols: ColumnData[] = Array.from(
        { length: colCount },
        (_, i) => ({
          id: `col-${Date.now()}-${i + 1}`,
          blocks: [
            {
              id: `sub-${Date.now()}-${i + 1}-${Math.random().toString(36).slice(2, 6)}`,
              type: "p",
              content: "",
            },
          ],
        })
      );
      initialContent = JSON.stringify(defaultCols);
      initialMetadata = String(colCount);
    }

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      content: initialContent,
      metadata: initialMetadata,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  type LocationInfo =
    | { type: "root"; index: number; block: Block }
    | {
        type: "subBlock";
        layoutIndex: number;
        colIndex: number;
        subIndex: number;
        cols: ColumnData[];
        subBlock: ColumnItem;
      }
    | {
        type: "column";
        layoutIndex: number;
        colIndex: number;
        cols: ColumnData[];
      };

  const findLocation = (id: string, currentBlocks: Block[]): LocationInfo | null => {
    const rootIndex = currentBlocks.findIndex((b) => b.id === id);
    if (rootIndex !== -1) {
      return { type: "root", index: rootIndex, block: currentBlocks[rootIndex] };
    }

    for (let lIdx = 0; lIdx < currentBlocks.length; lIdx++) {
      const blk = currentBlocks[lIdx];
      if (blk.type === "layout" && blk.content) {
        try {
          const cols: ColumnData[] = JSON.parse(blk.content);
          if (Array.isArray(cols)) {
            for (let cIdx = 0; cIdx < cols.length; cIdx++) {
              if (cols[cIdx].id === id) {
                return { type: "column", layoutIndex: lIdx, colIndex: cIdx, cols };
              }
              const sIdx = cols[cIdx].blocks.findIndex((sb) => sb.id === id);
              if (sIdx !== -1) {
                return {
                  type: "subBlock",
                  layoutIndex: lIdx,
                  colIndex: cIdx,
                  subIndex: sIdx,
                  cols,
                  subBlock: cols[cIdx].blocks[sIdx],
                };
              }
            }
          }
        } catch {
          // ignore invalid json
        }
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const location = findLocation(String(event.active.id), blocks);
    if (location?.type === "root") setActiveItem(location.block);
    else if (location?.type === "subBlock") setActiveItem(location.subBlock);
  };

  /**
   * handleDragOver fires continuously while dragging.
   * We use it to give LIVE visual feedback when a root block is hovered
   * over a layout column (or vice-versa), so the drop target highlights
   * immediately — the actual data mutation happens in handleDragEnd.
   */
  const handleDragOver = (event: DragOverEvent) => {
    // No state mutation here: LayoutBlock's useDroppable isOver handles
    // per-column highlighting natively via dnd-kit. This hook is a hook-in
    // point for future animations or cross-container preview.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || active.id === over.id) return;

    // Use a snapshot of blocks at the time drag ended
    setBlocks((currentBlocks) => {
      const source = findLocation(String(active.id), currentBlocks);
      const dest = findLocation(String(over.id), currentBlocks);

      if (!source || !dest) return currentBlocks;

      // 1. Reordering top-level root blocks
      if (source.type === "root" && dest.type === "root") {
        return arrayMove(currentBlocks, source.index, dest.index);
      }

      // 2. Dragging from inside any column -> outside into root
      if (source.type === "subBlock" && dest.type === "root") {
        const movedItem = source.subBlock;
        const newCols = source.cols.map((col, i) =>
          i === source.colIndex
            ? { ...col, blocks: col.blocks.filter((b) => b.id !== movedItem.id) }
            : col
        );

        const next = currentBlocks.map((b, i) =>
          i === source.layoutIndex
            ? { ...b, content: JSON.stringify(newCols) }
            : b
        );

        const newRootBlock: Block = {
          id: movedItem.id,
          type: movedItem.type,
          content: movedItem.content,
          metadata: movedItem.metadata,
        };
        // Insert AFTER the destination root block
        next.splice(dest.index + 1, 0, newRootBlock);
        return next;
      }

      // 3. Dragging from outside (root) -> into any layout column
      if (
        source.type === "root" &&
        (dest.type === "column" || dest.type === "subBlock")
      ) {
        const draggedBlock = source.block;
        if (draggedBlock.type === "layout") return currentBlocks; // No nesting

        const newSubItem: ColumnItem = {
          id: draggedBlock.id,
          type: draggedBlock.type,
          content: draggedBlock.content,
          metadata: draggedBlock.metadata,
        };

        const newCols = dest.cols.map((col, i) => {
          if (i !== dest.colIndex) return col;
          const insertedBlocks =
            dest.type === "column"
              ? [...col.blocks, newSubItem]
              : [
                  ...col.blocks.slice(0, dest.subIndex),
                  newSubItem,
                  ...col.blocks.slice(dest.subIndex),
                ];
          return { ...col, blocks: insertedBlocks };
        });

        // Remove from root, then update the layout block (look up by id, not index)
        const targetLayoutId = currentBlocks[dest.layoutIndex]?.id;
        const withoutDragged = currentBlocks.filter(
          (b) => b.id !== draggedBlock.id
        );
        return withoutDragged.map((b) =>
          b.id === targetLayoutId
            ? { ...b, content: JSON.stringify(newCols) }
            : b
        );
      }

      // 4. Moving within or between layout columns
      if (
        source.type === "subBlock" &&
        (dest.type === "column" || dest.type === "subBlock")
      ) {
        const movedItem = source.subBlock;
        const srcLayoutId = currentBlocks[source.layoutIndex]?.id;
        const dstLayoutId = currentBlocks[dest.layoutIndex]?.id;

        if (srcLayoutId === dstLayoutId) {
          // Same layout: move between columns or reorder within column
          const layoutCols = source.cols.map((col, i) => {
            if (i === source.colIndex) {
              return { ...col, blocks: col.blocks.filter((b) => b.id !== movedItem.id) };
            }
            return col;
          });
          // Now insert into dest column
          const finalCols = layoutCols.map((col, i) => {
            if (i !== dest.colIndex) return col;
            const blocks =
              dest.type === "column"
                ? [...col.blocks, movedItem]
                : [
                    ...col.blocks.slice(0, dest.subIndex),
                    movedItem,
                    ...col.blocks.slice(dest.subIndex),
                  ];
            return { ...col, blocks };
          });
          return currentBlocks.map((b) =>
            b.id === srcLayoutId
              ? { ...b, content: JSON.stringify(finalCols) }
              : b
          );
        } else {
          // Different layouts
          const srcCols = source.cols.map((col, i) =>
            i === source.colIndex
              ? { ...col, blocks: col.blocks.filter((b) => b.id !== movedItem.id) }
              : col
          );
          const dstCols = dest.cols.map((col, i) => {
            if (i !== dest.colIndex) return col;
            const insertedBlocks =
              dest.type === "column"
                ? [...col.blocks, movedItem]
                : [
                    ...col.blocks.slice(0, dest.subIndex),
                    movedItem,
                    ...col.blocks.slice(dest.subIndex),
                  ];
            return { ...col, blocks: insertedBlocks };
          });
          return currentBlocks.map((b) => {
            if (b.id === srcLayoutId) return { ...b, content: JSON.stringify(srcCols) };
            if (b.id === dstLayoutId) return { ...b, content: JSON.stringify(dstCols) };
            return b;
          });
        }
      }

      return currentBlocks;
    });
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
        ? await updateBlogApi(editingBlogId, {
            ...payload,
            coverImage: coverImage.trim(),
          })
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
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/45">
          Loading article editor
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Top Header */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/5 h-20">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                isReadyToPublish
                  ? " border-emerald-500/20 text-emerald-600"
                  : " border-amber-500/20 text-amber-600"
              }`}
            >
              {isReadyToPublish ? <Rocket size={14} /> : <AlertCircle size={14} />}
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                {isReadyToPublish
                  ? editingBlogId
                    ? "Ready to Update"
                    : "Ready to Publish"
                  : "Incomplete Draft"}
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-foreground/30 font-mono uppercase tracking-widest">
              Auto-saved |{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
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

      {/* Editor Content Area */}
      <div className="w-full mx-auto  mt-16">
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
              collisionDetection={customCollisionStrategy}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
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
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === block.id ? { ...b, content, metadata } : b
                          )
                        );
                      }}
                      onTypeChange={(type: BlockType) => {
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === block.id ? { ...b, type } : b
                          )
                        );
                      }}
                      onDelete={() => {
                        if (blocks.length > 1) {
                          setBlocks((prev) => prev.filter((b) => b.id !== block.id));
                        } else {
                          setBlocks([
                            { id: `init-${Date.now()}`, type: "p", content: "" },
                          ]);
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Drag Overlay — renders the ghost at cursor position, eliminates
                  stuttering and visual jumps when moving blocks across containers */}
              <DragOverlay
                dropAnimation={{
                  duration: 180,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
              >
                {activeItem ? <DragItemGhost item={activeItem} /> : null}
              </DragOverlay>
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

export default function WriteNewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-background">
          <Loader2 className="animate-spin text-primary" size={28} />
          <p className="text-xs font-mono uppercase tracking-widest text-foreground/45">
            Loading article editor...
          </p>
        </div>
      }
    >
      <WriteNewEditor />
    </Suspense>
  );
}