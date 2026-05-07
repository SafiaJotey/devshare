// helper.ts
import React from "react";

export const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const target = e.currentTarget; // use currentTarget for event delegation safety
  target.style.height = "auto";
  target.style.height = `${target.scrollHeight}px`;
};