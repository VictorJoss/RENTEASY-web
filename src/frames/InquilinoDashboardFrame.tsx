"use client";
import React from "react";
import Link from "next/link";
import { User, LogOut, Home, Search, FileText, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/home/Footer";
import { logout } from "@/lib/api-client";

export default function InquilinoDashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header de navegación */}
      <header className="w-full bg-white/90 border-b border-neutral-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          {/* Logo y nombre */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">RentEasy</span>
            <span className="hidden md:inline text-neutral-400 font-semibold text-sm ml-2">Inquilino</span>
          </Link>
          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/panel-inquilino/resumen"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-neutral-100"
            >
              <Home className="h-4 w-4" />
              Resumen
            </Link>
            <Link
              href="/panel-inquilino/buscar"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary hover:bg-neutral-100"
            >
              <Search className="h-4 w-4" />
              Buscar Propiedades
            </Link>
            <Link
              href="/panel-inquilino/solicitudes"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-neutral-100"
            >
              <FileText className="h-4 w-4" />
              Mis Solicitudes
            </Link>
            <Link
              href="/panel-inquilino/contratos"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-neutral-100"
            >
              <FileText className="h-4 w-4" />
              Mis Contratos
            </Link>
            <Link
              href="/panel-inquilino/pagos"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-neutral-100"
            >
              <CreditCard className="h-4 w-4" />
              Historial de Pagos
            </Link>

          </nav>
          {/* Acciones usuario */}
          <div className="flex items-center gap-3">
            <Button variant="destructive" className="flex items-center gap-2 px-3 py-2" onClick={async () => await logout()}>
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
