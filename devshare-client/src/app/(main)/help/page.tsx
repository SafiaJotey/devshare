"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  PenLine, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Compass, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  ShieldCheck,
  Send,
  Layers
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Categories tailored for everyday readers and community authors
const TOPIC_FILTERS = [
  "All Topics",
  "Reading & Bookmarks",
  "Writing with Blocks",
  "Picture & Code Uploads",
  "Publishing & Guidelines",
  "Profile & Account"
];

const READER_FAQS = [
  { 
    id: "r1",
    tag: "Reading & Bookmarks",
    q: "Is all content on DevShare free to read?", 
    a: "Yes! DevShare is built on the philosophy of open, accessible knowledge sharing. Every technical article, deep dive, and tutorial across Frontend, Backend, DevOps, AI & Data, and Security is 100% free without paywalls or reading limits." 
  },
  { 
    id: "r2",
    tag: "Reading & Bookmarks",
    q: "How can I save articles to read later?", 
    a: "Once you sign in to your DevShare account, you can bookmark any article directly. All your saved insights appear neatly organized under your personal dashboard so you can reference them whenever you need." 
  },
  { 
    id: "r3",
    tag: "Reading & Bookmarks",
    q: "How do category filters and estimated read times work?", 
    a: "Every article is categorized under a core technology track (Frontend, Backend, DevOps, AI & Data, Security). Our platform calculates reading time automatically so you know whether a piece is a 3-minute quick tip or a 15-minute comprehensive architectural breakdown." 
  },
  { 
    id: "r4",
    tag: "Profile & Account",
    q: "How do I follow or support my favorite authors?", 
    a: "At the end of every article, you will find the author's card with their bio, GitHub, and Twitter links. You can explore their other published writings or connect with them across the developer community." 
  }
];

const CONTRIBUTOR_FAQS = [
  { 
    id: "c1",
    tag: "Writing with Blocks",
    q: "How do I create an article using the Block Editor?", 
    a: "Head over to your Dashboard and click 'Create Blog'. Our editor works with modular blocks—you can easily insert headings, write text, paste formatted code, add quotes, and rearrange sections simply by dragging and dropping them." 
  },
  { 
    id: "c2",
    tag: "Picture & Code Uploads",
    q: "How do I upload diagrams and photos into my posts?", 
    a: "Select the 'Image Block' inside the editor and upload any JPG, PNG, or WebP diagram (up to 2.5MB). Our platform optimizes the image for lightning-fast loading and stores it safely alongside your article." 
  },
  { 
    id: "c3",
    tag: "Publishing & Guidelines",
    q: "What is the difference between a Draft and a Published post?", 
    a: "Drafts are completely private to you. You can save your work, return to it anytime, and preview how it looks for readers. Once you hit 'Publish', your article is reviewed and goes live on the public feed for the community to discover." 
  },
  { 
    id: "c4",
    tag: "Publishing & Guidelines",
    q: "Can I cross-post an article from my personal website or Substack?", 
    a: "Yes! We welcome cross-posting as long as you are the original author. You maintain full ownership of your content and can include a canonical link or note back to your personal portfolio." 
  },
  { 
    id: "c5",
    tag: "Writing with Blocks",
    q: "What languages are supported in code snippets?", 
    a: "The code block automatically formats and highlights popular languages including JavaScript, TypeScript, Python, Go, Rust, HTML/CSS, Bash, and SQL." 
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Topics");
  const [activePersona, setActivePersona] = useState<"all" | "readers" | "contributors">("all");

  const filterList = (list: typeof READER_FAQS) => {
    return list.filter((faq) => {
      const matchesSearch = 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        activeFilter === "All Topics" || 
        faq.tag.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const filteredReaderFaqs = useMemo(() => filterList(READER_FAQS), [searchQuery, activeFilter]);
  const filteredContributorFaqs = useMemo(() => filterList(CONTRIBUTOR_FAQS), [searchQuery, activeFilter]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary selection:text-white">
      
      {/* 1. WELCOME HERO */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-foreground/10 overflow-hidden bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent">
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-box relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 shadow-xs">
            <Sparkles size={14} />
            <span className="text-xs font-semibold tracking-wide uppercase">
              DevShare Community Guide & Help
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15] mb-4">
            How can we help you today?
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed mb-8">
            Learn how to read insightful technical articles, bookmark your favorites, and write your own stories with our modular block editor.
          </p>

          {/* Clean User-Friendly Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="relative flex items-center bg-background border border-foreground/15 rounded-2xl shadow-lg px-4 h-13 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={18} className="text-foreground/40 shrink-0 mr-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search asking about reading, writing, pictures, editor..."
                className="border-0 shadow-none focus-visible:ring-0 text-sm h-full bg-transparent px-0 placeholder:text-foreground/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-medium text-foreground/40 hover:text-foreground ml-2 px-2.5 py-1 rounded-lg bg-foreground/5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {TOPIC_FILTERS.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveFilter(topic)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === topic
                    ? "bg-foreground text-background font-bold shadow-sm"
                    : "bg-foreground/[0.04] text-foreground/60 hover:text-foreground hover:bg-foreground/10 border border-foreground/5"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. READER VS CONTRIBUTOR SWITCHER TABS */}
      <section className="container-box pt-12 pb-4 px-4">
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-foreground/[0.05] border border-foreground/10">
            <button
              onClick={() => setActivePersona("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePersona === "all" ? "bg-background text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setActivePersona("readers")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePersona === "readers" ? "bg-background text-primary shadow-sm" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <BookOpen size={15} /> For Readers
            </button>
            <button
              onClick={() => setActivePersona("contributors")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePersona === "contributors" ? "bg-background text-primary shadow-sm" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <PenLine size={15} /> For Writers & Authors
            </button>
          </div>
        </div>

        {/* Action Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Reader Guide Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-background border border-foreground/10 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">Reading on DevShare</h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                Discover in-depth engineering breakdowns, learn new frameworks, and bookmark your go-to guides.
              </p>
              <ul className="space-y-3 text-sm text-foreground/80 mb-6">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Explore Frontend, Backend, DevOps, AI & Security
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Save key articles to your private workspace
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Clear estimated read times on every post
                </li>
              </ul>
            </div>
            <Button asChild className="rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs h-11">
              <Link href="/blogs" className="flex items-center justify-center gap-2">
                Browse Popular Articles <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          {/* Writer Guide Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/[0.06] to-transparent border border-primary/20 shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-5">
                <PenLine size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">Writing & Publishing</h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                Share your technical wisdom, architecture case studies, and tutorials with a passionate community.
              </p>
              <ul className="space-y-3 text-sm text-foreground/80 mb-6">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Modular drag-and-drop block editor
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Seamless diagram and screenshot picture uploads
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  Live reader preview before publishing
                </li>
              </ul>
            </div>
            <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-11">
              <Link href="/dashboard/create-blog" className="flex items-center justify-center gap-2">
                Write a New Post <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP WRITER WORKFLOW */}
      <section className="container-box py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-foreground/[0.02] border border-foreground/10 p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Writing an article in 4 simple steps
            </h2>
            <p className="text-xs sm:text-sm text-foreground/50 mt-1">
              Here is how the DevShare publishing experience works from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
                1
              </div>
              <h4 className="font-bold text-sm text-foreground">Choose a Topic</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Pick your technology track (Frontend, Backend, DevOps, AI, Security) and set a catchy, clear title.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
                2
              </div>
              <h4 className="font-bold text-sm text-foreground">Assemble Blocks</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Add text paragraphs, format code snippets, and upload architectural diagrams using the toolbar.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
                3
              </div>
              <h4 className="font-bold text-sm text-foreground">Preview Your Post</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Switch to Preview Mode anytime to see exactly how readers will experience your blog post.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
                4
              </div>
              <h4 className="font-bold text-sm text-foreground">Publish to Feed</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Hit 'Publish' to make it live for the entire community, or save it as a draft to finish later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="container-box py-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <HelpCircle size={14} />
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-foreground/50 mt-1">
            Find immediate answers for both everyday readers and article authors.
          </p>
        </div>

        <div className="space-y-10">
          {/* Reader Track FAQs */}
          {(activePersona === "all" || activePersona === "readers") && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    Reader Questions
                  </h3>
                </div>
                <span className="text-xs text-foreground/40">
                  {filteredReaderFaqs.length} answers
                </span>
              </div>

              {filteredReaderFaqs.length === 0 ? (
                <p className="text-xs text-foreground/40 py-6 text-center">
                  No matching reader questions found for "{searchQuery}".
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {filteredReaderFaqs.map((faq) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="border border-foreground/10 rounded-2xl px-5 bg-foreground/[0.015] hover:border-foreground/20 transition-all"
                    >
                      <AccordionTrigger className="text-left font-semibold text-sm py-4 hover:no-underline text-foreground hover:text-primary transition-colors">
                        <span className="flex items-center gap-2.5">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {faq.tag}
                          </span>
                          {faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/70 text-sm leading-relaxed pb-4 pt-1 font-sans">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}

          {/* Contributor Track FAQs */}
          {(activePersona === "all" || activePersona === "contributors") && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <PenLine size={18} className="text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    Writer & Publishing Questions
                  </h3>
                </div>
                <span className="text-xs text-foreground/40">
                  {filteredContributorFaqs.length} answers
                </span>
              </div>

              {filteredContributorFaqs.length === 0 ? (
                <p className="text-xs text-foreground/40 py-6 text-center">
                  No matching writer questions found for "{searchQuery}".
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {filteredContributorFaqs.map((faq) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="border border-foreground/10 rounded-2xl px-5 bg-foreground/[0.015] hover:border-foreground/20 transition-all"
                    >
                      <AccordionTrigger className="text-left font-semibold text-sm py-4 hover:no-underline text-foreground hover:text-primary transition-colors">
                        <span className="flex items-center gap-2.5">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {faq.tag}
                          </span>
                          {faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/70 text-sm leading-relaxed pb-4 pt-1 font-sans">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. COMMUNITY SUPPORT & CONTACT CARD */}
      <section className="container-box px-4 pt-12">
        <div className="rounded-3xl bg-foreground text-background p-8 sm:p-14 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-5">
            <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-background/10 text-primary font-bold">
              Community Support
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Have a question that isn't answered here?
            </h3>

            <p className="text-sm sm:text-base text-background/70 leading-relaxed max-w-lg mx-auto">
              Whether you need help formatting your post, managing your account, or reporting an issue, our community moderators are here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button 
                onClick={() => window.location.href = "mailto:support@devshare.io"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-8 font-semibold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Contact Support
              </Button>

              <Button 
                asChild
                variant="outline" 
                className="rounded-xl h-12 px-8 font-semibold text-xs uppercase tracking-wider border-background/20 text-background hover:bg-background/10 cursor-pointer"
              >
                <Link href="/blogs">
                  Explore DevShare
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}