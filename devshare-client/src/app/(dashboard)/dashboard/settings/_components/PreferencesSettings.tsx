"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  Code,
  Bell,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { updateProfileApi, BlogCategory } from "@/lib/api";

const CATEGORIES: BlogCategory[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
  "Security",
];

const CODE_FONTS = [
  { id: "jetbrains", label: "JetBrains Mono", preview: "const dev = 'share';" },
  { id: "fira", label: "Fira Code", preview: "fn main() => 42;" },
  { id: "mono", label: "System Monospace", preview: "echo $DEVSHARE" },
] as const;

export default function PreferencesSettings() {
  const { user, refreshUser } = useAuth();

  const [defaultCategory, setDefaultCategory] = useState<string>("Frontend");
  const [codeFont, setCodeFont] = useState<string>("jetbrains");
  const [autoSave, setAutoSave] = useState(true);
  const [emailOnComment, setEmailOnComment] = useState(true);
  const [emailOnLike, setEmailOnLike] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [showInLeaderboard, setShowInLeaderboard] = useState(true);
  const [publicEmail, setPublicEmail] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      const p = user.preferences;
      if (p.defaultCategory) setDefaultCategory(p.defaultCategory);
      if (p.codeFont) setCodeFont(p.codeFont);
      if (typeof p.autoSave === "boolean") setAutoSave(p.autoSave);
      if (typeof p.emailOnComment === "boolean") setEmailOnComment(p.emailOnComment);
      if (typeof p.emailOnLike === "boolean") setEmailOnLike(p.emailOnLike);
      if (typeof p.weeklyDigest === "boolean") setWeeklyDigest(p.weeklyDigest);
      if (typeof p.showInLeaderboard === "boolean") setShowInLeaderboard(p.showInLeaderboard);
      if (typeof p.publicEmail === "boolean") setPublicEmail(p.publicEmail);
    }
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileApi({
        preferences: {
          defaultCategory,
          codeFont,
          autoSave,
          emailOnComment,
          emailOnLike,
          weeklyDigest,
          showInLeaderboard,
          publicEmail,
        },
      });
      await refreshUser();
      toast.success("Preferences updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDefaultCategory("Frontend");
    setCodeFont("jetbrains");
    setAutoSave(true);
    setEmailOnComment(true);
    setEmailOnLike(true);
    setWeeklyDigest(true);
    setShowInLeaderboard(true);
    setPublicEmail(false);
    toast.info("Preferences reset to default values. Click save to persist.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Block 1: Writing & Editor Behavior */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs overflow-hidden">
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <PenTool size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Authoring & Publishing
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure your default writing environment and article defaults.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Default Category */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Default Article Category
            </label>
            <p className="text-xs text-muted-foreground">
              Pre-selected category when you create a new technical article in the editor.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = defaultCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDefaultCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/50 text-muted-foreground border-foreground/10 hover:border-foreground/20 hover:text-foreground"
                      }`}
                  >
                    {isSelected && <Check size={12} className="inline mr-1.5" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Block Typography */}
          <div className="space-y-2 pt-4 border-t border-foreground/10">
            <div className="flex items-center gap-1.5">
              <Code size={14} className="text-muted-foreground" />
              <label className="text-xs font-medium text-foreground">
                Code Block Typography
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Preferred font family for code blocks, syntax highlighters, and terminal outputs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {CODE_FONTS.map((font) => {
                const isSelected = codeFont === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => setCodeFont(font.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-foreground/10 hover:border-foreground/20 bg-muted/20"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {font.label}
                      </span>
                      {isSelected && <Check size={13} className="text-primary" />}
                    </div>
                    <code className="mt-2 block text-[11px] font-mono text-muted-foreground bg-background/60 px-2 py-1 rounded border border-foreground/5">
                      {font.preview}
                    </code>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto-save Switch */}
          <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                Automatic Draft Snapshots
              </span>
              <p className="text-xs text-muted-foreground">
                Periodically preserve your draft progress in the editor to prevent accidental data loss.
              </p>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </div>
      </div>

      {/* Block 2: Contributor Notification Channels */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs overflow-hidden">
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Bell size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Notification Feeds
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stay updated with community engagement and feedback on your publications.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-foreground/10">
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                Article Comments & Discussions
              </span>
              <p className="text-xs text-muted-foreground">
                Receive notifications when developers comment on your articles or reply to your notes.
              </p>
            </div>
            <Switch checked={emailOnComment} onCheckedChange={setEmailOnComment} />
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                Article Reactions & Bookmarks
              </span>
              <p className="text-xs text-muted-foreground">
                Receive summaries when readers like or bookmark your published articles.
              </p>
            </div>
            <Switch checked={emailOnLike} onCheckedChange={setEmailOnLike} />
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                DevShare Weekly Digest
              </span>
              <p className="text-xs text-muted-foreground">
                Weekly curated roundup of the highest-rated technical publications, author highlights, and platform updates.
              </p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
        </div>
      </div>

      {/* Block 3: Community & Visibility */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs overflow-hidden">
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Community Spotlight & Visibility
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Control your contributor visibility on DevShare public pages.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-foreground/10">
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                Top Contributors Showcase
              </span>
              <p className="text-xs text-muted-foreground">
                Allow your author avatar and published articles count to be featured on the homepage leaderboard and marquee.
              </p>
            </div>
            <Switch checked={showInLeaderboard} onCheckedChange={setShowInLeaderboard} />
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">
                Public Contact Link
              </span>
              <p className="text-xs text-muted-foreground">
                Display your verified contact email on your public author byline card for tech inquiries.
              </p>
            </div>
            <Switch checked={publicEmail} onCheckedChange={setPublicEmail} />
          </div>
        </div>
      </div>

      {/* Sticky / Floating Save Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/10 bg-muted/20">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <RotateCcw size={13} />
          Reset to Defaults
        </Button>

        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className="h-8 px-5 text-xs font-medium cursor-pointer"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
