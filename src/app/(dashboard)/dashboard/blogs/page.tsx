
"use client";

import React, { useState } from "react";
import { 
  Search, Plus, MoreHorizontal, Eye, Edit3, Trash2, 
  ListFilter, ChevronLeft, ChevronRight, Calendar, 
  Hash, Monitor, Server, Cpu, Shield, Zap, RefreshCw,
  FileText, CheckCircle2, Clock
} from "lucide-react";
import Link from "next/link";

// Shadcn UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// --- Types & Data ---
const CATEGORY_CONFIG: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
  Frontend: { icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
  Backend: { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  DevOps: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  "AI & Data": { icon: Cpu, color: "text-accent", bg: "bg-accent/10" },
  Security: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

const MOCK_BLOGS = [
  { id: "DS-772", title: "Implementing React 19 Server Actions in Production", created: "2024-05-10", updated: "2024-05-12", status: "Published", category: "Frontend" },
  { id: "DS-641", title: "Microservices Orchestration with Kubernetes", created: "2024-04-12", updated: "2024-04-15", status: "Draft", category: "DevOps" },
  { id: "DS-552", title: "Advanced SQL Indexing for PostgreSQL", created: "2024-03-20", updated: "2024-03-20", status: "Published", category: "Backend" },
  { id: "DS-402", title: "Vector Embeddings and the future of LLMs", created: "2024-02-15", updated: "2024-02-18", status: "Archived", category: "AI & Data" },
  { id: "DS-105", title: "Penetration Testing your Next.js API Routes", created: "2024-01-10", updated: "2024-01-12", status: "Published", category: "Security" },
];

export default function MyBlogsDashboard() {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 pb-20">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
            <Hash size={12} /> Workspace / Content_Manager
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
          Publications
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl text-foreground/40 hover:text-primary transition-colors">
            <RefreshCw size={18} />
          </Button>
          <Link href="/dashboard/new">
            <Button className="bg-primary text-white rounded-xl gap-2 h-12 px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              <Plus size={20} /> Write New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. SEARCH & FILTER ACTION BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={18} />
          <Input 
            placeholder="Search records by title or system ID..." 
            className="pl-12 h-14 bg-foreground/[0.02] border-foreground/5 rounded-2xl focus-visible:ring-primary/20 text-md font-medium transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className={`h-14 px-6 rounded-2xl border-foreground/10 font-bold uppercase tracking-widest text-[10px] gap-3 transition-all ${showFilters ? 'bg-foreground text-background border-foreground' : ''}`}
        >
          <ListFilter size={18} />
          {showFilters ? "Close Filters" : "Advanced Filters"}
        </Button>
      </div>

      {/* 3. EXPANDABLE FILTER DRAWER (PURE CSS/REACT LOGIC) */}
      {showFilters && (
        <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in slide-in-from-top-2 duration-300">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
                <CheckCircle2 size={12} /> Lifecycle Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Published", "Draft", "Archived"].map(s => (
                  <button key={s} className="px-4 py-2 rounded-xl bg-background border border-foreground/10 text-[11px] font-bold hover:border-primary transition-colors">{s}</button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
                <Calendar size={12} /> Sort Chronology
              </label>
              <select className="w-full h-10 bg-background border border-foreground/10 rounded-xl px-3 text-xs font-bold outline-none focus:border-primary transition-colors">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Recently Updated</option>
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
                <Clock size={12} /> Records per page
              </label>
              <div className="flex gap-2">
                 {[10, 20, 50].map(v => (
                   <button key={v} className="flex-1 py-2 rounded-xl bg-background border border-foreground/10 text-[11px] font-bold hover:border-primary transition-all">{v}</button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* 4. DATA LEDGER TABLE */}
      <div className="bg-background border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-foreground/[0.02]">
        <Table>
          <TableHeader className="bg-foreground/[0.02] border-b border-foreground/5">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[35%] py-6 pl-10 font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">Resource / Title</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">Category</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">Lifecycle</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-center">Timeline</TableHead>
              <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-[0.2em] text-foreground/40">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_BLOGS.map((blog) => {
              const CategoryIcon = CATEGORY_CONFIG[blog.category].icon;
              return (
                <TableRow key={blog.id} className="group border-foreground/5 transition-all hover:bg-foreground/[0.01]">
                  <TableCell className="py-6 pl-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <FileText size={20} />
                       </div>
                       <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base line-clamp-1">
                          {blog.title}
                        </span>
                        <span className="text-[10px] font-mono text-foreground/20 mt-0.5 uppercase tracking-tighter">
                          UID: {blog.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-foreground/5 ${CATEGORY_CONFIG[blog.category].bg}`}>
                      <CategoryIcon size={14} className={CATEGORY_CONFIG[blog.category].color} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${CATEGORY_CONFIG[blog.category].color}`}>
                        {blog.category}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusIndicator status={blog.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col items-center gap-1 opacity-60">
                      <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Last Updated</span>
                      <span className="text-xs font-mono font-bold tracking-tighter">{blog.updated}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-10">
                    <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Edit3 size={18} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-foreground/5">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl">
                           <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground/30 px-3 py-2">Quick Actions</DropdownMenuLabel>
                           <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                              <Eye size={16} className="text-primary" /> View Production
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-foreground/5" />
                           <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest text-red-500 focus:text-red-500 focus:bg-red-50">
                              <Trash2 size={16} /> Delete Entry
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 5. MODERN PAGINATION */}
      <div className="flex items-center justify-between mt-12 px-6">
         <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Active Index</span>
               <span className="text-xs font-mono font-bold">01 — 12 <span className="opacity-30">of 142 articles</span></span>
            </div>
            <div className="h-8 w-px bg-foreground/10 hidden md:block" />
            <div className="hidden md:flex gap-1">
               {[1, 2, 3].map(n => (
                 <button key={n} className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold transition-all ${n === 1 ? 'bg-primary text-white' : 'hover:bg-foreground/5'}`}>{n}</button>
               ))}
            </div>
         </div>

         <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-foreground/10 h-11 px-5 font-black text-[10px] uppercase tracking-widest disabled:opacity-30">
              <ChevronLeft size={16} className="mr-2" /> Previous
            </Button>
            <Button variant="outline" className="rounded-xl border-foreground/10 h-11 px-5 font-black text-[10px] uppercase tracking-widest hover:border-primary transition-all">
              Next <ChevronRight size={16} className="ml-2" />
            </Button>
         </div>
      </div>
    </div>
  );
}

// --- Status Indicator Component ---
function StatusIndicator({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    Draft: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    Archived: "bg-slate-400 shadow-none",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-2 h-2 rounded-full ${styles[status]} transition-all duration-1000 animate-pulse`} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
        {status}
      </span>
    </div>
  );
}