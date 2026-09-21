import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Twitter, Globe, Camera } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <section>
        <h3 className="text-xl font-bold mb-6">Identity Visual</h3>
        <div className="flex items-center gap-8">
           <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=arjun" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera size={20} />
                <span className="text-[10px] font-bold mt-1 uppercase">Update</span>
              </button>
           </div>
           <div className="space-y-1">
              <p className="font-bold text-lg">Arjun Sharma</p>
              <p className="text-sm text-foreground/40 font-mono">member_since: Oct 2023</p>
              <p className="text-xs text-primary font-bold">Senior Frontend Engineer</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Full Name</Label>
          <Input defaultValue="Arjun Sharma" className="rounded-xl border-foreground/10 bg-foreground/[0.02]" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Professional Title</Label>
          <Input defaultValue="Senior Frontend Engineer" className="rounded-xl border-foreground/10 bg-foreground/[0.02]" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Technical Bio</Label>
        <Textarea 
          placeholder="Tell the community about your stack..."
          className="rounded-2xl border-foreground/10 bg-foreground/[0.02] min-h-[120px] resize-none" 
        />
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-bold">Social Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
              <Input placeholder="github.com/..." className="pl-10 rounded-xl border-foreground/10" />
           </div>
           <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
              <Input placeholder="twitter.com/..." className="pl-10 rounded-xl border-foreground/10" />
           </div>
           <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
              <Input placeholder="website.dev" className="pl-10 rounded-xl border-foreground/10" />
           </div>
        </div>
      </section>
    </div>
  );
}