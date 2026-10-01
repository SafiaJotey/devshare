"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Camera,
  Loader2,
  Trash2,
  Check,
  Plus,
  X,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { updateProfileApi, uploadProfileAvatarApi, BlogCategory } from "@/lib/api";

const DOMAINS: BlogCategory[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI & Data",
  "Security",
];

const SUGGESTED_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Docker",
  "Python",
  "Kubernetes",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "Rust",
];

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [primaryDomain, setPrimaryDomain] = useState<string>("Frontend");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTitle(user.title || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setPrimaryDomain(user.primaryDomain || "Frontend");
      setSkills(user.skills || []);
      setGithub(user.socialLinks?.github || "");
      setTwitter(user.socialLinks?.twitter || "");
      setLinkedin(user.socialLinks?.linkedin || "");
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
      img.onload = async () => {
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
          const compressed = canvas.toDataURL("image/jpeg", 0.88);
          setAvatar(compressed);

          try {
            await uploadProfileAvatarApi(compressed);
            await refreshUser();
            toast.success("Profile photo updated successfully.");
          } catch (uploadErr: any) {
            // Keep staged locally so it saves with form
            toast.info("Image staged. Click 'Save Profile' to persist.");
          }
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to process image file.");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || skillInput).trim();
    if (!s) return;
    if (skills.length >= 15) {
      toast.error("You can add up to 15 skills.");
      return;
    }
    if (skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      toast.info(`"${s}" is already in your skills.`);
      return;
    }
    setSkills([...skills, s]);
    if (!skillToAdd) setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Display Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfileApi({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        avatar,
        primaryDomain,
        skills,
        socialLinks: {
          github: github.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),
          website: website.trim(),
        },
      });
      await refreshUser();
      toast.success("Contributor profile updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Block 1: Contributor Identity */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Public Contributor Identity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                This information appears on your article bylines, author cards, and published blogs.
              </p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-foreground/10">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">Author Avatar</span>
              <p className="text-xs text-muted-foreground">
                Square format up to 3MB (JPEG, PNG, or WebP). Displayed on article cards.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full border border-border bg-muted/60 overflow-hidden flex items-center justify-center relative shadow-xs">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || "Contributor Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-mono font-semibold text-muted-foreground uppercase">
                      {name ? name.slice(0, 2) : "DS"}
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
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow hover:opacity-90 transition-opacity cursor-pointer"
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
                className="hidden"
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

          {/* Inputs Row: Name & Professional Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Display Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="h-9 text-sm border-foreground/10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Professional Role / Byline
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Full-Stack Engineer"
                className="h-9 text-sm border-foreground/10"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Author Bio
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {bio.length}/300
              </span>
            </div>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Tell readers about what you build, frameworks you specialize in, or architectural problems you explore..."
              className="text-sm min-h-[90px] resize-none border-foreground/10"
            />
          </div>
        </div>
      </div>

      {/* Block 2: Technical Domains & Skills */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Technical Domains & Specializations
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Highlight the topics and technology stacks you write about most frequently.
              </p>
            </div>
          </div>

          {/* Primary Domain */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Primary Focus Domain
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((domain) => {
                const isSelected = primaryDomain === domain;
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setPrimaryDomain(domain)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/50 text-muted-foreground border-foreground/10 hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {isSelected && <Check size={12} className="inline mr-1" />}
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills / Tech Stack Tags */}
          <div className="space-y-3 pt-3 border-t border-foreground/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Core Tech Stack & Specialties ({skills.length}/15)
              </label>
              <span className="text-[11px] text-muted-foreground">
                Press Enter or comma to add
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="e.g. Docker, TypeScript, React, Kubernetes..."
                className="h-9 text-xs border-foreground/10"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSkill()}
                disabled={!skillInput.trim()}
                className="h-9 px-3 text-xs shrink-0 cursor-pointer"
              >
                <Plus size={14} className="mr-1" />
                Add
              </Button>
            </div>

            {/* Added Skills Badges */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-foreground/10"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggested Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-muted-foreground block mb-1.5">
                Suggested tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.filter(
                  (s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
                )
                  .slice(0, 8)
                  .map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => handleAddSkill(suggested)}
                      className="text-[11px] px-2 py-0.5 rounded bg-muted/40 text-muted-foreground hover:text-foreground border border-foreground/5 hover:border-foreground/20 transition-colors cursor-pointer"
                    >
                      + {suggested}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block 3: Social & External Links */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              External & Social Links
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Link your Git repositories, professional network, and personal portfolio to your author bylines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="relative">
              <Github
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={15}
              />
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/username"
                className="pl-9 h-9 text-xs font-mono border-foreground/10"
              />
            </div>

            <div className="relative">
              <Twitter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={15}
              />
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="x.com/handle"
                className="pl-9 h-9 text-xs font-mono border-foreground/10"
              />
            </div>

            <div className="relative">
              <Linkedin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={15}
              />
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/username"
                className="pl-9 h-9 text-xs font-mono border-foreground/10"
              />
            </div>

            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={15}
              />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://portfolio.dev"
                className="pl-9 h-9 text-xs font-mono border-foreground/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Block 4: Live Contributor Card Preview (Real-time Feedback) */}
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Live Contributor Card Preview
            </span>
            <p className="text-xs text-muted-foreground">
              This is how your author card renders for readers below your published articles.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Preview
          </span>
        </div>

        {/* Rendered Author Card */}
        <div className="p-5 rounded-xl border border-foreground/10 bg-background/80 backdrop-blur-md shadow-xs flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-14 h-14 rounded-full border border-border bg-muted/60 overflow-hidden flex items-center justify-center shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name || "Preview"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-mono font-semibold text-muted-foreground uppercase">
                {name ? name.slice(0, 2) : "DS"}
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {name || "Contributor Name"}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                {primaryDomain} Contributor
              </span>
            </div>

            <p className="text-xs font-medium text-muted-foreground">
              {title || "Developer & Technical Contributor"}
            </p>

            <p className="text-xs text-muted-foreground/90 leading-relaxed">
              {bio ||
                "Write technical articles that help thousands of developers solve real-world engineering challenges."}
            </p>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {skills.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-foreground/5"
                  >
                    {s}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-muted-foreground">
                    +{skills.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Social Icons Preview */}
            <div className="flex items-center gap-2 pt-2 text-muted-foreground">
              {github && (
                <span className="text-xs flex items-center gap-1 hover:text-foreground">
                  <Github size={13} />
                  <span className="text-[11px]">GitHub</span>
                </span>
              )}
              {twitter && (
                <span className="text-xs flex items-center gap-1 hover:text-foreground">
                  <Twitter size={13} />
                  <span className="text-[11px]">Twitter</span>
                </span>
              )}
              {linkedin && (
                <span className="text-xs flex items-center gap-1 hover:text-foreground">
                  <Linkedin size={13} />
                  <span className="text-[11px]">LinkedIn</span>
                </span>
              )}
              {website && (
                <span className="text-xs flex items-center gap-1 hover:text-foreground">
                  <Globe size={13} />
                  <span className="text-[11px]">Portfolio</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-4 rounded-xl border border-foreground/10 bg-muted/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Changes sync directly across your articles and author profile.
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={isSaving || isUploading}
          className="h-8 px-5 text-xs font-medium cursor-pointer"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
}