/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { CodeBlock } from "./blocks/CodeBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { HeadingBlock } from "./blocks/HeadingBlock";
import { TextBlock } from "./blocks/TextBlock";


export const EditorBlock = ({ block, onUpdate, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };

  return (
    <div ref={setNodeRef} style={style} className={`group relative mb-2 flex gap-2 items-start ${isDragging ? "opacity-50" : ""}`}>
      <div {...attributes} {...listeners} className="mt-4 cursor-grab opacity-0 group-hover:opacity-100 transition-all text-foreground/20 hover:text-primary shrink-0">
        <GripVertical size={20} />
        
      </div>

      <div className="flex-1">
        {block.type === "h2" && (
           <HeadingBlock content={block.content} onUpdate={onUpdate}/>
        )}
         {block.type === "p" && (
            <TextBlock content={block.content} onUpdate={onUpdate} />
        )}
        {block.type === "code" && <CodeBlock content={block.content} metadata={block.metadata} onUpdate={onUpdate} />}
        {block.type === "quote" && <QuoteBlock content={block.content} onUpdate={onUpdate} />}
        {/* Add Image block here */}
      </div>

      <button onClick={onDelete} className="mt-4 opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-600 p-1">
        <Trash2 size={18} />
      </button>
    </div>
  );
};