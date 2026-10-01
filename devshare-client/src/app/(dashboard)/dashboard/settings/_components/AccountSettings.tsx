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
  EyeOff,
  ShieldCheck,
  KeyRound,
  LogOut,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { changePasswordApi, revokeOtherSessionsApi, deleteAccountApi } from "@/lib/api";

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sessions state
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Live password validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

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
    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, and numbers."
      );
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      toast.success("Password changed successfully. Please sign in again.");
      await logout();
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingSessions(true);
    try {
      await revokeOtherSessionsApi();
      toast.success("Signed out of all other active sessions.");
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke other sessions.");
    } finally {
      setIsRevokingSessions(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteAccountApi({ password: deletePassword || undefined });
      toast.success("Your account has been deleted.");
      await logout();
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const formattedLastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Active currently";

  const formattedJoined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "DevShare Member";

  return (
    <div className="space-y-8">
      {/* Block 1: Account Identity & Status */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Contributor Account
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Your primary authentication credentials and contributor standing on DevShare.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-medium text-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-foreground/10">
                {user?.email || "contributor@devshare.io"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                <Check size={12} />
                Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-foreground/10 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">Contributor Role</span>
              <span className="font-medium text-foreground capitalize">
                {user?.role === "admin" ? "Platform Admin" : "Technical Contributor"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Authentication Method</span>
              <span className="font-medium text-foreground capitalize">
                {user?.provider ? `${user.provider} OAuth` : "Email & Password"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Member Since</span>
              <span className="font-medium text-foreground">
                {formattedJoined}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Block 2: Password Rotation Card */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <form onSubmit={handleUpdatePassword}>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <KeyRound size={16} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Change Password
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your authentication key. Changing password signs you out across all sessions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Current Password
                </label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border-foreground/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  New Password
                </label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border-foreground/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Confirm New Password
                </label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-9 text-xs font-mono border-foreground/10"
                  required
                />
              </div>
            </div>

            {/* Live Password Criteria */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                  hasMinLength
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-foreground/10"
                }`}
              >
                <Check size={11} className={hasMinLength ? "opacity-100" : "opacity-30"} />
                8+ characters
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                  hasUppercase
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-foreground/10"
                }`}
              >
                <Check size={11} className={hasUppercase ? "opacity-100" : "opacity-30"} />
                Uppercase letter
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                  hasLowercase
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-foreground/10"
                }`}
              >
                <Check size={11} className={hasLowercase ? "opacity-100" : "opacity-30"} />
                Lowercase letter
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                  hasNumber
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-foreground/10"
                }`}
              >
                <Check size={11} className={hasNumber ? "opacity-100" : "opacity-30"} />
                Number (0-9)
              </span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPass ? "Hide typed passwords" : "Show typed passwords"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-b-2xl bg-muted/20 border-t border-foreground/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Ensure you have saved your active article drafts before updating password.
            </p>
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingPassword}
              className="h-8 px-5 text-xs font-medium cursor-pointer"
            >
              {isUpdatingPassword && (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Block 3: Active Sessions & Security */}
      <div className="rounded-2xl border border-foreground/10 bg-card shadow-xs">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Active Devices & Sessions
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Manage your signed-in browser sessions. Last recorded login:{" "}
              <span className="font-mono text-foreground">{formattedLastLogin}</span>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRevokeOtherSessions}
            disabled={isRevokingSessions}
            className="h-8 text-xs font-medium gap-1.5 shrink-0 cursor-pointer"
          >
            {isRevokingSessions ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut size={13} />
            )}
            Sign Out Other Sessions
          </Button>
        </div>
      </div>

      {/* Block 4: Danger Zone */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.015] shadow-xs">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-destructive" />
              <h2 className="text-base font-semibold text-destructive">
                Delete Contributor Account
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
              Permanently remove your contributor profile, published articles, and author records. This operation cannot be reversed.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="h-8 text-xs font-medium shrink-0 cursor-pointer"
          >
            Delete Account
          </Button>
        </div>

        {/* Delete Confirmation Expansion */}
        {showDeleteModal && (
          <div className="p-6 border-t border-destructive/20 bg-destructive/[0.03] space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
                Confirm Irreversible Account Deletion
              </span>
              <p className="text-xs text-muted-foreground">
                To confirm deletion, type <span className="font-mono font-bold text-foreground">DELETE</span> in the box below.
              </p>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-3 max-w-md">
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="h-9 text-xs font-mono border-destructive/30"
                required
              />

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={deleteConfirmation !== "DELETE" || isDeletingAccount}
                  className="h-8 text-xs font-medium cursor-pointer"
                >
                  {isDeletingAccount && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  )}
                  Permanently Delete My Account
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                    setDeletePassword("");
                  }}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}