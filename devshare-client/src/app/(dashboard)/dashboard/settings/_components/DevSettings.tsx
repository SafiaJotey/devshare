"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, Terminal, Eye, Code2, BellRing } from "lucide-react";

export default function DevSettings() {
  const [copied, setCopied] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [monospaceEditor, setMonospaceEditor] = useState(true);
  const [digest, setDigest] = useState(true);

  const mockApiKey = "ds_live_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Workspace Switches */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">IDE & Workspace Defaults</h2>
        </div>
        <p className="text-xs text-foreground/50">
          Tailor how technical blogs, draft editors, and code snippets render across your workspace.
        </p>

        <div className="mt-5 space-y-3">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/15 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                <Code2 size={16} />
              </div>
              <div>
                <Label htmlFor="mono-toggle" className="font-bold text-sm text-foreground cursor-pointer">
                  Monospace Typography in Block Editor
                </Label>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Switches all text block editing areas to Fira Code / JetBrains Mono font faces.
                </p>
              </div>
            </div>
            <Switch
              id="mono-toggle"
              checked={monospaceEditor}
              onCheckedChange={setMonospaceEditor}
            />
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/15 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                <Eye size={16} />
              </div>
              <div>
                <Label htmlFor="ghost-toggle" className="font-bold text-sm text-foreground cursor-pointer">
                  Ghost / Telemetry Privacy Mode
                </Label>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Mask your real-time reading status and cursor presence in collaborative technical blogs.
                </p>
              </div>
            </div>
            <Switch
              id="ghost-toggle"
              checked={ghostMode}
              onCheckedChange={setGhostMode}
            />
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/15 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                <BellRing size={16} />
              </div>
              <div>
                <Label htmlFor="digest-toggle" className="font-bold text-sm text-foreground cursor-pointer">
                  Weekly Engineering Digest
                </Label>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Curated updates covering DevOps, System Design, and High-Performance Frontend.
                </p>
              </div>
            </div>
            <Switch
              id="digest-toggle"
              checked={digest}
              onCheckedChange={setDigest}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-foreground/10" />

      {/* Access Token Card */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Public Developer Key</h2>
        </div>
        <p className="text-xs text-foreground/50">
          Use this secret key to publish articles directly from your CI/CD pipelines (GitHub Actions / GitLab CI).
        </p>

        <div className="mt-4 p-5 rounded-2xl bg-foreground text-background border border-foreground/20 relative">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
              Production_API_Key
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 text-background/80 hover:text-accent hover:bg-background/10 font-mono text-xs cursor-pointer"
            >
              {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
          <code className="block font-mono text-xs break-all text-background/80 select-all">
            {mockApiKey}
          </code>
        </div>
      </div>
    </div>
  );
}