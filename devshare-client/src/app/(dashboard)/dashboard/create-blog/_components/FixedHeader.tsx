"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, Link as LinkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FixedHeaderProps {
  category: string;
  setCategory: (category: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  coverImage?: string;
  setCoverImage?: (coverImage: string) => void;
}

export const FixedHeader = ({
  category,
  setCategory,
  title,
  setTitle,
  description,
  setDescription,
  coverImage = "",
  setCoverImage,
}: FixedHeaderProps) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [showCoverInput, setShowCoverInput] = useState(false);

  const adjustHeight = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight(titleRef.current);
  }, [title]);

  useEffect(() => {
    adjustHeight(descRef.current);
  }, [description]);

  return (
    <div className="space-y-6 text-center border-b border-foreground/5 pb-16 mb-12">
      {/* Category selector & Cover Image */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-fit bg-background border-none text-accent font-bold tracking-[0.3em] uppercase text-xs focus:ring-0">
            <SelectValue placeholder="SELECT CATEGORY" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="AI & Data">AI & Data</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>

        {setCoverImage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCoverInput(!showCoverInput)}
            className="h-8 text-[11px] font-mono text-foreground/50 hover:text-primary gap-1.5 rounded-full px-3"
          >
            <ImageIcon size={13} />
            {coverImage ? "Change Cover" : "Add Cover URL"}
          </Button>
        )}
      </div>

      {/* Optional Cover Image Input */}
      {showCoverInput && setCoverImage && (
        <div className="max-w-md mx-auto flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative flex-1">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="pl-9 h-9 text-xs rounded-xl bg-foreground/[0.02] border-foreground/10 focus-visible:ring-primary/20"
            />
          </div>
          {coverImage && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCoverImage("")}
              className="h-9 w-9 text-foreground/40 hover:text-red-500 rounded-xl"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      )}

      {/* Cover Image Thumbnail Preview */}
      {coverImage && (
        <div className="max-w-xl mx-auto relative aspect-[21/9] rounded-2xl overflow-hidden border border-foreground/10 shadow-lg group">
          <Image
            src={coverImage}
            alt="Cover preview"
            fill
            className="object-cover"
            unoptimized
          />
          {setCoverImage && (
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
              title="Remove Cover Image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Title input */}
      <textarea
        ref={titleRef}
        placeholder="Deep Dive: Enter your title..."
        className="w-full text-center text-4xl md:text-6xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-foreground/10 leading-[1.1] tracking-tight overflow-hidden"
        rows={1}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description input */}
      <textarea
        ref={descRef}
        placeholder="An in-depth exploration of..."
        className="w-full text-center text-lg md:text-xl text-foreground/50 bg-transparent border-none outline-none resize-none placeholder:text-foreground/10 max-w-2xl mx-auto overflow-hidden mt-4"
        rows={1}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default FixedHeader;