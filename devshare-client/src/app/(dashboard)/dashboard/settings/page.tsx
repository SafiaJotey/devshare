"use client";

import React, { useState } from "react";
import { User, Shield, Cog,  Save, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileSettings from "./_components/ProfileSettings";
import AccountSettings from "./_components/AccountSettings";
import DevSettings from "./_components/DevSettings";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "dev", label: "Preferences", icon: Cog },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
         
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
            Settings 
          </h1>
        </div>
        <Button className="bg-primary text-white rounded-xl gap-2 h-12 px-8 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Save size={18} /> Sync Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SIDE NAVIGATION */}
        <aside className="lg:col-span-2 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-lg translate-x-2"
                  : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "text-accent" : ""} />
              {tab.label}
            </button>
          ))}
          
          <div className="mt-10 p-6 rounded-3xl bg-primary/5 border border-primary/10">
             <div className="flex items-center gap-2 text-primary mb-2">
                <Terminal size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Node Status</span>
             </div>
             <p className="text-[11px] text-foreground/50 leading-relaxed">
                Your profile is 85% complete. Adding a GitHub link increases visibility.
             </p>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="lg:col-span-10 bg-background border border-foreground/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-foreground/[0.02] min-h-[600px]">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "dev" && <DevSettings />}
        </div>
      </div>
    </div>
  );
}