"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  BookOpen, 
  PenTool, 
  Zap, 
  MessageSquare,
  Code2,
  Users,
  GitBranch,
  Rocket,
  ShieldCheck,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  FileCode,
  Sparkles,
  Command,
  HelpCircle
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const READER_FAQS = [
  { 
    id: "r1",
    tag: "Access",
    q: "Is technical content on DevShare free to read?", 
    a: "Yes. Our core mission is the open exchange of technical wisdom. All deep dives, architecture diagrams, and system implementation guides are accessible to the community without paywalls or forced subscription traps." 
  },
  { 
    id: "r2",
    tag: "Quality",
    q: "How are code snippets and architecture diagrams verified?", 
    a: "Every article runs through our automated 'Signal Check' pipeline to ensure syntax validity, code formatting, and structure before going live. Community peer reviews and inline discussions further audit accuracy." 
  },
  { 
    id: "r3",
    tag: "Storage",
    q: "Can I save articles and code blocks for reference?", 
    a: "Yes. Registered engineers can bookmark publications directly to their personal DevShare Dashboard, organize topics by technology domain, and access author references whenever needed." 
  },
  { 
    id: "r4",
    tag: "RSS & API",
    q: "Can I subscribe to category-specific feeds?", 
    a: "You can filter feeds by categories such as Frontend, Backend, DevOps, AI & Data, and Security. Public API query endpoints are also available for headless consumption." 
  }
];

const CONTRIBUTOR_FAQS = [
  { 
    id: "c1",
    tag: "Standards",
    q: "What defines 'No-Fluff' engineering content on DevShare?", 
    a: "We prioritize implementation clarity over surface-level overviews. We ask authors to bypass generic dictionary definitions and dive straight into architectural trade-offs, benchmarks, code logic, and edge-case pitfalls." 
  },
  { 
    id: "c2",
    tag: "Editor",
    q: "How does the DevShare Block Editor work?", 
    a: "The editor is built with modular drag-and-drop primitives. You can interlock headings, markdown paragraphs, syntax-highlighted code blocks, blockquotes, and uploaded imagery stored natively in MongoDB." 
  },
  { 
    id: "c3",
    tag: "SEO",
    q: "Can I cross-post articles from personal tech blogs?", 
    a: "Yes. DevShare respects your original content authority. You can define canonical URLs and retain full authorship rights across personal publications and external platforms." 
  },
  { 
    id: "c4",
    tag: "Review",
    q: "How long does publication verification take?", 
    a: "Once you hit 'Publish Article', our pipeline performs AST checks, plagiarism scans, and spam detection. Approved posts are indexed in our database and pushed to the global live feed within minutes." 
  }
];

const CATEGORY_TAGS = ["All", "Reading", "Writing", "Editor", "Security", "Roadmap"];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredReaderFaqs = useMemo(() => {
    return READER_FAQS.filter((faq) => {
      const matchesSearch = 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = 
        activeCategory === "All" || 
        activeCategory === "Reading" || 
        faq.tag.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeCategory]);

  const filteredContributorFaqs = useMemo(() => {
    return CONTRIBUTOR_FAQS.filter((faq) => {
      const matchesSearch = 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = 
        activeCategory === "All" || 
        activeCategory === "Writing" || 
        activeCategory === "Editor" || 
        faq.tag.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 border-b border-foreground/10 overflow-hidden bg-gradient-to-b from-foreground/[0.03] to-transparent">
        {/* Subtle Engineering Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="help-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#help-grid)" />
          </svg>
        </div>

        {/* Ambient Gradient Blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-box relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 shadow-xs">
            <Terminal size={13} className="animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest">
              DevShare Docs // Ops v2.4
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground uppercase leading-[1.05] mb-6">
            Developer Operations &{" "}
            <span className="text-primary italic font-serif lowercase">Knowledge Base</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed mb-8">
            Complete technical guide to reading architecture deep dives, using our modular block editor, and publishing validated engineering blogs.
          </p>

          {/* Interactive Search Console */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity blur-md" />
            <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-foreground/15 rounded-2xl shadow-xl overflow-hidden px-4 h-13">
              <Search size={18} className="text-foreground/40 shrink-0 mr-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search troubleshooting, editor keys, verification protocols..."
                className="border-0 shadow-none focus-visible:ring-0 text-sm h-full bg-transparent px-0 placeholder:text-foreground/40 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-mono text-foreground/40 hover:text-foreground ml-2 px-2 py-1 rounded bg-foreground/5 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === tag
                    ? "bg-foreground text-background font-bold shadow-md"
                    : "bg-foreground/[0.04] text-foreground/60 hover:text-foreground hover:bg-foreground/10 border border-foreground/5"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK WORKFLOW CARDS */}
      <section className="container-box py-16 -mt-8 relative z-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Reader Track Card */}
          <div className="group relative rounded-3xl bg-background/80 backdrop-blur-md border border-foreground/10 hover:border-primary/40 p-8 sm:p-10 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            
            <div>
              <div className="w-13 h-13 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-primary/20">
                <BookOpen size={24} />
              </div>

              <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-primary font-bold uppercase tracking-wider">
                <span>Phase 01</span>
                <span>//</span>
                <span>Consumption</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Consume <span className="text-primary italic">Deep Logic</span>
              </h2>

              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                Curated for developers who prioritize architecture over hype. Navigate by technology stacks and master real-world production setups.
              </p>

              <div className="space-y-3 font-sans text-sm">
                {[
                  "Domain Filter: Filter by Frontend, DevOps, Backend, and AI",
                  "Bookmark Pipeline: Save insights to your personal workspace",
                  "Verified Code: Inspect syntax-checked snippets and benchmarks",
                  "Author Signals: Follow architects to track new system releases"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-foreground/80">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-foreground/10 flex items-center justify-between">
              <span className="text-xs font-mono text-foreground/40">Read Guidelines</span>
              <Link 
                href="/blogs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline font-mono"
              >
                Browse Articles <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Contributor Track Card */}
          <div className="group relative rounded-3xl bg-foreground text-background p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-4 right-4 opacity-5 rotate-12 group-hover:rotate-6 transition-transform duration-500 pointer-events-none">
              <Code2 size={160} />
            </div>

            <div>
              <div className="w-13 h-13 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-accent/30">
                <PenTool size={24} />
              </div>

              <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-accent font-bold uppercase tracking-wider">
                <span>Phase 02</span>
                <span>//</span>
                <span>Contribution</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Publish <span className="text-accent italic">Architecture</span>
              </h2>

              <p className="text-sm text-background/70 leading-relaxed mb-6">
                Turn your debugging scars and design specs into high-signal publications with our drag-and-drop block editor.
              </p>

              <div className="space-y-3 font-sans text-sm">
                {[
                  "Modular Blocks: Reorder headings, code, and images intuitively",
                  "MongoDB Media: Store diagrams and screenshots directly",
                  "Automated Linter: Run real-time checks on code blocks",
                  "Canonical URLs: Preserve existing search authority seamlessly"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-background/90">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-background/15 flex items-center justify-between">
              <span className="text-xs font-mono text-background/50">Author Workspace</span>
              <Link 
                href="/dashboard/create-blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline font-mono"
              >
                Launch Block Editor <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED LOGIC (ACCORDION SECTION) */}
      <section className="container-box py-16 px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-foreground/[0.04] text-primary border border-foreground/10 mb-3">
            <HelpCircle size={13} />
            Query_Repository
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Frequently Asked <span className="text-primary italic font-serif lowercase">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground/50 mt-2">
            Instant answers for readers and contributing software engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Reader Track FAQ */}
          <div className="p-6 sm:p-8 rounded-3xl bg-foreground/[0.015] border border-foreground/10 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-foreground/10">
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-primary" />
                <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider font-mono">
                  For Knowledge Seekers
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                {filteredReaderFaqs.length} Entries
              </span>
            </div>

            {filteredReaderFaqs.length === 0 ? (
              <p className="text-xs font-mono text-foreground/40 py-8 text-center">
                No matching reader queries found.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredReaderFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="border border-foreground/5 rounded-2xl px-4 bg-background/50 hover:border-foreground/15 transition-all"
                  >
                    <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm py-4 hover:no-underline text-foreground hover:text-primary transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/50 border border-foreground/10">
                          {faq.tag}
                        </span>
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-xs sm:text-sm leading-relaxed pb-4 pt-1 font-sans">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Contributor Track FAQ */}
          <div className="p-6 sm:p-8 rounded-3xl bg-foreground/[0.015] border border-foreground/10 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-foreground/10">
              <div className="flex items-center gap-2.5">
                <Zap size={18} className="text-accent" />
                <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider font-mono">
                  For Insight Architects
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">
                {filteredContributorFaqs.length} Entries
              </span>
            </div>

            {filteredContributorFaqs.length === 0 ? (
              <p className="text-xs font-mono text-foreground/40 py-8 text-center">
                No matching author queries found.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredContributorFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="border border-foreground/5 rounded-2xl px-4 bg-background/50 hover:border-foreground/15 transition-all"
                  >
                    <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm py-4 hover:no-underline text-foreground hover:text-accent transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/50 border border-foreground/10">
                          {faq.tag}
                        </span>
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-xs sm:text-sm leading-relaxed pb-4 pt-1 font-sans">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

        </div>
      </section>

      {/* VERIFICATION PIPELINE & TERMINAL DEMO */}
      <section className="container-box py-16 px-4">
        <div className="rounded-3xl bg-foreground/[0.02] border border-foreground/10 p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={14} />
                Protocol // Quality Engine
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Automated <span className="text-primary italic font-serif lowercase">Signal Check</span>
              </h2>

              <p className="text-sm text-foreground/60 leading-relaxed">
                To guarantee zero clickbait, every piece of content submitted through our block editor is audited via our automated pipeline.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Deterministic Validation", desc: "Zod schemas validate article structures, read-time, and metadata." },
                  { title: "Clean Code Guarantee", desc: "Markdown code snippets are parsed to prevent broken layouts." },
                  { title: "Plagiarism & Spam Guard", desc: "Heuristic checks verify original technical thinking." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground font-mono">{item.title}</h4>
                      <p className="text-xs text-foreground/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Pipeline Terminal */}
            <div className="lg:col-span-7 bg-[#07120D] border border-emerald-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl font-mono text-xs overflow-hidden text-emerald-400">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="text-[10px] text-emerald-500/50 ml-2">devshare-verify-daemon.sh</span>
                </div>
                <span className="text-[10px] text-emerald-500/40">node_v22.4 // active</span>
              </div>

              <div className="space-y-2 leading-relaxed">
                <p className="text-emerald-500/40">{"//"} 1. Ingesting publication payload from Block Editor...</p>
                <p className="text-foreground">
                  <span className="text-emerald-500">[AST_PARSER]</span> parsing blocks (headings, code, media)... <span className="text-emerald-300 font-bold">OK</span>
                </p>
                <p className="text-foreground">
                  <span className="text-emerald-500">[DB_DRIVER]</span> validating native MongoDB document schema... <span className="text-emerald-300 font-bold">200 OK</span>
                </p>
                <p className="text-foreground">
                  <span className="text-emerald-500">[SYNTAX_LINT]</span> scanning TypeScript & Go code snippets... <span className="text-emerald-300 font-bold">PASS (0 errors)</span>
                </p>
                <p className="text-foreground">
                  <span className="text-emerald-500">[CANONICAL]</span> checking SEO meta and author attribution... <span className="text-emerald-300 font-bold">VALIDATED</span>
                </p>
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                  <span className="font-bold text-[11px]">BUILD RESULT: READY_FOR_FEED</span>
                  <span className="text-[10px] opacity-75">LATENCY: 12ms</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM ROADMAP */}
      <section className="container-box py-16 px-4">
        <div className="rounded-3xl bg-primary/[0.03] border border-primary/15 p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Rocket size={15} />
                <span>Ecosystem Evolution</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Platform Roadmap
              </h3>
            </div>
            <span className="text-xs font-mono text-foreground/50 self-start sm:self-auto px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10">
              DevShare Core v3.0 Specs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quarter: "MILESTONE 01",
                title: "Dynamic Canvas Architecture",
                desc: "Direct integration of interactive Mermaid.js diagrams inside the dynamic block editor.",
                status: "Live in Core"
              },
              {
                quarter: "MILESTONE 02",
                title: "Live Collaborative Pair-Writing",
                desc: "Real-time presence and concurrent draft editing with operational transformation primitives.",
                status: "In Staging"
              },
              {
                quarter: "MILESTONE 03",
                title: "DevShare Headless API",
                desc: "Expose your published articles via REST & GraphQL to embed directly into personal portfolio sites.",
                status: "Planned"
              },
            ].map((milestone, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-background/60 border border-foreground/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-primary">
                      {milestone.quarter}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                      {milestone.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-foreground/50 leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT & CONTACT CTA */}
      <section className="container-box px-4">
        <div className="rounded-3xl bg-foreground text-background p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <Cpu className="absolute -bottom-16 -right-16 text-background/[0.04] pointer-events-none" size={320} />

          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-background/10 text-accent border border-background/20 font-bold">
              Engineering Support Node
            </span>

            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Still encountering <span className="text-primary italic">anomalies?</span>
            </h3>

            <p className="text-sm sm:text-base text-background/70 leading-relaxed max-w-lg mx-auto">
              Our support architects can help resolve publication pipeline errors, auth session issues, or author account configurations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button 
                onClick={() => window.location.href = "mailto:support@devshare.io"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-8 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Contact Support
              </Button>

              <Button 
                asChild
             
                className="rounded-xl h-12 px-8 font-mono text-xs uppercase tracking-wider font-bold bg-background/10 cursor-pointer"
              >
                <Link href="/dashboard">
                  Open Workspace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}