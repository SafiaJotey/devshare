import { Button } from "@/components/ui/button";
import { Type, Heading2, Terminal, Quote, ImageIcon } from "lucide-react";

export const Toolbar = ({ addBlock }: any) => (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-foreground text-background p-2 rounded-2xl shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in duration-300">
    <Button variant="ghost" size="icon" onClick={() => addBlock("p")} className="hover:bg-white/10 rounded-xl"><Type size={18}/></Button>
    <Button variant="ghost" size="icon" onClick={() => addBlock("h2")} className="hover:bg-white/10 rounded-xl"><Heading2 size={18}/></Button>
    <Button variant="ghost" size="icon" onClick={() => addBlock("code")} className="hover:bg-white/10 text-blue-400 rounded-xl"><Terminal size={18}/></Button>
    <Button variant="ghost" size="icon" onClick={() => addBlock("quote")} className="hover:bg-white/10 text-accent rounded-xl"><Quote size={18}/></Button>
    <Button variant="ghost" size="icon" onClick={() => addBlock("image")} className="hover:bg-white/10 rounded-xl"><ImageIcon size={18}/></Button>
  </div>
);