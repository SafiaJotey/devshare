// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { 

//   Mail, 
//   Lock, 
//   ArrowRight, 
//   CheckCircle2, 
//   Chrome, 
//   Linkedin, 
//   Facebook 
// } from "lucide-react";
// import { Logo } from "@/components/shared/Logo";

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      
//       {/* LEFT SIDE: BRAND CONTENT */}
//       <section className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#grid)" />
//           </svg>
//         </div>

//         <div className="relative z-10">
//           <Link href="/" className="flex items-center gap-3">
//              {/* Integrated your Logo here */}
//             <Logo className="text-accent w-10 h-10" />
//             <span className="text-2xl font-black tracking-tighter uppercase">Dev Share</span>
//           </Link>
//         </div>

//         <div className="relative z-10 max-w-md">
//           <h2 className="text-5xl font-bold leading-tight mb-6">
//             Join the collective <span className="text-accent italic text-6xl">wisdom.</span>
//           </h2>
//           <ul className="space-y-4">
//             {[
//               "Share your architectural insights",
//               "Connect with senior engineers",
//               "Personalized technical feed",
//               "Ad-free reading experience"
//             ].map((text, i) => (
//               <li key={i} className="flex items-center gap-3 text-background/70">
//                 <CheckCircle2 size={18} className="text-accent" />
//                 {text}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="relative z-10 text-sm text-background/40">
//           © {new Date().getFullYear()} Dev Share. Built for the curious.
//         </div>
//       </section>

//       {/* RIGHT SIDE: AUTH FORM */}
//       <section className="flex flex-col items-center justify-center p-8 md:p-16">
        
//         {/* Mobile-only Logo */}
//         <div className="lg:hidden mb-8">
//             <Logo className="text-primary w-16 h-16" />
//         </div>

//         <div className="w-full max-w-md">
//           <div className="mb-10 text-center lg:text-left">
//             <h1 className="text-4xl font-bold text-foreground">
//               {isLogin ? "Welcome back" : "Create account"}
//             </h1>
//             <p className="text-foreground/50 mt-2">
//               {isLogin 
//                 ? "Enter your credentials to access your dashboard." 
//                 : "Join the most curious community of developers."}
//             </p>
//           </div>

//           {/* SOCIAL LOGINS */}
//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
//               <Chrome size={20} className="group-hover:text-primary" />
//             </button>
//             <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
//               <Linkedin size={20} className="group-hover:text-primary" />
//             </button>
//             <button className="flex items-center justify-center py-3 border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-all group">
//               <Facebook size={20} className="group-hover:text-primary" />
//             </button>
//           </div>

//           <div className="relative mb-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-foreground/10"></div>
//             </div>
//             <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
//               <span className="bg-background px-4 text-foreground/40 font-bold">Or use email</span>
//             </div>
//           </div>

//           {/* EMAIL FORM */}
//           <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//             {!isLogin && (
//               <div>
//                 <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 block mb-2">Full Name</label>
//                 <input 
//                     type="text" 
//                     placeholder="Enter your name" 
//                     className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
//                 />
//               </div>
//             )}

//             <div>
//               <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 block mb-2">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
//                 <input 
//                   type="email" 
//                   placeholder="name@company.com" 
//                   className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between mb-2">
//                 <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Password</label>
//                 {isLogin && <button className="text-[10px] text-primary font-bold hover:underline">Forgot Password?</button>}
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
//                 <input 
//                   type="password" 
//                   placeholder="••••••••" 
//                   className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary transition-colors"
//                 />
//               </div>
//             </div>

//             <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20">
//               {isLogin ? "Sign In" : "Get Started"}
//               <ArrowRight size={18} />
//             </button>
//           </form>

//           <p className="mt-8 text-center text-sm text-foreground/60">
//             {isLogin ? "New to the collective?" : "Already a member?"}{" "}
//             <button 
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-primary font-bold hover:underline ml-1"
//             >
//               {isLogin ? "Create an account" : "Log in here"}
//             </button>
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }




"use client";

import Link from "next/link";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Chrome, 
  Linkedin, 
  Facebook,
  User
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/Logo";
import { useState } from "react";

// YOUR LOGO COMPONENT

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      
      {/* LEFT SIDE: BRAND CONTENT */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="text-accent w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter uppercase">Dev Share</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Join the collective <span className="text-accent italic text-6xl">wisdom.</span>
          </h2>
          <ul className="space-y-4">
            {[
              "Share your architectural insights",
              "Connect with senior engineers",
              "Personalized technical feed",
              "Ad-free reading experience"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-background/70">
                <CheckCircle2 size={18} className="text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-background/40 font-mono">
          {/* [v1.0.4]  */}...
        </div>
      </section>

      {/* RIGHT SIDE: AUTH FORM */}
      <section className="flex flex-col items-center justify-center p-8 md:p-16">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
            <Logo className="text-primary w-16 h-16" />
        </div>

        <div className="w-full max-w-md">
          {/* FORM HEADER */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-foreground/50 mt-2 text-sm">
              {isLogin 
                ? "Enter your technical credentials to continue." 
                : "Start your journey in our engineering community."}
            </p>
          </div>

          {/* SOCIAL LOGINS */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <Button variant="outline" className="h-12 border-foreground/10 hover:bg-foreground/5 group">
              <Chrome className="w-5 h-5 group-hover:text-primary transition-colors" />
            </Button>
            <Button variant="outline" className="h-12 border-foreground/10 hover:bg-foreground/5 group">
              <Linkedin className="w-5 h-5 group-hover:text-primary transition-colors" />
            </Button>
            <Button variant="outline" className="h-12 border-foreground/10 hover:bg-foreground/5 group">
              <Facebook className="w-5 h-5 group-hover:text-primary transition-colors" />
            </Button>
          </div>

          {/* SEPARATOR */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><Separator /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
              <span className="bg-background px-4 text-foreground/40 font-bold">Or continue with email</span>
            </div>
          </div>

          {/* EMAIL FORM */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-foreground/60">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 w-4 h-4" />
                  <Input id="name" placeholder="Linus Torvalds" className="pl-10 h-12 bg-foreground/5 border-foreground/10 focus-visible:ring-primary" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-foreground/60">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 w-4 h-4" />
                <Input id="email" type="email" placeholder="dev@share.com" className="pl-10 h-12 bg-foreground/5 border-foreground/10 focus-visible:ring-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-foreground/60">Password</Label>
                {isLogin && (
                  <Button variant="link" className="px-0 h-auto text-[10px] font-bold text-primary">Forgot Password?</Button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 w-4 h-4" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-foreground/5 border-foreground/10 focus-visible:ring-primary" />
              </div>
            </div>

            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          {/* TOGGLE LINK */}
          <p className="mt-8 text-center text-sm text-foreground/60">
            {isLogin ? "New to the collective?" : "Already a member?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline ml-1"
            >
              {isLogin ? "Create an account" : "Log in here"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}