"use client";

import React, { useState } from "react";
import { User, Shield, Sliders, Terminal, Cpu } from "lucide-react";
import ProfileSettings from "./_components/ProfileSettings";
import AccountSettings from "./_components/AccountSettings";
import DevSettings from "./_components/DevSettings";

const TABS = [
  { id: "profile", label: " Profile", icon: User},
  { id: "account", label: "Security ", icon: Shield },
  { id: "dev", label: " Preferences", icon: Sliders },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10 pb-6">
        <div>
         
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Account & Workspace
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Configure your public engineer profile, security policies, and IDE preferences.
          </p>
        </div>

        
      </div>

      {/* Main Grid: Nav + Dynamic Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 shrink-0 lg:w-full text-left ${
                    isActive
                      ? "bg-foreground text-background shadow-lg shadow-foreground/5"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`transition-colors ${
                        isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </div>
                  
                </button>
              );
            })}
          </nav>

        
        </aside>

        {/* Dynamic Content Panel */}
        <section className="lg:col-span-9 bg-background/60 backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 sm:p-10 shadow-xl shadow-foreground/[0.01]">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "dev" && <DevSettings />}
        </section>
      </div>
    </div>
  );
}