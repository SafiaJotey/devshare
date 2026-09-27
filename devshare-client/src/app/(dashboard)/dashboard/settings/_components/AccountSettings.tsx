"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Loader2, 

  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { changePasswordApi } from "@/lib/api";

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both current and new passwords are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      toast.success("Password changed. Please sign in again.");
      await logout();
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Email / Identifier Section */}
      <div className="rounded-xl  border border-foreground/10 bg-card shadow-xs">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold text-foreground">Email Address</h2>
              <p className="text-xs text-muted-foreground">
                Your primary login email address and security alerts recipient.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-foreground bg-muted/60 px-3 py-1.5 rounded-lg  border border-foreground/10">
                {user?.email || "user@example.com"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                <Check size={12} />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Rotation Card */}
      <div className="rounded-xl border border-foreground/10 bg-card shadow-xs">
        <form onSubmit={handleUpdatePassword}>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Update Password</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a strong password with at least 8 characters. Changing your password signs you out everywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Current Password</label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border border-foreground/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">New Password</label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border border-foreground/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border border-foreground/10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPass ? "Hide typed passwords" : "Show passwords"}</span>
              </button>
            </div>
          </div>

          <div className="px-6 py-3 bg-muted/30  flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingPassword}
              className="h-8 px-4 text-xs font-medium"
            >
              {isUpdatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save password
            </Button>
          </div>
        </form>
      </div>

      {/* 2FA Card */}
      <div className="rounded-xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Two-Factor Authentication</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                Inactive
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of protection by requiring a 6-digit TOTP code during sign-in.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.info("Two-Factor setup is rolling out soon.")}
            className="h-8 text-xs font-medium shrink-0"
          >
            Configure
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-foreground/10 bg-destructive/[0.015] shadow-xs">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold text-destructive">Delete Account</h2>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
              Permanently delete your profile, articles, comments, and keys. This operation is irrecoverable.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => toast.error("Account deletion requires confirmation via email.")}
            className="h-8 text-xs font-medium border border-res-500 text-red-500 shrink-0"
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}