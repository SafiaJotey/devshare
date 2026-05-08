
import { ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export const ImageBlock = ({ content, onUpdate }: any) => (
  <div className="my-8 group/img">
    {!content ? (
      <div className="aspect-[21/9] bg-foreground/5 border-2 border-dashed border-foreground/10 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:bg-foreground/10 hover:border-primary/50 p-8">
        <ImageIcon className="text-foreground/20 mb-4" size={40} />
        <Input 
          placeholder="Paste high-res image URL (e.g. Unsplash)..." 
          className="max-w-xs bg-background border-foreground/10 text-xs"
          onChange={(e) => onUpdate(e.target.value)}
        />
      </div>
    ) : (
      <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
        <img src={content} className="w-full h-full object-cover" alt="Blog content" />
        <button 
          onClick={() => onUpdate("")}
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    )}
  </div>
);