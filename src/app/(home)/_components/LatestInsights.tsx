import Card from "@/components/shared/Card";
import Section from "@/components/shared/Section";


const LatestInsights = () => {
  const posts = [
    { 
      id:1,
        title: "Building a Design System with Tailwind CSS", 
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

  return (
    <Section 
      tag="Newly Published"
      title="The Insight Stream"
      subtitle="A continuous flow of refined technical knowledge. Discover our latest thoughts on the ever-evolving landscape of software development."
      linkText="Explore All"
      linkHref="/archive"
      paddingTop
      paddingBottom
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
        {posts.map((post) => (
          <Card key={post?.id} post={post}/>
        ))}
      </div>
    </Section>
  );
};

export default LatestInsights;