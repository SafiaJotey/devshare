"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import { Logo } from "../shared/Logo";

export default function Footer() {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, url: "https://github.com" },
    { icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com" },
    { icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com" },
    { icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com" },
  ];

  return (
    <footer className=" bg-gradient-to-b from-background to-muted/20">
      <div className="container-box px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand info */}
          <div
           
            className="space-y-4"
          >
           <Logo className="text-primary dark:text-accent" />
            <p className="text-sm text-muted-foreground">
              Sharing knowledge about technology, design, and development through articles, courses, and tutorials.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
            
                  className="text-muted-foreground hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
           
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {['About', 'Blogs', 'Courses', 'Tutorials'].map((item, index) => (
                <li
                  key={index}
                
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div
          
           
          
           
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'Guides', 'Examples', 'Community'].map((item, index) => (
                <li
                  key={index}
                
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div
          
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to my newsletter for the latest articles and resources.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-background"
              />
              <Button variant="outline" className="shrink-0">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
         
          className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground"
        >
          <p>
            © {new Date().getFullYear()} Safia Ahmed . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}