"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 

  Mail, 
  Key, 
  AlertTriangle, 
  Smartphone,
  ChevronRight
} from "lucide-react";

export default function AccountSettings() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. EMAIL SECTION */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Mail size={20} className="text-primary" />
            Communication Channel
          </h3>
          <p className="text-sm text-foreground/40 mt-1">Manage your primary login and contact email.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Registered Email</Label>
            <div className="relative">
              <Input 
                defaultValue="arjun.sharma@engineer.com" 
                className="rounded-xl border-foreground/10 bg-foreground/[0.02] pl-4 pr-24 h-12" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded-md border border-emerald-500/20">
                VERIFIED
              </div>
            </div>
          </div>
          <Button variant="outline" className="h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 font-bold text-xs uppercase tracking-widest">
            Change Email
          </Button>
        </div>
      </section>

      <Separator className="bg-foreground/5" />

      {/* 2. PASSWORD SECTION */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Key size={20} className="text-primary" />
            Security Credentials
          </h3>
          <p className="text-sm text-foreground/40 mt-1">Ensure your account uses a complex architectural password.</p>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl border-foreground/10 bg-foreground/[0.02] h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-black text-foreground/40">New Security String</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl border-foreground/10 bg-foreground/[0.02] h-11" />
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 h-11 font-bold text-xs uppercase tracking-widest transition-all">
            Update Credentials
          </Button>
        </div>
      </section>

      <Separator className="bg-foreground/5" />

      {/* 3. TWO FACTOR SECTION */}
      <section className="p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
             <Smartphone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-base">Two-Factor Authentication (2FA)</h4>
            <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
              Add an extra layer of security by requiring a verification code from your mobile device during login.
            </p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold h-11 px-6 whitespace-nowrap">
           Setup 2FA <ChevronRight size={16} className="ml-2" />
        </Button>
      </section>

      {/* 4. DANGER ZONE */}
      <section className="mt-20 border border-red-500/10 rounded-[2rem] overflow-hidden">
        <div className="bg-red-500/5 px-8 py-4 border-b border-red-500/10 flex items-center gap-2 text-red-600">
           <AlertTriangle size={16} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Danger Zone // Nuclear Option</span>
        </div>
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-foreground">Terminate Account</h4>
            <p className="text-xs text-foreground/40">
              Once deleted, all your technical blogs, drafts, and analytics will be purged from our servers.
            </p>
          </div>
          <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold h-11 px-6 border border-red-500/10">
            Purge All Records
          </Button>
        </div>
      </section>

    </div>
  );
}