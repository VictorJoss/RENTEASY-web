"use client";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";

export default function PublicLayoutFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 