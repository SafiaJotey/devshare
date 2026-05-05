"use client";

import { useState } from "react";
import Link from "next/link";
import { 

  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Chrome, 
  Linkedin, 
  Facebook 
} from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      
      {/* LEFT SIDE: BRAND CONTENT (Hidden on mobile) */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
            </div>
            DEV SHARE
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Join the collective <span className="text-accent italic">intelligence.</span>
          </h2>
          <ul className="space-y-4">
            {[
              "Share your architectural insights",
              "Connect with senior engineers",
              "Personalized technical feed",
              "Ad-free reading experience"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-background/70">
                <CheckCircle2 size={18} className="text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-background/40">
          © 2024 Dev Share. All rights reserved. Built for engineers.
        </div>
      </section>

      {/* RIGHT SIDE: AUTH FORM */}
      <section className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-foreground/50 mt-2">
              {isLogin 
                ? "Enter your credentials to access your dashboard." 
                : "Join the most curious community of developers."}
            </p>
          </div>

          {/* SOCIAL LOGINS */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
              <Chrome size={20} className="group-hover:text-primary" />
            </button>
            <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
              <Linkedin size={20} className="group-hover:text-primary" />
            </button>
            <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
              <Facebook size={20} className="group-hover:text-primary" />
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-foreground/40 font-bold tracking-widest">Or continue with email</span>
            </div>
          </div>

          {/* EMAIL FORM */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 block mb-2">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">Password</label>
                {isLogin && <button className="text-xs text-primary font-bold hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? "Sign up for free" : "Log in here"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}