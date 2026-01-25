// app/not-found.tsx
'use client';

import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1
        className="text-6xl font-bold text-foreground"
      
      >
        404
      </h1>
      <p
        className="mt-4 text-lg text-muted-foreground"
     
      >
        This page does not exist. Maybe go back to safety?
      </p>
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
