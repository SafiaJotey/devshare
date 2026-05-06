"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

// UI Components
import { Button } from "@/components/ui/button";
import { Eye, Save, Rocket, AlertCircle, Edit3, Check } from "lucide-react";


import { FixedHeader } from "./_components/FixedHeader";
import { EditorBlock } from "./_components/EditorBlock";
import { Toolbar } from "./_components/Toolbar";
import { PreviewMode } from "./_components/PreviewMode";
import { Block, BlockType } from "./type";

export default function WriteNewPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 1. Mandatory Header States
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // 2. Dynamic Content Blocks
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "init-1", type: "p", content: "" }
  ]);

  // 3. Validation Logic
  const isReadyToPublish = category !== "" && title.trim() !== "" && description.trim() !== "";

  // 4. Drag and Drop Sensors
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevents accidental drags when clicking to edit text
    },
  }));

  const addBlock = (type: BlockType) => {
    const newBlock: Block = { 
      id: Date.now().toString(), 
      type, 
      content: "",
      metadata: type === "code" ? "index.ts" : "" 
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

  const handlePublish = () => {
    if (!isReadyToPublish) {
      alert("Please select a Category and enter a Title & Description.");
      return;
    }
    console.log("Pushing to Production...", { category, title, description, blocks });
    // Integrate your Firebase/Backend call here
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* --- TOP CONTROL BAR --- */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/5 h-20">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
              isReadyToPublish 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-600"
            }`}>
              {isReadyToPublish ? <Rocket size={14} /> : <AlertCircle size={14} />}
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                {isReadyToPublish ? "Ready to Publish" : "Incomplete Draft"}
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-foreground/30 font-mono uppercase tracking-widest italic">
              Auto-saved // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {/* Action Buttons */}
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
                onClick={handlePublish} 
                disabled={!isReadyToPublish}
                className="bg-primary text-primary-foreground rounded-xl px-8 h-11 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
             >
               Publish Article
             </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN EDITOR / PREVIEW CANVAS --- */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        {!isPreview ? (
          <div className="animate-in fade-in duration-500">
            {/* Fixed Header: Category, Title, Description */}
            <FixedHeader 
              category={category} setCategory={setCategory}
              title={title} setTitle={setTitle}
              description={description} setDescription={setDescription}
            />

            {/* Draggable Blocks Area */}
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <EditorBlock 
                      key={block.id} 
                      block={block} 
                      onUpdate={(content: string, metadata?: string) => {
                        setBlocks(blocks.map(b => b.id === block.id ? { ...b, content, metadata } : b));
                      }}
                      onDelete={() => {
                        if(blocks.length > 1) {
                          setBlocks(blocks.filter(b => b.id !== block.id));
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Floating Toolbar to add more blocks */}
            <Toolbar addBlock={addBlock} />
          </div>
        ) : (
          /* Preview Mode: Renders exactly like the live site */
          <PreviewMode 
            category={category} 
            title={title} 
            description={description} 
            blocks={blocks} 
          />
        )}
      </div>
    </div>
  );
}