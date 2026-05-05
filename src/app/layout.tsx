import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

// import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Share ",
  description: "A professional blog website about technology, design, and development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
        <ThemeProvider>
   
          <main className="">
            {children}
          </main>
        
        </ThemeProvider>
      </body>
    </html>
  );
}