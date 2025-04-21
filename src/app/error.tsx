// app/error.tsx
'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Something went wrong!</h2>
      <Button className="cursor-pointer" onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
