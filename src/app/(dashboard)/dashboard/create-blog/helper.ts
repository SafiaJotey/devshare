
import React from "react";

export const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const target = e.currentTarget; 
  target.style.height = "auto";
  target.style.height = `${target.scrollHeight}px`;
};