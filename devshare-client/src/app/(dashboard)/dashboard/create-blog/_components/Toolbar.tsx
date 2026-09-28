"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Type,
  Heading,
  List,
  ListOrdered,
  Terminal,
  Quote,
  ImageIcon,
  LayoutGrid,
} from "lucide-react";
import { BlockType } from "../type";

interface ToolbarProps {
  addBlock: (type: BlockType, metadata?: string, content?: string) => void;
}

export const createDefaultColumns = (count: 2 | 3) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `col-${Date.now()}-${i + 1}`,
    blocks: [
      {
        id: `sub-${Date.now()}-${i + 1}-${Math.random().toString(36).slice(2, 6)}`,
        type: "p" as BlockType,
        content: "",
      },
    ],
  }));
};

export const Toolbar = ({ addBlock }: ToolbarProps) => {
  const [openMenu, setOpenMenu] = useState<"heading" | "list" | "layout" | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (type: BlockType, metadata?: string, content?: string) => {
    addBlock(type, metadata, content);
    setOpenMenu(null);
  };

  const handleSelectLayout = (cols: 2 | 3) => {
    const defaultData = createDefaultColumns(cols);
    handleSelect("layout", String(cols), JSON.stringify(defaultData));
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-foreground text-background p-2 rounded-2xl shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in duration-300"
    >
      {/* 1. Paragraph */}
      <Button
        variant="ghost"
        size="icon"
        title="Paragraph"
        onClick={() => handleSelect("p")}
        className="hover:bg-background/15 text-background rounded-xl"
      >
        <Type size={18} />
      </Button>

      {/* 2. Heading (H2 - H6) */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          title="Headings (H2 - H6)"
          onClick={() => setOpenMenu(openMenu === "heading" ? null : "heading")}
          className={`hover:bg-background/15 text-background rounded-xl transition-colors ${
            openMenu === "heading" ? "bg-background/25 text-primary" : ""
          }`}
        >
          <Heading size={18} />
        </Button>

        {openMenu === "heading" && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-foreground text-background p-1.5 rounded-xl shadow-2xl border border-white/10 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150 z-50 whitespace-nowrap">
            {(["h2", "h3", "h4", "h5", "h6"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSelect(lvl)}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg hover:bg-background/20 text-background/80 hover:text-background transition-colors uppercase"
              >
                {lvl}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. List */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          title="Lists"
          onClick={() => setOpenMenu(openMenu === "list" ? null : "list")}
          className={`hover:bg-background/15 text-background rounded-xl transition-colors ${
            openMenu === "list" ? "bg-background/25 text-primary" : ""
          }`}
        >
          <List size={18} />
        </Button>

        {openMenu === "list" && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-foreground text-background p-1.5 rounded-xl shadow-2xl border border-white/10 flex flex-col gap-1 min-w-[170px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
            <button
              type="button"
              onClick={() => handleSelect("ul")}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
            >
              <span className="w-4 text-center font-bold text-lg leading-none">•</span>
              <span>Bullet List</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelect("ol")}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
            >
              <ListOrdered size={15} />
              <span>Numbered List</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Layout (2 or 3 Columns) */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          title="Columns Layout"
          onClick={() => setOpenMenu(openMenu === "layout" ? null : "layout")}
          className={`hover:bg-background/15 text-background rounded-xl transition-colors ${
            openMenu === "layout" ? "bg-background/25 text-primary" : ""
          }`}
        >
          <LayoutGrid size={18} />
        </Button>

        {openMenu === "layout" && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-foreground text-background p-1.5 rounded-xl shadow-2xl border border-white/10 flex flex-col gap-1 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
            <button
              type="button"
              onClick={() => handleSelectLayout(2)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
            >
              <span>2 Columns</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLayout(3)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-background/20 text-left transition-colors text-background/85 hover:text-background"
            >
              <span>3 Columns</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Code */}
      <Button
        variant="ghost"
        size="icon"
        title="Code Block"
        onClick={() => handleSelect("code")}
        className="hover:bg-background/15 text-blue-400 rounded-xl"
      >
        <Terminal size={18} />
      </Button>

      {/* 6. Quote */}
      <Button
        variant="ghost"
        size="icon"
        title="Quote"
        onClick={() => handleSelect("quote")}
        className="hover:bg-background/15 text-accent rounded-xl"
      >
        <Quote size={18} />
      </Button>

      {/* 7. Image */}
      <Button
        variant="ghost"
        size="icon"
        title="Image"
        onClick={() => handleSelect("image")}
        className="hover:bg-background/15 text-background rounded-xl"
      >
        <ImageIcon size={18} />
      </Button>
    </div>
  );
};