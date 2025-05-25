"use client";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";

export default function PublicSearchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header fixed={false} />
      <main className="flex-1 pt-20 pb-8 px-2 md:px-0 mt-40">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 