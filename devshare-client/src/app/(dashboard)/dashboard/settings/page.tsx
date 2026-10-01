"use client";

import React, { useState } from "react";
import { User, Shield, Sliders } from "lucide-react";
import ProfileSettings from "./_components/ProfileSettings";
import AccountSettings from "./_components/AccountSettings";
import PreferencesSettings from "./_components/PreferencesSettings";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Sliders },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <div className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 py-10 sm:py-14 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground font-normal">
            Manage your contributor identity, security credentials, and publishing preferences.
          </p>
        </div>

        {/* Tab Switcher (Linear / Raycast Style) */}
        <div className="border-b border-foreground/10">
          <nav className="flex gap-6 -mb-px overflow-x-auto scrollbar-none" aria-label="Settings tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`group inline-flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-all relative border-b-2 cursor-pointer ${
                    isActive
                      ? "border-foreground text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Section Outlet */}
        <div className="pt-2">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
        </div>
      </div>
    </div>
  );
}