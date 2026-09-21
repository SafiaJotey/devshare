"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Globe, Camera, Loader2, Save } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { updateProfileApi } from "@/lib/api";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTitle(user.title || "");
      setBio(user.bio || "");
      setGithub(user.socialLinks?.github || "");
      setTwitter(user.socialLinks?.twitter || "");
      setWebsite(user.socialLinks?.website || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfileApi({
        name,
        title,
        bio,
        socialLinks: {
          github,
          twitter,
          website,
        },
      });
      await refreshUser();
      toast.success("Profile changes saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (n?: string) => {
    if (!n) return "DS";
    return n
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <form onSubmit={handleSave} className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <section>
        <h3 className="text-xl font-bold mb-6">Identity Visual</h3>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={name || "Avatar"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-primary">{getInitials(name)}</span>
              )}
            </div>
            <button
              type="button"
              className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
            >
              <Camera size={18} />
              <span className="text-[9px] font-bold mt-1 uppercase">Visual</span>
            </button>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg text-foreground">{name || "Developer"}</p>
            <p className="text-sm text-foreground/40 font-mono">{user?.email}</p>
            <p className="text-xs text-primary font-bold">{title || "Software Engineer"}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Full Name</Label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-foreground/10 bg-foreground/[0.02]" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Professional Title</Label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border-foreground/10 bg-foreground/[0.02]" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Technical Bio</Label>
        <Textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community about your stack and experience..."
          className="rounded-2xl border-foreground/10 bg-foreground/[0.02] min-h-[120px] resize-none" 
        />
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-bold">Social Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
            <Input 
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..." 
              className="pl-10 rounded-xl border-foreground/10" 
            />
          </div>
          <div className="relative">
            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
            <Input 
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/..." 
              className="pl-10 rounded-xl border-foreground/10" 
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
            <Input 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://portfolio.dev" 
              className="pl-10 rounded-xl border-foreground/10" 
            />
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-primary text-primary-foreground rounded-xl gap-2 h-12 px-8 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}