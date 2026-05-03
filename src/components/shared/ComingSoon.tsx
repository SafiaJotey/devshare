
"use client";


import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComingSoon() {




  return (
    <div className="min-h-screen  flex flex-col items-center justify-center px-4">
      <div
        
        className="max-w-xl text-center space-y-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">🚧 Coming Soon</h1>
        <p className="text-lg text-foreground">
          We &apos; re working hard to bring you something amazing. Stay tuned — we &apos; re almost there!
        </p>


      

        <p className="text-xs text-foreground mt-4">We &apos; ll notify you when we launch 🚀</p>
      </div>
      <div
        className="mt-6"
       
      >
        <Link href="/">
          <Button variant="default" className="cursor-pointer">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
