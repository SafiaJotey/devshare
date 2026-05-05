import Section from '@/components/shared/Section';
import { Code2, Cpu, Globe, Layout, Server, Smartphone } from 'lucide-react';
import Link from 'next/link';


const Category = () => {
  const categories = [
    { name: 'Frontend', icon: <Layout />, count: 42, color: 'bg-primary/20 text-primary ' },
    { name: 'Backend', icon: <Server />, count: 28,  color: 'bg-primary/20 text-primary ' },
    { name: 'DevOps', icon: <Cpu />, count: 15,color: 'bg-primary/20 text-primary '  },
    { name: 'Mobile', icon: <Smartphone />, count: 12, color: 'bg-primary/20 text-primary ' },
    { name: 'Web3', icon: <Globe />, count: 9, color: 'bg-primary/20 text-primary ' },
    { name: 'AI & ML', icon: <Code2 />, count: 21, color: 'bg-primary/20 text-primary '  },
  ];


  return (
    <Section tag="Ecosystem Navigation"
   
    bgColor='bg-primary/5'
title="Build Your Stack"
subtitle="Whether you're mastering React or scaling with DevOps, explore our technical library categorized by the tools that define your workflow."
centerHeader
//   linkText="View All Insights"
//       linkHref="/blogs"
paddingTop
paddingBottom
>
       
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} href={`/blogs`}> 
            <div key={i} className="group cursor-pointer bg-background border border-foreground/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all  hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10">
              <div className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-sm">{cat.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1 font-bold">{cat.count} Articles</p>
            </div></Link>
          ))}
        </div>
  
    </Section>
  );
};
export default Category;
