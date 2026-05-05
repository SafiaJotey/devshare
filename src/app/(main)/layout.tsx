// app/(main)/layout.tsx
import NavigationBar from "@/components/layouts/NavigationBar";
import Footer from "@/components/layouts/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}