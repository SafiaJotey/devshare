"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Safia Ahmed 
            </h3>
            <p className="text-sm text-muted-foreground">
              Sharing knowledge about technology, design, and development through articles, courses, and tutorials.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="text-muted-foreground hover:text-accent"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {['About', 'Blogs', 'Courses', 'Tutorials'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'Guides', 'Examples', 'Community'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
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
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground"
        >
          <p>
            © {new Date().getFullYear()} Safia Ahmed . All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}