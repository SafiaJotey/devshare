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
  Layers 
} from "lucide-react";

const About = () => {
  return (
    <div className="space-y-32 pb-20 overflow-hidden">
      {/* SECTION 1: HERO MANIFESTO */}
      <section className="pt-32 px-4 text-center relative">
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

      {/* SECTION 2: THE PILLARS (Bento Style) */}
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

      {/* SECTION 3: THE KNOWLEDGE STACK (Converted to Section Component) */}
      <Section 
        headerComponent={<></>} // This hides the default top-header
        className="py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Content Depth */}
          <div className="order-2 lg:order-1">
            <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">The Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 leading-tight">
              Spanning the full stack of <span className="text-primary italic">modern engineering.</span>
            </h2>
            
            <p className="text-foreground/70 mb-10 text-lg leading-relaxed">
              Dev Share isn’t limited to syntax. We host deep-dives across the entire development spectrum, ensuring every contributor brings &quot;production-ready&quot; perspective to the table.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {[
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
              ))}
            </div>
            
            {/* Quality Badge */}
            <div className="mt-12 p-6 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-start gap-4">
              <CheckCircle2 className="text-accent shrink-0" size={24} />
              <div>
                <p className="text-sm font-semibold">Strict Quality Protocol</p>
                <p className="text-xs text-foreground/50 mt-1">Every article undergoes a multi-step verification for technical accuracy, code validity, and architectural relevance.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Creative Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative glass-card rounded-[2.5rem] border border-foreground/10 overflow-hidden shadow-2xl bg-background/50 backdrop-blur-md">
              <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">knowledge_base.sys</span>
              </div>

              <div className="p-8 space-y-8 font-mono">
                  <div className="space-y-3">
                      <div className="flex justify-between text-[10px] opacity-50 uppercase tracking-tighter">
                          <span>Active Domains</span>
                          <span>Load: 98.2%</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {["React", "Rust", "Kubernetes", "Next.js", "PostgreSQL", "AWS", "Python", "TypeScript", "Docker"].map((tag) => (
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
                          <span className="text-xs">Validating Distributed Systems Case Study...</span>
                      </div>
                      <div className="flex items-center gap-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-xs">Scanning Edge Function Benchmarks...</span>
                      </div>
                  </div>

                  <div className="mt-4 bg-primary/5 rounded-xl p-4 border border-primary/20  group-hover:rotate-0 transition-transform duration-500">
                      <div className="flex gap-2 mb-2">
                          <Layers size={14} className="text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase">Architecture Pattern</span>
                      </div>
                      <p className="text-[12px] leading-tight text-foreground/80">
                          Implementing Micro-Frontends: A study on module federation and team decoupling
                      </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4: THE FLYWHEEL */}
      <section className="bg-foreground text-background py-24 rounded-[3rem] mx-4 overflow-hidden relative">
        <div className="container-box relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight">The <span className="text-accent underline decoration-1 underline-offset-8">Flywheel</span> of Growth</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full border border-background/20 flex items-center justify-center text-accent"><Users /></div>
                    <h3 className="text-xl font-bold">Learn</h3>
                    <p className="text-background/60 text-sm">Absorb insights from engineers who have already solved your problem.</p>
                </div>
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full border border-background/20 flex items-center justify-center text-accent"><Zap /></div>
                    <h3 className="text-xl font-bold">Build</h3>
                    <p className="text-background/60 text-sm">Apply the knowledge to your projects with confidence and speed.</p>
                </div>
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full border border-background/20 flex items-center justify-center text-accent"><Rocket /></div>
                    <h3 className="text-xl font-bold">Share</h3>
                    <p className="text-background/60 text-sm">Write about your journey and solidify your own mastery.</p>
                </div>
            </div>
        </div>
      </section>

      <ReadyToContribute />
      <WriteCTA />
    </div>
  );
};

export default About;