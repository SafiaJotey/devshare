"use client";

import { useState } from "react";
import ReadyToContribute from "@/components/shared/ReadyToContribute";
import Section from "@/components/shared/Section";
import WriteCTA from "@/components/shared/WriteCTA";
import { 
  Code2, 
  Share2, 
  Lightbulb, 
  CheckCircle2, 
  Rocket, 
  Users, 
  Zap, 
  Globe, 
  Terminal, 
  Cpu, 
  Lock, 
  Layers,
  ArrowRight
} from "lucide-react";

const ecosystemFields = [
  {
    icon: Globe,
    title: "Frontend Mastery",
    shortTitle: "Frontend",
    desc: "Beyond UIâ€”focusing on performance, accessibility, and state management.",
    load: "94.8%",
    domains: ["React", "Next.js", "TypeScript", "CSS", "Web Vitals", "a11y"],
    events: ["Profiling a slow route transition...", "Auditing keyboard navigation..."],
    pattern: "Rendering for the real world: performance budgets, accessible interactions, and resilient UI state.",
  },
  {
    icon: Terminal,
    title: "Backend & Systems",
    shortTitle: "Backend",
    desc: "Scalable architecture, API design, and database optimization strategies.",
    load: "98.2%",
    domains: ["Node.js", "PostgreSQL", "Redis", "gRPC", "Queues", "API Design"],
    events: ["Tracing an API latency spike...", "Reviewing an event-driven workflow..."],
    pattern: "Designing services that stay observable, dependable, and easy for teams to evolve.",
  },
  {
    icon: Cpu,
    title: "AI & Data",
    shortTitle: "AI & Data",
    desc: "Integrating LLMs, machine learning pipelines, and data engineering.",
    load: "91.6%",
    domains: ["Python", "LLMs", "Vector DBs", "Pipelines", "Analytics", "MLOps"],
    events: ["Evaluating retrieval quality...", "Checking a feature pipeline..."],
    pattern: "Shipping intelligent systems with useful evaluation, reliable data, and responsible guardrails.",
  },
  {
    icon: Lock,
    title: "DevOps & Security",
    shortTitle: "DevOps",
    desc: "CI/CD automation, cloud infrastructure, and hardening your code.",
    load: "96.4%",
    domains: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Security"],
    events: ["Validating a deployment policy...", "Scanning infrastructure changes..."],
    pattern: "Building delivery systems that make secure, repeatable releases the effortless default.",
  },
];

const About = () => {
  const [activeEcosystem, setActiveEcosystem] = useState(0);
  const activeField = ecosystemFields[activeEcosystem];
  const ActiveFieldIcon = activeField.icon;

  return (
    <div className="space-y-32 pb-20 overflow-hidden">
   
      <section className="pt-20 px-4 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">The Philosophy</span>
          <h1 className="text-5xl md:text-8xl font-bold mt-6 mb-8 leading-[1.05] tracking-tight text-foreground">
            Where technical <span className="text-primary italic font-serif">intuition</span> meets collective wisdom.
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Dev Share started as a simple idea: the best way to master a technology is to explain it to someone else. Today, we are a growing collective of engineers distilling complex concepts into readable insights.
          </p>
        </div>
      </section>

 
      <Section
        tag="Our Pillars"
        title="Built for the modern engineer"
        subtitle="We aren't just another blog. We are a repository of shared experiences."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-foreground text-background md:col-span-2 overflow-hidden relative group border border-foreground/5">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Code2 size={160} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Refined Content</h3>
            <p className="text-background/70 max-w-md text-lg leading-relaxed">
              We move away from the clickbait culture. Every article on Dev Share is reviewed for technical accuracy and clarity, ensuring you spend your time learning, not debugging.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-foreground/10 bg-accent/5 hover:bg-accent/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-accent text-foreground flex items-center justify-center mb-6">
              <Share2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Open Sharing</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Every developer has a unique solution to a problem. We provide the stage; you provide the insight.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-foreground/10 bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Architecture Mindset</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              We go beyond syntax. Our contributors focus on the why—helping you understand system design and patterns.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-primary text-primary-foreground md:col-span-2 shadow-xl shadow-primary/10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black mb-2 italic tracking-tighter text-primary-foreground">NO FLUFF.</h3>
                  <p className="opacity-80">Just high-signal engineering documentation for the curious mind.</p>
               </div>
               <div className="h-px w-full md:w-px md:h-20 bg-primary-foreground/20" />
               <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold tracking-tighter">12k+</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Readers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold tracking-tighter">800+</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Articles</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

   
      <Section 
        headerComponent={<></>} 
        className="py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="order-2 lg:order-1">
            <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">The Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 leading-tight">
              Spanning the full stack of <span className="text-primary italic">modern engineering.</span>
            </h2>
            
            <p className="text-foreground/70 mb-10 text-lg leading-relaxed">
              Dev Share isn’t limited to syntax. We host deep-dives across the entire development spectrum, ensuring every contributor brings &quot;production-ready&quot; perspective to the table.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/*
                { icon: <Globe className="text-primary" size={20} />, title: "Frontend Mastery", desc: "Beyond UI—focusing on performance, accessibility, and state management." },
                { icon: <Terminal className="text-primary" size={20} />, title: "Backend & Systems", desc: "Scalable architecture, API design, and database optimization strategies." },
                { icon: <Cpu className="text-primary" size={20} />, title: "AI & Data", desc: "Integrating LLMs, machine learning pipelines, and data engineering." },
                { icon: <Lock className="text-primary" size={20} />, title: "DevOps & Security", desc: "CI/CD automation, cloud infrastructure, and hardening your code." }
              ].map((field, i) => (
                <div key={i} className="group">
                  <div className="mb-3 flex items-center gap-3">
                    {field.icon}
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{field.title}</h4>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed">{field.desc}</p>
                </div>
              */}
              {ecosystemFields.map((field, i) => {
                const FieldIcon = field.icon;
                const isActive = i === activeEcosystem;

                return (
                  <button
                    key={field.title}
                    type="button"
                    onClick={() => setActiveEcosystem(i)}
                    aria-pressed={isActive}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-primary/35 bg-primary/[0.07] shadow-lg shadow-primary/5"
                        : "border-transparent hover:border-foreground/10 hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                        <FieldIcon size={18} />
                      </span>
                      <div>
                        <h4 className={`font-bold transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{field.title}</h4>
                        <span className={`mt-1 block font-mono text-[9px] font-bold uppercase tracking-[0.16em] ${isActive ? "text-accent" : "text-foreground/35"}`}>
                          {isActive ? "Viewing in console" : "Explore discipline"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/60">{field.desc}</p>
                  </button>
                );
              })}
            </div>
            
 
            <div className="mt-12 p-6 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-start gap-4">
              <CheckCircle2 className="text-accent shrink-0" size={24} />
              <div>
                <p className="text-sm font-semibold">Strict Quality Protocol</p>
                <p className="text-xs text-foreground/50 mt-1">Every article undergoes a multi-step verification for technical accuracy, code validity, and architectural relevance.</p>
              </div>
            </div>
          </div>

    
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            
            <div key={activeField.title} aria-live="polite" className="relative glass-card animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-[2.5rem] border border-foreground/10 overflow-hidden shadow-2xl bg-background/50 backdrop-blur-md">
              <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">{activeField.shortTitle.toLowerCase().replaceAll(" ", "_")}.sys</span>
              </div>

              <div className="p-8 space-y-8 font-mono">
                  <div className="flex items-start gap-4 border-b border-foreground/10 pb-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                        <ActiveFieldIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Selected discipline</p>
                        <h3 className="mt-1 font-sans text-xl font-bold tracking-tight text-foreground">{activeField.title}</h3>
                        <p className="mt-2 font-sans text-xs leading-relaxed text-foreground/60">{activeField.desc}</p>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between text-[10px] opacity-50 uppercase tracking-tighter">
                          <span>Active Domains</span>
                          <span>Load: {activeField.load}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {activeField.domains.map((tag) => (
                              <span key={tag} className="px-3 py-1 rounded-full border border-foreground/10 text-[11px] bg-background">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                      <div className="flex items-center gap-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="text-xs">{activeField.events[0]}</span>
                      </div>
                      <div className="flex items-center gap-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-xs">{activeField.events[1]}</span>
                      </div>
                  </div>

                  <div className="mt-4 bg-primary/5 rounded-xl p-4 border border-primary/20  group-hover:rotate-0 transition-transform duration-500">
                      <div className="flex gap-2 mb-2">
                          <Layers size={14} className="text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase">Architecture Pattern</span>
                      </div>
                      <p className="text-[12px] leading-tight text-foreground/80">
                          {activeField.pattern}
                      </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* THE FLYWHEEL */}
      <section className="relative mx-4 overflow-hidden rounded-[2.5rem] bg-foreground py-16 text-background sm:rounded-[3rem] sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="container-box relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Knowledge, compounded
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The <span className="font-serif italic text-accent">Flywheel</span> of Growth
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-background/65 sm:text-base">
              Every useful insight starts a loop: learn from the community, put it to work, then leave the next developer a clearer path.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-[4.5rem] hidden h-px bg-gradient-to-r from-accent/10 via-accent/60 to-accent/10 md:block" />

            <article className="group relative overflow-hidden rounded-3xl border border-background/15 bg-background/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-background/[0.09] sm:p-8">
              <span className="absolute right-6 top-6 font-mono text-[10px] font-bold tracking-[0.2em] text-background/35">01</span>
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-foreground shadow-lg shadow-accent/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users size={24} />
              </div>
              <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Discover</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Learn</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/60">
                Find the hard-won context, decisions, and lessons behind someone else&apos;s solution.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-background/75">
                Start with an insight <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-background/15 bg-background/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-background/[0.09] sm:p-8">
              <span className="absolute right-6 top-6 font-mono text-[10px] font-bold tracking-[0.2em] text-background/35">02</span>
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <Zap size={24} />
              </div>
              <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Experiment</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Build</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/60">
                Turn new understanding into stronger systems, sharper decisions, and work you can stand behind.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-background/75">
                Make it your own <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-background/15 bg-background/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-background/[0.09] sm:p-8">
              <span className="absolute right-6 top-6 font-mono text-[10px] font-bold tracking-[0.2em] text-background/35">03</span>
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Rocket size={24} />
              </div>
              <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Contribute</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Share</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/60">
                Document the path you took so the next engineer can begin further ahead.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-background/75">
                Keep the loop moving <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-background/10 bg-background/[0.04] px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-background/60"><span className="font-semibold text-background">The result:</span> knowledge that gets more useful every time it&apos;s shared.</p>
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Repeat ∞</span>
          </div>
        </div>
      </section>

      <ReadyToContribute />
      <WriteCTA />
    </div>
  );
};

export default About;
