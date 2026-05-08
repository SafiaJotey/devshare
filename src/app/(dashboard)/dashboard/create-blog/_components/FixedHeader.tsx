
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const FixedHeader = ({ category, setCategory, title, setTitle, description, setDescription }: any) => {
  
  // This function makes the textarea grow as you type
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="space-y-6 text-center border-b border-foreground/5 pb-16 mb-12">
      <div className="flex justify-center">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-fit bg-transparent border-none text-accent font-bold tracking-[0.3em] uppercase text-xs focus:ring-0">
            <SelectValue placeholder="SELECT CATEGORY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="AI & Data">AI & Data</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AUTO-RESIZING TITLE */}
      <textarea
        placeholder="Deep Dive: Enter your title..."
        className="w-full text-center text-4xl md:text-6xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-foreground/10 leading-[1.1] tracking-tight overflow-hidden"
        rows={1}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          autoResize(e);
        }}
      />

      {/* AUTO-RESIZING DESCRIPTION */}
      <textarea
        placeholder="An in-depth exploration of..."
        className="w-full text-center text-lg md:text-xl text-foreground/50 bg-transparent border-none outline-none resize-none placeholder:text-foreground/10 max-w-2xl mx-auto overflow-hidden mt-4"
        rows={1}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          autoResize(e);
        }}
      />
    </div>
  );
};