"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  AlertTriangle, 
  Loader2, 
  Lock, 
  Check, 
  Smartphone 
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { changePasswordApi } from "@/lib/api";

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new passwords.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error("Password must contain uppercase, lowercase, and numeric characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      toast.success("Security credentials rotated! Please re-authenticate.");
      await logout();
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Email Identification */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Authentication Endpoint</h2>
        </div>
        <p className="text-xs text-foreground/50">
          Your unique identifier used for authentication and Git commit attributions.
        </p>

        <div className="mt-4 max-w-lg">
          <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
            Registered Email
          </Label>
          <div className="relative mt-1.5">
            <Input
              value={user?.email || ""}
              disabled
              className="rounded-xl border-foreground/10 bg-foreground/[0.03] pl-4 pr-24 h-11 font-mono text-sm"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-primary/20">
              <Check size={12} />
              VERIFIED
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-foreground/10" />

      {/* Password Rotation */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Rotate Access Password</h2>
        </div>
        <p className="text-xs text-foreground/50">
          Enforces salt-12 bcrypt hashing and revokes stale refresh tokens across all active sessions.
        </p>

        <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
              Current Password
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isUpdatingPassword}
              className="rounded-xl border-foreground/10 bg-background/50 h-11 text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
              New Password
            </Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isUpdatingPassword}
              className="rounded-xl border-foreground/10 bg-background/50 h-11 text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono uppercase tracking-wider text-foreground/60 font-semibold">
              Confirm New Password
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isUpdatingPassword}
              className="rounded-xl border-foreground/10 bg-background/50 h-11 text-sm font-mono"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="mt-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 h-11 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            {isUpdatingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rotating Keys...
              </>
            ) : (
              <>
                <Lock size={15} />
                Rotate Credentials
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="h-px bg-foreground/10" />

      {/* 2FA Section */}
      <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              Two-Factor Authentication (TOTP)
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60">
                Optional
              </span>
            </h3>
            <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
              Require an authenticator code (Google Authenticator, 1Password) whenever logging into the DevShare console.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Two-Factor Authentication configuration will be available in the upcoming security release.")}
          className="rounded-xl border-foreground/20 hover:bg-foreground/5 text-xs font-semibold h-10 px-4 shrink-0"
        >
          Configure TOTP
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/20 rounded-2xl overflow-hidden bg-red-500/[0.02]">
        <div className="px-6 py-3 border-b border-red-500/20 bg-red-500/5 flex items-center gap-2 text-red-600">
          <AlertTriangle size={15} />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            Critical Action // Danger Zone
          </span>
        </div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-foreground">Deprovision Account</h4>
            <p className="text-xs text-foreground/50 mt-1 leading-relaxed max-w-md">
              Permanently purges your published articles, code snippets, drafts, and profile records from the MongoDB database.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toast.error("Account deprovisioning requires email confirmation link.")}
            className="text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl font-semibold text-xs h-10 px-4 border border-red-500/20 shrink-0"
          >
            Purge Account Data
          </Button>
        </div>
      </div>
    </div>
  );
}