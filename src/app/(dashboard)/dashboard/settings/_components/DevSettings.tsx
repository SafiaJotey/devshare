import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Key } from "lucide-react";

export default function DevSettings() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold">Interface Parameters</h3>
          <p className="text-sm text-foreground/40 mt-1">Adjust your workspace environment.</p>
        </div>
        
        <div className="space-y-4">
           {[
             { id: "ghost", label: "Ghost Mode", desc: "Hide your 'Last Active' status from other contributors." },
             { id: "mono", label: "Monospace Typography", desc: "Use a monospaced font for all technical blog previews." },
             { id: "notif", label: "Email Pipeline", desc: "Receive technical digests and comment threads." },
           ].map((item) => (
             <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                <div className="space-y-1">
                   <Label htmlFor={item.id} className="font-bold text-sm">{item.label}</Label>
                   <p className="text-xs text-foreground/40">{item.desc}</p>
                </div>
                <Switch id={item.id} />
             </div>
           ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold">Access Tokens</h3>
          <p className="text-sm text-foreground/40 mt-1">Public tokens for the Dev Share API.</p>
        </div>

        <div className="p-6 rounded-2xl bg-foreground text-background relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <Key size={14} className="text-accent" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Public_API_Key</span>
              </div>
              <button className="text-background/40 hover:text-accent transition-colors"><Copy size={16}/></button>
           </div>
           <code className="text-xs font-mono break-all opacity-70">
             ds_live_8829_vX_0092_secret_logic_7721
           </code>
        </div>
      </section>
    </div>
  );
}