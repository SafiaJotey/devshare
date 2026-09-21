import {PenTool, GitPullRequest, Users, Code2, Cpu, Globe, Layout, Server, Smartphone } from "lucide-react";

 export const mainPost = {
    id: 1,
    category: "Architecture",
    title: "Mastering Micro-frontends: Scaling Large Scale Web Applications in 2024",
    description: "Learn how to break down your monolithic frontend into manageable, independent pieces without sacrificing user experience or performance.",
    author: "Safia Ahmed",
    date: "Oct 12, 2023",
    readTime: "12 min read",
    avatar:"https://i.pravatar.cc/150?u=emma",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  };

 export const sidePosts = [
    {
      id: 2,
      category: "Performance",
      title: "The Critical Path: Optimizing Core Web Vitals for Next.js",
      author: "Alex Rivera", // Added author
      date: "Oct 10, 2023",
      readTime: "8 min read",
        avatar:"https://i.pravatar.cc/150?u=mike",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
    },
    {
      id: 3,
      category: "TypeScript",
      title: "Advanced Type Safety: Beyond the Basics of Interfaces",
      author: "Jordan Smith", // Added author
      date: "Oct 08, 2023",
      readTime: "6 min read",
        avatar:"https://i.pravatar.cc/150?u=john",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=500",
    }
  ];
export const categories = [
    { name: 'Frontend', icon: <Layout />, count: 42, color: 'bg-primary/20 text-primary ' },
    { name: 'Backend', icon: <Server />, count: 28,  color: 'bg-primary/20 text-primary ' },
    { name: 'DevOps', icon: <Cpu />, count: 15,color: 'bg-primary/20 text-primary '  },
    { name: 'Mobile', icon: <Smartphone />, count: 12, color: 'bg-primary/20 text-primary ' },
    { name: 'Web3', icon: <Globe />, count: 9, color: 'bg-primary/20 text-primary ' },
    { name: 'AI & ML', icon: <Code2 />, count: 21, color: 'bg-primary/20 text-primary '  },
  ];


  export  const posts = [
    { 
      id:1,
        title: "Building a Design System with Tailwind CSS ", 
        author: "Alex Rivera", 
        tag: "Design", 
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=alex"
    },
    { 
      id:2,
        title: "Node.js Performance Tuning: 10 Best Practices", 
        author: "Sarah Chen", 
        tag: "Backend", 
        readTime: "12 min",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    { 
      id:3,
        title: "React Server Components: The Future of Web", 
        author: "Mike Ross", 
        tag: "React", 
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=mike"
    },
    { 
      id:4,
        title: "Understanding Rust Ownership Model", 
        author: "Elena Gil", 
        tag: "Rust", 
        readTime: "15 min",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=elena"
    },
    { 
      id:5,
        title: "Cybersecurity Basics for Web Developers", 
        author: "John Doe", 
        tag: "Security", 
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=john"
    },
    { 
      id:6,
        title: "Mastering CSS Grid in 2024", 
        author: "Emma Watson", 
        tag: "CSS", 
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=emma"
    },
     { 
      id:7,
        title: "Building a Design System with Tailwind CSS", 
        author: "Alex Rivera", 
        tag: "Design", 
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=alex"
    },
    { 
      id:8,
        title: "Node.js Performance Tuning: 10 Best Practices", 
        author: "Sarah Chen", 
        tag: "Backend", 
        readTime: "12 min",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
  ];


  export const authors = [
    { name: "Jessica Lee", role: "UX Architect", posts: 24, img: "https://i.pravatar.cc/150?u=alex" },
    { name: "David Miller", role: "DevOps Engineer", posts: 18,img: "https://i.pravatar.cc/150?u=mike"   },
    { name: "Sophia Wang", role: "AI Researcher", posts: 31, img: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Marcus Thorne", role: "Fullstack Dev", posts: 12, img: "https://i.pravatar.cc/150?u=elena" },
  ];


   export const benefits = [
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