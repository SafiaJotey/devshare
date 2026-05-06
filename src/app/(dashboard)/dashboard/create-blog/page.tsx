"use client";

import React, { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Type, 
  Code2, 
  Image as ImageIcon, 
  Quote, 
  Eye, 
  Save,
  Terminal
} from "lucide-react";

// Shadcn & UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Types ---
type BlockType = "h2" | "p" | "code" | "quote" | "image";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: string; // language for code, or caption for image
}

// --- Sortable Block Wrapper ---
const SortableBlock = ({ 
  block, 
  onUpdate, 
  onDelete 
}: { 
  block: Block, 
  onUpdate: (val: string, meta?: string) => void,
  onDelete: () => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative mb-4 flex gap-4 items-start">
      {/* Drag Handle */}
      <div 
        {...attributes} {...listeners} 
        className="mt-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-primary"
      >
        <GripVertical size={20} />
      </div>

      {/* Block Content */}
      <div className="flex-1">
        {block.type === "h2" && (
          <Input 
            value={block.content} 
            onChange={(e) => onUpdate(e.target.value)} 
            placeholder="Heading 2" 
            className="text-2xl font-bold border-none bg-transparent px-0 focus-visible:ring-0"
          />
        )}

        {block.type === "p" && (
          <Textarea 
            value={block.content} 
            onChange={(e) => onUpdate(e.target.value)} 
            placeholder="Start writing your technical insight..." 
            className="text-lg border-none bg-transparent px-0 focus-visible:ring-0 min-h-[100px] resize-none"
          />
        )}

        {block.type === "code" && (
          <div className="rounded-xl overflow-hidden border border-foreground/10 bg-[#0d1117]">
             <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/40" /><div className="w-2 h-2 rounded-full bg-amber-500/40" /><div className="w-2 h-2 rounded-full bg-green-500/40" /></div>
                <Input 
                  value={block.metadata} 
                  onChange={(e) => onUpdate(block.content, e.target.value)}
                  placeholder="filename.ts" 
                  className="w-32 h-6 text-[10px] bg-transparent border-none text-white/40 font-mono focus-visible:ring-0 text-right"
                />
             </div>
             <Textarea 
                value={block.content} 
                onChange={(e) => onUpdate(e.target.value, block.metadata)}
                placeholder="// Paste your code here"
                className="font-mono text-sm bg-transparent border-none text-blue-300 p-6 min-h-[150px] focus-visible:ring-0"
             />
          </div>
        )}

        {block.type === "quote" && (
          <div className="border-l-4 border-accent pl-6 py-2">
            <Textarea 
              value={block.content} 
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Famous engineering quote..."
              className="italic text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 resize-none"
            />
          </div>
        )}

        {block.type === "image" && (
          <div className="space-y-2">
            <Input 
              value={block.content} 
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Paste Image URL here"
              className="bg-foreground/5 border-dashed"
            />
            {block.content && <img src={block.content} className="rounded-xl max-h-[300px] object-cover" alt="preview" />}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete}
        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

// --- Main Editor Page ---
export default function WriteNewPage() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "h2", content: "" },
    { id: "2", type: "p", content: "" }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: "",
      metadata: type === "code" ? "index.ts" : ""
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string, metadata?: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content, metadata } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-20 py-4 border-b border-foreground/5">
        <div>
           <h1 className="text-xl font-bold">New Post</h1>
           <p className="text-xs text-foreground/40">Draft auto-saved</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-11"><Save size={18}/> Save Draft</Button>
          <Button className="gap-2 rounded-xl h-11 bg-primary shadow-lg shadow-primary/20"><Plus size={18}/> Publish Article</Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-10">
          <TabsTrigger value="edit" className="gap-2"><Plus size={16}/> Editor</TabsTrigger>
          <TabsTrigger value="preview" className="gap-2"><Eye size={16}/> Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-12">
          {/* Cover Image & Title Area */}
          <div className="space-y-6">
            <div className="aspect-[21/9] rounded-[2.5rem] bg-foreground/5 border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center text-foreground/30 hover:bg-foreground/10 transition-all cursor-pointer">
              <ImageIcon size={48} className="mb-4" />
              <p className="font-bold">Add Cover Image</p>
              <p className="text-xs">Recommended size: 1920x1080</p>
            </div>
            <Input 
              placeholder="Article Title" 
              className="text-4xl md:text-6xl font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:opacity-20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DND EDITOR CANVAS */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="min-h-[400px]">
                {blocks.map((block) => (
                  <SortableBlock 
                    key={block.id} 
                    block={block} 
                    onUpdate={(val, meta) => updateBlock(block.id, val, meta)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* FAB for adding blocks */}
          <div className="flex flex-wrap gap-3 pt-10 border-t border-foreground/5">
            <Button variant="outline" onClick={() => addBlock("p")} className="gap-2 rounded-full"><Type size={16}/> Paragraph</Button>
            <Button variant="outline" onClick={() => addBlock("h2")} className="gap-2 rounded-full"><Type size={16}/> Heading</Button>
            <Button variant="outline" onClick={() => addBlock("code")} className="gap-2 rounded-full text-blue-500"><Code2 size={16}/> Code Block</Button>
            <Button variant="outline" onClick={() => addBlock("quote")} className="gap-2 rounded-full text-accent"><Quote size={16}/> Quote</Button>
            <Button variant="outline" onClick={() => addBlock("image")} className="gap-2 rounded-full"><ImageIcon size={16}/> Image</Button>
          </div>
        </TabsContent>

        {/* PREVIEW CONTENT: Renders the blocks using the Blog Details UI */}
        <TabsContent value="preview">
          <div className="max-w-4xl mx-auto py-10 prose prose-lg prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-primary">
            <h1 className="text-5xl font-bold mb-10">{title || "Untitled Article"}</h1>
            {blocks.map((block) => {
              if (block.type === "h2") return <h2 key={block.id} className="text-3xl font-bold mt-12 mb-6">{block.content}</h2>;
              if (block.type === "p") return <p key={block.id} className="mb-6">{block.content}</p>;
              if (block.type === "quote") return <blockquote key={block.id} className="border-l-4 border-accent pl-8 my-12 italic text-2xl font-serif text-foreground/70">{block.content}</blockquote>;
              if (block.type === "code") return (
                <div key={block.id} className="my-10 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl">
                  <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                    <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/20" /><div className="w-2 h-2 rounded-full bg-amber-500/20" /><div className="w-2 h-2 rounded-full bg-green-500/20" /></div>
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{block.metadata}</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto text-blue-300 font-mono leading-relaxed">{block.content}</pre>
                </div>
              );
              if (block.type === "image") return <img key={block.id} src={block.content} className="w-full rounded-2xl my-10 shadow-xl" alt="Preview" />;
              return null;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}