"use client";

import React, { useRef } from "react";
import { List, ListOrdered, Plus, Trash2 } from "lucide-react";

interface ListBlockProps {
  type: "ul" | "ol";
  content: string;
  onUpdate: (content: string, metadata?: string) => void;
  onTypeChange?: (type: "ul" | "ol") => void;
}

export const ListBlock = ({
  type,
  content,
  onUpdate,
  onTypeChange,
}: ListBlockProps) => {
  const items = content ? content.split("\n") : [""];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleItemChange = (index: number, value: string) => {
    // If user pasted multi-line text
    if (value.includes("\n")) {
      const splitLines = value.split("\n");
      const next = [...items];
      next.splice(index, 1, ...splitLines);
      onUpdate(next.join("\n"));
      return;
    }
    const next = [...items];
    next[index] = value;
    onUpdate(next.join("\n"));
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = [...items];
      next.splice(index + 1, 0, "");
      onUpdate(next.join("\n"));
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    } else if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      const next = [...items];
      next.splice(index, 1);
      onUpdate(next.join("\n"));
      setTimeout(() => {
        const prevIndex = Math.max(0, index - 1);
        inputRefs.current[prevIndex]?.focus();
      }, 10);
    }
  };

  const addItem = () => {
    const next = [...items, ""];
    onUpdate(next.join("\n"));
    setTimeout(() => {
      inputRefs.current[next.length - 1]?.focus();
    }, 10);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      onUpdate("");
      return;
    }
    const next = items.filter((_, idx) => idx !== index);
    onUpdate(next.join("\n"));
  };

  return (
    <div className="space-y-2 my-2 py-1">
    

      {/* List items */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group/item">
            <span className="w-6 text-right font-mono text-sm font-semibold text-foreground/40 shrink-0 select-none">
              {type === "ol" ? `${idx + 1}.` : "•"}
            </span>

            <input
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder={`List item ${idx + 1}...`}
              className="flex-1 bg-transparent border-none outline-none text-lg text-foreground/80 placeholder:text-foreground/15"
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity text-foreground/30 hover:text-red-500 p-1 rounded"
                title="Remove item"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-primary transition-colors font-mono pl-8 pt-1"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
};