"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LayoutGrid,
  Plus,
  Trash2,
  Type,
  Heading,
  Heading2,
  List,
  ListOrdered,
  Terminal,
  Quote,
  ImageIcon,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import { BlockType, ColumnData, ColumnItem } from "../../type";
import { TextBlock } from "./TextBlock";
import { HeadingBlock, HeadingLevel } from "./HeadingBlock";
import { ListBlock } from "./ListBlock";
import { CodeBlock } from "./CodeBlock";
import { QuoteBlock } from "./QuoteBlock";
import { ImageBlock } from "./ImageBlock";

interface SubItemProps {
  subBlock: ColumnItem;
  colIdx: number;
  totalBlocks: number;
  onUpdateSubBlock: (colIdx: number, blockId: string, val: string, meta?: string) => void;
  onChangeSubBlockType: (colIdx: number, blockId: string, newType: BlockType) => void;
  onDeleteSubBlock: (colIdx: number, blockId: string) => void;
}

const SubItem = ({
  subBlock,
  colIdx,
  totalBlocks,
  onUpdateSubBlock,
  onChangeSubBlockType,
  onDeleteSubBlock,
}: SubItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: subBlock.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/sub relative flex items-start gap-1 p-1 rounded-lg hover:bg-foreground/[0.02] transition-colors"
    >
      {/* Drag handle for sub-item */}
      <div
        {...attributes}
        {...listeners}
        className="mt-2.5 cursor-grab opacity-0 group-hover/sub:opacity-100 transition-opacity text-foreground/30 hover:text-foreground shrink-0"
      >
        <GripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        {subBlock.type === "p" && (
          <TextBlock
            content={subBlock.content}
            onUpdate={(val) => onUpdateSubBlock(colIdx, subBlock.id, val)}
          />
        )}
        {["h2", "h3", "h4", "h5", "h6"].includes(subBlock.type) && (
          <HeadingBlock
            type={subBlock.type as HeadingLevel}
            content={subBlock.content}
            onUpdate={(val) => onUpdateSubBlock(colIdx, subBlock.id, val)}
            onTypeChange={(newType) => onChangeSubBlockType(colIdx, subBlock.id, newType)}
          />
        )}
        {(subBlock.type === "ul" || subBlock.type === "ol") && (
          <ListBlock
            type={subBlock.type as "ul" | "ol"}
            content={subBlock.content}
            onUpdate={(val) => onUpdateSubBlock(colIdx, subBlock.id, val)}
            onTypeChange={(newType) => onChangeSubBlockType(colIdx, subBlock.id, newType)}
          />
        )}
        {subBlock.type === "code" && (
          <CodeBlock
            content={subBlock.content}
            metadata={subBlock.metadata}
            onUpdate={(val, meta) => onUpdateSubBlock(colIdx, subBlock.id, val, meta)}
          />
        )}
        {subBlock.type === "quote" && (
          <QuoteBlock
            content={subBlock.content}
            onUpdate={(val) => onUpdateSubBlock(colIdx, subBlock.id, val)}
          />
        )}
        {subBlock.type === "image" && (
          <ImageBlock
            content={subBlock.content}
            onUpdate={(val) => onUpdateSubBlock(colIdx, subBlock.id, val)}
          />
        )}
      </div>

      {totalBlocks > 1 && (
        <button
          type="button"
          onClick={() => onDeleteSubBlock(colIdx, subBlock.id)}
          className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-foreground/30 hover:text-red-500 p-1 mt-1.5 shrink-0"
          title="Remove block"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
};

const DroppableColumn = ({
  col,
  colIdx,
  activePickerCol,
  setActivePickerCol,
  handleAddSubBlock,
  onUpdateSubBlock,
  onChangeSubBlockType,
  onDeleteSubBlock,
}: {
  col: ColumnData;
  colIdx: number;
  activePickerCol: number | null;
  setActivePickerCol: (idx: number | null) => void;
  handleAddSubBlock: (colIdx: number, type: BlockType) => void;
  onUpdateSubBlock: (colIdx: number, blockId: string, val: string, meta?: string) => void;
  onChangeSubBlockType: (colIdx: number, blockId: string, newType: BlockType) => void;
  onDeleteSubBlock: (colIdx: number, blockId: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  // Sub-menu state for heading levels and list types within the picker
  const [expandedSubMenu, setExpandedSubMenu] = useState<"heading" | "list" | null>(null);

  const handlePickerAdd = (type: BlockType) => {
    handleAddSubBlock(colIdx, type);
    setExpandedSubMenu(null);
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border border-dashed p-3 flex flex-col justify-between min-h-40 transition-all duration-150 ${
        isOver
          ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[1.01]"
          : "border-foreground/15 bg-background/50 hover:border-foreground/30"
      }`}
    >
      <SortableContext
        items={col.blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1.5 flex-1 min-h-15">
          {col.blocks.length === 0 ? (
            <div className="h-full min-h-[60px] flex items-center justify-center border border-dashed border-foreground/10 rounded-lg text-foreground/30 text-xs font-mono">
              Drop block here
            </div>
          ) : (
            col.blocks.map((subBlock) => (
              <SubItem
                key={subBlock.id}
                subBlock={subBlock}
                colIdx={colIdx}
                totalBlocks={col.blocks.length}
                onUpdateSubBlock={onUpdateSubBlock}
                onChangeSubBlockType={onChangeSubBlockType}
                onDeleteSubBlock={onDeleteSubBlock}
              />
            ))
          )}
        </div>
      </SortableContext>

      <div className="pt-2 border-t border-foreground/5">
        {activePickerCol === colIdx ? (
          <div className="space-y-1 p-1 bg-foreground/5 rounded-xl animate-in fade-in zoom-in-95">
            <div className="flex flex-wrap items-center gap-1">
              {/* Text */}
              <button
                type="button"
                onClick={() => { handlePickerAdd("p"); }}
                className="p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1"
              >
                <Type size={13} /> Text
              </button>

              {/* Heading with sub-menu for h2-h6 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExpandedSubMenu(expandedSubMenu === "heading" ? null : "heading")}
                  className={`p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1 transition-colors ${
                    expandedSubMenu === "heading" ? "bg-background text-foreground" : ""
                  }`}
                >
                  <Heading size={13} /> Heading <ChevronRight size={10} className={`transition-transform ${expandedSubMenu === "heading" ? "rotate-90" : ""}`} />
                </button>
                {expandedSubMenu === "heading" && (
                  <div className="absolute left-0 top-full mt-1 bg-foreground text-background p-1 rounded-lg shadow-xl border border-white/10 flex items-center gap-0.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 whitespace-nowrap">
                    {(["h2", "h3", "h4", "h5", "h6"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handlePickerAdd(lvl)}
                        className="px-2 py-1 text-[10px] font-mono font-bold rounded-md hover:bg-background/20 text-background/80 hover:text-background transition-colors uppercase"
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* List with sub-menu for bullet/numbered */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExpandedSubMenu(expandedSubMenu === "list" ? null : "list")}
                  className={`p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1 transition-colors ${
                    expandedSubMenu === "list" ? "bg-background text-foreground" : ""
                  }`}
                >
                  <List size={13} /> List <ChevronRight size={10} className={`transition-transform ${expandedSubMenu === "list" ? "rotate-90" : ""}`} />
                </button>
                {expandedSubMenu === "list" && (
                  <div className="absolute left-0 top-full mt-1 bg-foreground text-background p-1 rounded-lg shadow-xl border border-white/10 flex flex-col gap-0.5 min-w-[130px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      type="button"
                      onClick={() => handlePickerAdd("ul")}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium rounded-md hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
                    >
                      <span className="w-3.5 text-center font-bold text-sm leading-none">•</span>
                      <span>Bullet List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePickerAdd("ol")}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium rounded-md hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
                    >
                      <ListOrdered size={13} />
                      <span>Numbered List</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Image */}
              <button
                type="button"
                onClick={() => { handlePickerAdd("image"); }}
                className="p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1"
              >
                <ImageIcon size={13} /> Image
              </button>

              {/* Code */}
              <button
                type="button"
                onClick={() => { handlePickerAdd("code"); }}
                className="p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1"
              >
                <Terminal size={13} /> Code
              </button>

              {/* Quote */}
              <button
                type="button"
                onClick={() => { handlePickerAdd("quote"); }}
                className="p-1.5 hover:bg-background rounded-lg text-foreground/70 hover:text-foreground text-xs font-medium flex items-center gap-1"
              >
                <Quote size={13} /> Quote
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setActivePickerCol(colIdx); setExpandedSubMenu(null); }}
            className="flex items-center gap-1 text-[11px] font-mono text-foreground/40 hover:text-primary transition-colors py-1"
          >
            <Plus size={13} /> Add block
          </button>
        )}
      </div>
    </div>
  );
};

interface LayoutBlockProps {
  content: string;
  metadata?: string;
  onUpdate: (content: string, metadata?: string) => void;
  onDelete?: () => void;
}

export const LayoutBlock = ({
  content,
  metadata = "2",
  onUpdate,
  onDelete,
}: LayoutBlockProps) => {
  const [activePickerCol, setActivePickerCol] = useState<number | null>(null);

  const getParsedColumns = (): ColumnData[] => {
    try {
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
    } catch {
      // fallback
    }
    const count = Number(metadata) === 3 ? 3 : 2;
    return Array.from({ length: count }, (_, i) => ({
      id: `col-${i + 1}`,
      blocks: [
        {
          id: `sub-${i + 1}`,
          type: "p" as BlockType,
          content: "",
        },
      ],
    }));
  };

  const columns = getParsedColumns();
  const colCount = columns.length === 3 ? 3 : 2;

  const saveColumns = (newCols: ColumnData[]) => {
    onUpdate(JSON.stringify(newCols), String(newCols.length));
  };

  const handleSetColumns = (targetCount: 2 | 3) => {
    if (targetCount === colCount) return;

    let updated: ColumnData[] = [...columns];
    if (targetCount === 3) {
      updated.push({
        id: `col-${Date.now()}-3`,
        blocks: [
          {
            id: `sub-${Date.now()}-3`,
            type: "p",
            content: "",
          },
        ],
      });
    } else {
      const kept = updated.slice(0, 2);
      const excess = updated.slice(2);
      const excessBlocks = excess.flatMap((c) => c.blocks).filter((b) => b.content.trim());
      if (excessBlocks.length > 0) {
        kept[1].blocks = [...kept[1].blocks, ...excessBlocks];
      }
      updated = kept;
    }
    saveColumns(updated);
  };

  const handleAddSubBlock = (colIdx: number, type: BlockType) => {
    const newBlock: ColumnItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      content: "",
      metadata: type === "code" ? "index.ts" : "",
    };

    const updated = columns.map((col, idx) =>
      idx === colIdx ? { ...col, blocks: [...col.blocks, newBlock] } : col
    );
    saveColumns(updated);
    setActivePickerCol(null);
  };

  const handleUpdateSubBlock = (
    colIdx: number,
    blockId: string,
    val: string,
    meta?: string
  ) => {
    const updated = columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      return {
        ...col,
        blocks: col.blocks.map((b) =>
          b.id === blockId
            ? { ...b, content: val, metadata: meta !== undefined ? meta : b.metadata }
            : b
        ),
      };
    });
    saveColumns(updated);
  };

  const handleChangeSubBlockType = (
    colIdx: number,
    blockId: string,
    newType: BlockType
  ) => {
    const updated = columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      return {
        ...col,
        blocks: col.blocks.map((b) => (b.id === blockId ? { ...b, type: newType } : b)),
      };
    });
    saveColumns(updated);
  };

  const handleDeleteSubBlock = (colIdx: number, blockId: string) => {
    const updated = columns.map((col, idx) => {
      if (idx !== colIdx) return col;
      const filtered = col.blocks.filter((b) => b.id !== blockId);
      return {
        ...col,
        blocks:
          filtered.length > 0
            ? filtered
            : [{ id: Date.now().toString(), type: "p" as BlockType, content: "" }],
      };
    });
    saveColumns(updated);
  };

  return (
    <div className="w-full ">
    
    

      {/* Grid: 2 or 3 Columns */}
      <div
        className={`grid gap-2.5 ${
          colCount === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {columns.map((col, colIdx) => (
          <DroppableColumn
            key={col.id || colIdx}
            col={col}
            colIdx={colIdx}
            activePickerCol={activePickerCol}
            setActivePickerCol={setActivePickerCol}
            handleAddSubBlock={handleAddSubBlock}
            onUpdateSubBlock={handleUpdateSubBlock}
            onChangeSubBlockType={handleChangeSubBlockType}
            onDeleteSubBlock={handleDeleteSubBlock}
          />
        ))}
      </div>
    </div>
  );
};