import Image from "next/image";

const TopContributors = () => {
  const authors = [
    { name: "Jessica Lee", role: "UX Architect", posts: 24, img: "https://i.pravatar.cc/150?u=alex" },
    { name: "David Miller", role: "DevOps Engineer", posts: 18, img: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Sophia Wang", role: "AI Researcher", posts: 31, img: "https://i.pravatar.cc/150?u=mike" },
    { name: "Marcus Thorne", role: "Fullstack Dev", posts: 12, img: "https://i.pravatar.cc/150?u=elena" },
  ];


  return (
    <section className="py-20 bg-primary/5">
      <div className="container-box">
        <h2 className="text-center text-3xl font-bold mb-12">Meet Our Top Contributors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {authors.map((author, i) => (
            <div key={i} className="bg-background p-6 rounded-3xl border border-foreground/5 flex flex-col items-center text-center shadow-sm">
              <div  className="w-20 h-20 rounded-full bg-foreground/10 overflow-hidden relative shrink-0">
             <Image
                         src={author.img}
                         alt={author.name}
                         fill
                         className="object-cover"
                       />
              </div>
              <h4 className="font-bold text-lg">{author.name}</h4>
              <p className="text-foreground/50 text-sm mb-4">{author.role}</p>
              <div className="w-full pt-4 border-t border-foreground/5 flex justify-between items-center px-4">
                <span className="text-xs font-bold text-primary">{author.posts} Articles</span>
                <button className="text-xs font-black uppercase text-accent hover:underline">Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default TopContributors

