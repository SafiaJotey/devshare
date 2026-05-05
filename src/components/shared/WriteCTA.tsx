'use client'

import { Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

const WriteCTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    // Add your newsletter logic here (e.g., Mailchimp, Resend, etc.)
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl border border-foreground/5 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        
        {/* Decorative Blur Blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 px-6 py-12 md:py-20 flex flex-col items-center text-center">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-foreground/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
              Weekly Digest
            </span>
          </div>

          {/* Text Content */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl">
            Level up your stack with <span className="text-primary">The Weekly Commit.</span>
          </h2>
          
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            A curated flow of refined technical knowledge. Join 5,000+ developers receiving our latest thoughts on software architecture and design.
          </p>

          {/* Form */}
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              Subscribe
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>

          {/* Micro-copy / Trust Element */}
          <div className="mt-6 flex items-center gap-2 text-foreground/40 text-sm">
            <ShieldCheck className="w-4 h-4 text-primary/60" />
            <p>Only high-quality code, no fluff. Unsubscribe anytime.</p>
          </div>

        </div>
      </div>
    </section>
  );
};
export default  WriteCTA