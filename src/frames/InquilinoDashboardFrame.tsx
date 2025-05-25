"use client";
import React from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/home/Footer";

const navItems = [
  { href: "/panel-inquilino", label: "Resumen" },
  { href: "/panel-inquilino/buscar", label: "Buscar propiedades" },
  { href: "/panel-inquilino/contratos", label: "Contratos" },
  { href: "/panel-inquilino/pagos", label: "Pagos" },
  { href: "/panel-inquilino/incidencias", label: "Mis incidencias" },
];

export default function InquilinoDashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header de navegación */}
      <header className="w-full bg-white/90 border-b border-neutral-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          {/* Logo y nombre */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">RentEasy</span>
            <span className="hidden md:inline text-neutral-400 font-semibold text-sm ml-2">Inquilino</span>
          </Link>
          {/* Navegación */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-6 md:gap-10 items-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-700 font-medium hover:text-blue-600 transition-colors px-2 py-1 rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* Acciones usuario */}
          <div className="flex items-center gap-3">
            <Link href="/panel-inquilino/editar-perfil" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold transition-colors">
              <User className="w-5 h-5" /> <span className="hidden md:inline">Editar perfil</span>
            </Link>
            <Button variant="destructive" className="flex items-center gap-2 px-3 py-2" onClick={() => {/* lógica de logout */}}>
              <LogOut className="w-5 h-5" /> <span className="hidden md:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
