"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff, RotateCw } from "lucide-react";

export default function DevSettings() {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [monospaceEditor, setMonospaceEditor] = useState(true);
  const [digest, setDigest] = useState(true);

  const mockApiKey = "ds_live_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Switches Card */}
      <div className="rounded-xl  border border-foreground/10 shadow-xs overflow-hidden">
        <div className="p-6 border-b   border-foreground/10">
          <h2 className="text-base font-semibold text-foreground">Editor & Privacy</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tailor code formatting, telemetry, and email notification feeds.
          </p>
        </div>

        <div className="divide-y divide-foreground/10">
          {/* Row 1 */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">Monospace Typography</span>
              <p className="text-xs text-muted-foreground">
                Display code snippets, technical blocks, and draft inputs in Fira Code / JetBrains Mono.
              </p>
            </div>
            <Switch checked={monospaceEditor} onCheckedChange={setMonospaceEditor} />
          </div>

          {/* Row 2 */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">Telemetry Privacy Mode</span>
              <p className="text-xs text-muted-foreground">
                Mask your live cursor and real-time active reader status in collaborative technical notes.
              </p>
            </div>
            <Switch checked={ghostMode} onCheckedChange={setGhostMode} />
          </div>

          {/* Row 3 */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-medium text-foreground">Weekly Digest</span>
              <p className="text-xs text-muted-foreground">
                Receive a curated weekly email summary of trending articles, discussions, and releases.
              </p>
            </div>
            <Switch checked={digest} onCheckedChange={setDigest} />
          </div>
        </div>
      </div>

      {/* Secret Token Management Card */}
      <div className="rounded-xl  border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-foreground">Personal Access Token</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use this token to authenticate CLI tooling and automated GitHub Actions publishers.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("New key generated.")}
              className="h-8 text-xs font-medium gap-1.5 shrink-0"
            >
              <RotateCw size={12} />
              Rotate Token
            </Button>
          </div>

          {/* Monospace Key Display */}
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-lg  border border-foreground/10">
            <code className="text-xs font-mono flex-1 truncate text-foreground/90 select-all">
              {showKey ? mockApiKey : "•".repeat(40) + mockApiKey.slice(-8)}
            </code>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2.5 text-xs font-medium gap-1"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-muted/30 ">
          <p className="text-[11px] text-muted-foreground">
            Do not share this token in public Git repositories.
          </p>
        </div>
      </div>
    </div>
  );
}