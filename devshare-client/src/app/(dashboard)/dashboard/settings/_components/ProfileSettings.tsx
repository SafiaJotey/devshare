"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  Globe, 
  Camera, 
  Loader2, 
  Save, 
  Trash2, 
  CheckCircle2, 
  UploadCloud 
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { updateProfileApi } from "@/lib/api";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTitle(user.title || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setGithub(user.socialLinks?.github || "");
      setTwitter(user.socialLinks?.twitter || "");
      setWebsite(user.socialLinks?.website || "");
    }
  }, [user]);

  // Convert and compress file to Base64 to save directly into MongoDB
  const processImageFile = (file: File) => {
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload JPG, PNG, or WebP.");
      return;
    }

    // 2.5 MB boundary check
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Image too large. Please select a photo under 2.5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Image resizing on canvas to optimize MongoDB document payload
      const img = new Image();
      img.src = result;
      img.onload = () => {
        const MAX_DIM = 400; // 400x400 max avatar boundary
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          setAvatar(compressedBase64);
          toast.success("Picture staged. Click 'Save Changes' to commit to MongoDB.");
        } else {
          setAvatar(result);
        }
        setIsUploading(false);
      };

      img.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to parse the selected picture.");
      };
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Error reading file.");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Avatar removed. Click Save to confirm.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfileApi({
        name,
        title,
        bio,
        avatar, // Saved straight into MongoDB user collection
        socialLinks: {
          github,
          twitter,
          website,
        },
      });

      await refreshUser();
      toast.success("Profile & photo saved in MongoDB successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to persist profile updates");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (n?: string) => {
    if (!n) return "DS";
    return n
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <form onSubmit={handleSave} className="space-y-10 animate-in fade-in duration-300">
      {/* Visual Identity / Avatar Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            
            <p className="text-xs text-foreground/50 mt-0.5">
              Upload your photo.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/10">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-foreground/5 border-2 border-dashed border-foreground/20 overflow-hidden flex items-center justify-center relative shadow-inner">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || "Dev Avatar"}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span className="text-2xl font-black font-mono text-primary">
                    {getInitials(name)}
                  </span>
                  <span className="text-[9px] font-mono text-foreground/40 mt-1 uppercase">
                    No Picture
                  </span>
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Hidden Input for Native Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>

          {/* Action Triggers */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSaving}
                className="rounded-xl h-10 px-4 font-semibold text-xs bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <UploadCloud size={15} />
                Upload New Image
              </Button>

              {avatar && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading || isSaving}
                  className="rounded-xl h-10 px-3 text-xs border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 size={14} className="mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="text-[11px] text-foreground/50 space-y-0.5 leading-relaxed font-mono">
              <p>• Accepted formats: JPG, PNG, WebP (Max: 2.5MB)</p>
           
            </div>
          </div>
        </div>
      </div>

      {/* Core Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
            Display Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Linus Torvalds"
            className="rounded-xl border-foreground/10 bg-background/50 h-11 focus:ring-1 focus:ring-primary text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
            Engineering Role / Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Architect"
            className="rounded-xl border-foreground/10 bg-background/50 h-11 focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
            Developer Bio & Specialization
          </Label>
          <span className="text-[10px] font-mono text-foreground/40">{bio.length}/300</span>
        </div>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 300))}
          placeholder="Share your core stack (e.g. Next.js, Go, Kubernetes), open-source contributions, and engineering interests..."
          className="rounded-2xl border-foreground/10 bg-background/50 min-h-[110px] resize-none focus:ring-1 focus:ring-primary text-sm p-4"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground/70">
            External Developer Profiles
          </h3>
          <p className="text-xs text-foreground/50 mt-0.5">
            Rendered on your blog articles so other engineers can discover your work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <Input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/username"
              className="pl-10 rounded-xl border-foreground/10 bg-background/50 h-11 text-xs font-mono"
            />
          </div>

          <div className="relative">
            <Twitter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <Input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="x.com/username"
              className="pl-10 rounded-xl border-foreground/10 bg-background/50 h-11 text-xs font-mono"
            />
          </div>

          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="pl-10 rounded-xl border-foreground/10 bg-background/50 h-11 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Save Button Row */}
      <div className="pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-foreground/50">
          <CheckCircle2 size={15} className="text-primary" />
          <span>MongoDB automatic snapshot synchronization</span>
        </div>

        <Button
          type="submit"
          disabled={isSaving || isUploading}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to MongoDB...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}