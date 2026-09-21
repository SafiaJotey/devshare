import React from "react";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  ArrowUpRight,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-accent font-bold tracking-widest text-xs uppercase">Welcome back, Arjun</span>
          <h1 className="text-4xl font-bold mt-2">Workspace Overview</h1>
        </div>
        <Button className="bg-primary text-white rounded-xl px-6 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          Create New Blog
        </Button>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Views", value: "48.2k", icon: Eye, color: "text-blue-500", trend: "+12%" },
          { label: "Avg. Read Time", value: "4:12m", icon: TrendingUp, color: "text-emerald-500", trend: "+5%" },
          { label: "Subscribers", value: "1,204", icon: Users, color: "text-accent", trend: "+18%" },
          { label: "Comments", value: "482", icon: MessageSquare, color: "text-purple-500", trend: "+2%" },
        ].map((stat, i) => (
          <div key={i} className="bg-foreground/[0.02] border border-foreground/5 p-6 rounded-3xl hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-background border border-foreground/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-foreground/50 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
        <div className="lg:col-span-2 bg-background border border-foreground/5 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Your Recent Publications</h3>
            <Button variant="ghost" className="text-primary font-bold text-xs">View All</Button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((_,i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 overflow-hidden">
                    <div className="w-full h-full bg-primary/20 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">Mastering React 19 Actions</h4>
                    <p className="text-xs text-foreground/40 mt-1 italic">Published Oct 24 • 8 min read</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowUpRight size={18} className="text-foreground/20 group-hover:text-primary transition-all" />
                </Button>
              </div>
            ))}
          </div>
        </div>

   
        <div className="bg-foreground text-background rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <Logo className="w-32 h-32" />
          </div>
          
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            System Status
          </h3>
          
          <div className="space-y-4 font-mono text-[10px] opacity-70">
            <p className="text-accent">{">"} AUTH_SESSION_VALIDATED: TRUE</p>
            <p>{">"} DB_LATENCY: 24ms</p>
            <p>{">"} NEW_SUBSCRIBER: user_982</p>
            <p className="text-primary-foreground/40 italic mt-4"> No pending pull requests</p>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-background/5 border border-background/10">
            <p className="text-xs font-bold mb-2">Knowledge Contribution</p>
            <div className="h-2 w-full bg-background/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[75%]" />
            </div>
            <p className="text-[10px] mt-2 opacity-50">You are in the top 5% of contributors this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}