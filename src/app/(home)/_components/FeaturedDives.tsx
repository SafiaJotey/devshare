import React from 'react';
import { Clock } from 'lucide-react';
import Section from '@/components/shared/Section';

const FeaturedDives = () => {
  // 1. Added 'author' to sidePosts data
  const mainPost = {
    id: 1,
    category: "Architecture",
    title: "Mastering Micro-frontends: Scaling Large Scale Web Applications in 2024",
    description: "Learn how to break down your monolithic frontend into manageable, independent pieces without sacrificing user experience or performance.",
    author: "Safia Ahmed",
    date: "Oct 12, 2023",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  };

  const sidePosts = [
    {
      id: 2,
      category: "Performance",
      title: "The Critical Path: Optimizing Core Web Vitals for Next.js",
      author: "Alex Rivera", // Added author
      date: "Oct 10, 2023",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
    },
    {
      id: 3,
      category: "TypeScript",
      title: "Advanced Type Safety: Beyond the Basics of Interfaces",
      author: "Jordan Smith", // Added author
      date: "Oct 08, 2023",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=500",
    }
  ];

  return (
    <Section 
      tag="Editor’s Choice"
      title="Featured Deep Dives"
      subtitle="In-depth technical storytelling and architectural breakdowns. Master the mental models behind high-performance engineering."
      linkText="View All Insights"
      linkHref="/blogs"
      paddingTop
      paddingBottom
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        
        {/* LARGE FEATURE CARD (Left) */}
        <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-bl-3xl bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 flex flex-col">
          <div className="relative aspect-video lg:aspect-auto lg:h-[400px] overflow-hidden">
            <img 
              src={mainPost.image} 
              alt={mainPost.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-accent text-background px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {mainPost.category}
              </span>
            </div>
          </div>
          
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                {mainPost.title}
              </h3>
              <p className="text-foreground/70 mb-6 line-clamp-2 text-lg">
                {mainPost.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/60 flex items-center justify-center text-background font-bold">
                  {mainPost.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold">{mainPost.author}</p>
                  <p className="text-xs text-foreground/50">{mainPost.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-foreground/60 font-medium">
                <span className="flex items-center gap-1"><Clock size={14}/> {mainPost.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SMALL STACKED CARDS (Right) */}
        <div className="flex flex-col gap-2">
          {sidePosts.map((post) => (
            <div key={post.id} className="group cursor-pointer flex flex-col h-full bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-br-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col justify-between flex-grow">
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-snug mb-4 line-clamp-2">
                  {post.title}
                </h4>



  <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/60 flex items-center justify-center text-background font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold">{post.author}</p>
                  <p className="text-xs text-foreground/50">{post.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-foreground/60 font-medium">
                <span className="flex items-center gap-1"><Clock size={14}/> {post.readTime}</span>
              </div>
            </div>
              
              </div>
            </div>
          ))}
        </div>

      </div>
    </Section>
  );
};

export default FeaturedDives;