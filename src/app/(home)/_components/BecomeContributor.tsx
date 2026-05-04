"use client";

import React from "react";
import Section from "@/components/shared/Section";
import { PenTool, GitPullRequest, Users, ArrowRight } from "lucide-react";

const BecomeContributor = () => {
  const benefits = [
    {
      icon: <PenTool className="w-5 h-5" />,
      title: "Share Knowledge",
      description: "Write technical articles that help thousands of developers solve real-world problems.",
    },
    {
      icon: <GitPullRequest className="w-5 h-5" />,
      title: "Open Source",
      description: "Contribute to our internal tools and libraries used by our engineering team.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Build Profile",
      description: "Get featured as a guest author and grow your personal brand in the tech community.",
    },
  ];

  return (
    <Section
      tag="Collaboration"
      title="Shape the Future of Code"
      subtitle="We believe the best insights come from the community. Join our network of technical writers and engineers."
    //   paddingTop
      paddingBottom
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Benefits Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((item, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

          {/* Stat/Highlight Card */}
          <div className="p-6 rounded-2xl bg-primary text-primary-foreground flex flex-col justify-center">
             <span className="text-4xl font-black mb-1">50+</span>
             <p className="font-medium opacity-80">Community contributors already onboard.</p>
          </div>
        </div>

        {/* Right Side: Call to Action Card */}
        <div className="lg:col-span-5">
          <div className="relative p-8 md:p-10 rounded-3xl bg-foreground text-background overflow-hidden">
            {/* Background Blob - using your variable for opacity */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to contribute?
              </h3>
              <p className="opacity-70 mb-8 leading-relaxed">
                Whether its a deep dive into Rust or a CSS trick youve mastered, wed love to hear from you. Check our guidelines and start writing.
              </p>
              
              <div className="flex flex-col gap-4">
                <button className="w-full py-4 bg-accent text-foreground dark:text-black! font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group">
                  Submit a Proposal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full py-4 border border-background/20 text-background font-bold rounded-xl hover:bg-background/5 transition-all">
                  Read Guidelines
                </button>
              </div>

              <p className="mt-6 text-[10px] uppercase tracking-widest opacity-40 text-center">
                Responses typically within 48 hours
              </p>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
};

export default BecomeContributor;