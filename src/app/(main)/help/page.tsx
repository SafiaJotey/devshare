"use client";


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
  ShieldAlert
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function HelpCenter() {
 

  const readerFAQs = [
    { q: "Is the content on Dev Share free to read?", a: "Yes. Our core mission is the open exchange of technical wisdom. All deep-dives and architectural breakdowns are accessible to the community without paywalls." },
    { q: "How do I know the code snippets are accurate?", a: "Every contribution undergoes a 'Signal Check.' While we encourage community peer review, we also run basic technical verification on code blocks to ensure they follow standard syntax and logic." },
    { q: "Can I save articles for offline reading?", a: "Registered users can 'Bookmark' any insight to their personal dashboard. We are currently developing a PDF export feature for local archiving." }
  ];

  const contributorFAQs = [
    { q: "What qualifies as 'No Fluff' content?", a: "We prioritize technical intuition over clickbait. A 'No Fluff' article skips basic definitions (like 'What is a variable?') and goes straight into system design, performance trade-offs, and real-world implementation." },
    { q: "Can I cross-post from my personal blog?", a: "Absolutely. We support canonical URLs to ensure your SEO isn't affected. You can import your markdown directly into our block-editor." },
    { q: "How does the verification process work?", a: "Once you hit 'Publish,' your article enters our pipeline. We check for AI-generated spam, plagiarism, and technical clarity. Most articles are live within 24 hours." }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      
    
      <section className="relative pt-32 pb-20 bg-foreground  overflow-hidden">
     
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="help-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#help-grid)" />
          </svg>
        </div>

        <div className="container-box relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-8">
            <Terminal size={14} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent font-mono">Documentation // Help_Center</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-background tracking-tighter mb-8 uppercase leading-[0.9]">
            The <span className="text-primary italic font-serif lowercase">Dev Share</span> <br /> 
            Operation Manual
          </h1>
       
        </div>
      </section>

 
      <section className="container-box -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          

          <div className="bg-background border border-foreground/5 p-10 rounded-[2.5rem] shadow-2xl group hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
              <BookOpen size={30} />
            </div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Gain <span className="text-primary italic">Intuition</span></h2>
            <p className="text-foreground/60 leading-relaxed mb-8">
              Dev Share is built for developers who have outgrown basic tutorials. Here is how to make the most of your reading experience:
            </p>
            <ul className="space-y-4">
              {[
                "Use the 'Ecosystem Navigation' to find specific stacks.",
                "Bookmark deep-dives to your private Dashboard.",
                "Engage in technical debates via comments.",
                "Follow lead architects to get notified of new logic."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-foreground text-background p-10 rounded-[2.5rem] shadow-2xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Code2 size={120} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform">
              <PenTool size={30} />
            </div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Share <span className="text-accent italic">Wisdom</span></h2>
            <p className="text-background/60 leading-relaxed mb-8">
              The best way to master a technology is to explain it. Join our collective of engineering contributors:
            </p>
            <ul className="space-y-4">
              {[
                "Access the 'Block Editor' from your dashboard.",
                "Drag & drop code, terminal, and quote segments.",
                "Submit for technical verification (Signal Check).",
                "Build your reputation as a senior technical voice."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-background/80">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>


      <section className="container-box py-32">
        <div className="text-center mb-20">
          <span className="text-accent font-mono text-[10px] font-bold uppercase tracking-[0.4em]">Query_Repository</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 uppercase tracking-tighter">Frequently Asked <span className="text-primary italic">Logic</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
  
          <div className="space-y-8">
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground/40 pb-4 border-b border-foreground/5">
              <Users size={18} /> For Knowledge Seekers
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {readerFAQs.map((faq, i) => (
                <AccordionItem key={i} value={`reader-${i}`} className="border-foreground/5">
                  <AccordionTrigger className="text-left font-bold py-6 hover:text-primary transition-colors">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/60 leading-relaxed text-base pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

  
          <div className="space-y-8">
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground/40 pb-4 border-b border-foreground/5">
              <Zap size={18} /> For Insight Architects
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {contributorFAQs.map((faq, i) => (
                <AccordionItem key={i} value={`writer-${i}`} className="border-foreground/5">
                  <AccordionTrigger className="text-left font-bold py-6 hover:text-accent transition-colors">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/60 leading-relaxed text-base pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="container-box py-10 px-4">
         <div className="bg-primary/5 dark:bg-slate-900 border border-primary/10 dark:border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5">
               <GitBranch size={200} />
            </div>
            <h3 className="text-2xl font-bold mb-10 dark:text-slate-100 flex items-center gap-2">
               <Rocket className="text-accent" /> Platform Roadmap v3.0
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { q: "Q3 2024", t: "PDF Intelligence", d: "Export articles with system-diagram resolution." },
                 { q: "Q4 2024", t: "Live Pair-Writing", d: "Collaborate in real-time within the block editor." },
                 { q: "Q1 2025", t: "DevShare API", d: "Integrate your insights into your personal portfolio." },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <span className="text-xs font-mono font-bold text-accent">{item.q}</span>
                    <h4 className="font-bold dark:text-slate-200">{item.t}</h4>
                    <p className="text-xs text-foreground/50 dark:text-slate-500">{item.d}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
 
      <section className="container-box py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-accent font-mono text-xs font-bold uppercase tracking-[0.3em]">Quality_Control</span>
            <h2 className="text-4xl font-bold mt-4 mb-6 leading-tight dark:text-slate-100">Our <span className="text-primary italic">Verification</span> Standards.</h2>
            <p className="text-foreground/60 dark:text-slate-400 leading-relaxed mb-8">
              To maintain high signal-to-noise ratio, we enforce strict guidelines for all published documentation.
            </p>
            <div className="space-y-4">
              {[
                { t: "No AI Spam", d: "Content must be human-authored and reviewed." },
                { t: "Tested Code", d: "Snippets must be functional and syntax-valid." },
                { t: "Architecture First", d: "Focus on 'Why' before 'How'." }
              ].map((g, i) => (
                <div key={i} className="flex gap-4">
                  <ShieldAlert className="text-red-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-sm dark:text-slate-200">{g.t}</h4>
                    <p className="text-xs text-foreground/40 dark:text-slate-500">{g.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-foreground dark:bg-slate-900 rounded-[2.5rem] p-8 font-mono text-[12px] text-emerald-500 shadow-2xl relative">
             <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
             </div>
             <p className="opacity-50">{"//"} Initializing verification_protocol.sh</p>
             <p className="mt-2 text-white"> {">"} scanning_content... <span className="text-accent">OK</span></p>
             <p className="mt-1 text-white"> {">"} verifying_code_blocks... <span className="text-accent">OK</span></p>
             <p className="mt-1 text-white"> {">"} checking_for_plagiarism... <span className="text-accent">NONE</span></p>
             <p className="mt-4 text-emerald-400 bg-emerald-500/10 p-2 rounded">STATUS: READY_FOR_DEPLOYMENT</p>
          </div>
        </div>
      </section>

      <section className="container-box">
         <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">
               <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter uppercase">Still encountering <span className="text-primary italic">errors?</span></h3>
               <p className="text-foreground/50 mb-10 text-lg leading-relaxed">
                 Our technical support architects are standing by to help you with account issues, publication errors, or community disputes.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl px-10 h-14 font-bold text-xs uppercase tracking-widest shadow-xl">
                    <MessageSquare className="mr-2" size={18} /> Start Technical Chat
                  </Button>
                  <Button variant="outline" className="border-foreground/10 rounded-xl px-10 h-14 font-bold text-xs uppercase tracking-widest hover:bg-foreground/5">
                    Email Support Node
                  </Button>
               </div>
            </div>
            

            <Cpu className="absolute -bottom-10 -right-10 text-foreground/[0.03]" size={300} />
         </div>
      </section>

    </main>
  );
}