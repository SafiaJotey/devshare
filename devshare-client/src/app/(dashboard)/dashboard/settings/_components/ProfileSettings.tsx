"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  Globe, 
  Camera, 
  Loader2, 
  Trash2,
  Check
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

  const processImageFile = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format must be PNG, JPEG, or WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file must be under 3MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.src = result;
      img.onload = () => {
        const MAX_DIM = 400;
        let { width, height } = img;
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
          setAvatar(canvas.toDataURL("image/jpeg", 0.88));
          toast.success("Picture staged. Click Save to persist.");
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to load picture.");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileApi({
        name,
        title,
        bio,
        avatar,
        socialLinks: { github, twitter, website },
      });
      await refreshUser();
      toast.success("Profile saved successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Block 1: Profile Identity */}
      <div className="rounded-2xl border border-foreground/10 bg-background shadow-xs">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Public Identity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              This info will appear across your technical blogs, published articles, and author cards.
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b  border-foreground/10 ">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">Avatar Image</span>
              <p className="text-xs text-muted-foreground">
                Square format image up to 3MB (JPEG, PNG, or WebP).
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full border border-border bg-muted/60 overflow-hidden flex items-center justify-center relative">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base font-mono font-semibold text-muted-foreground uppercase">
                      {name ? name.slice(0, 2) : "ME"}
                    </span>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-foreground text-background shadow hover:opacity-90 transition-opacity"
                  title="Upload avatar"
                >
                  <Camera size={12} />
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processImageFile(file);
                }}
                accept="image/png, image/jpeg, image/webp"
                className="hidden "
              />

              {avatar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAvatar("")}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={13} className="mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Inputs Row: Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Display Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-9 text-sm  border border-foreground/10 "
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Job Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Staff Distributed Systems Engineer"
                className="h-9 text-sm  border border-foreground/10"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Short Bio</label>
              <span className="text-[11px] font-mono text-muted-foreground">{bio.length}/300</span>
            </div>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Tell other engineers about what you're building, systems you design, or tech stack specialties..."
              className="text-sm min-h-[90px] resize-none  border border-foreground/10"
            />
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="px-6 py-3 bg-muted/30  flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Changes take effect immediately on your profile.</p>
          <Button type="submit" size="sm" disabled={isSaving || isUploading} className="h-8 px-4 text-xs font-medium">
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
            Save changes
          </Button>
        </div>
      </div>

      {/* Block 2: Social Presences */}
      <div className="rounded-xl  border border-foreground/10 bg-card shadow-sm">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">External Links</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Link your Git repositories and personal website to your author bylines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/username"
                className="pl-9 h-9 text-xs font-mono  border border-foreground/10"
              />
            </div>

            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="x.com/handle"
                className="pl-9 h-9 text-xs font-mono  border border-foreground/10"
              />
            </div>

            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://domain.dev"
                className="pl-9 h-9 text-xs font-mono  border border-foreground/10"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-muted/30  flex justify-end">
          <Button type="submit" size="sm" disabled={isSaving || isUploading} className="h-8 px-4 text-xs font-medium">
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
            Save links
          </Button>
        </div>
      </div>
    </form>
  );
}