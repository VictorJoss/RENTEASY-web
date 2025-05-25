"use client";
import Footer from "@/components/home/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicSearchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="w-full bg-white/90 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-16 justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              RentEasy
            </span>
          </Link>
          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">Inicio</Link>
            {/* <Link href="/buscar">Buscar propiedades</Link> */}
            <Link href="/#propiedades-destacadas">Propiedades destacadas</Link>
            <Link href="/#cobertura">Cobertura</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>
          {/* Acciones usuario */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white" asChild>
              <Link href="/registro">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 pt-20 pb-8 px-2 md:px-0 mt-40">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 