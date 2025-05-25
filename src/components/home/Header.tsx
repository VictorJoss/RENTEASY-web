"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-white/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              RentEasy
            </span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">Inicio</Link>
            <Link href="#como-funciona">¿Cómo funciona?</Link>
            <Link href="#caracteristicas">Beneficios</Link>
            <Link href="#propiedades-destacadas">Propiedades</Link>
            <Link href="#cobertura">Cobertura</Link>
            <Link href="#testimonios">Testimonios</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="/buscar">Buscar propiedades</Link>
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

          {/* Botón menú móvil */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menú">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Menú móvil (Drawer) */}
      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* Fondo oscuro */}
          <div
            className="absolute inset-0 bg-black/70 transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Drawer lateral móvil */}
          <nav
            className="absolute top-0 right-0 h-full w-72 max-w-full bg-white shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-right duration-300 rounded-l-2xl border-l border-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end mb-4 text-neutral-500 hover:text-blue-600 text-3xl focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              ×
            </button>
            <Link href="/" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Inicio</Link>
            <Link href="#como-funciona" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">¿Cómo funciona?</Link>
            <Link href="#caracteristicas" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Beneficios</Link>
            <Link href="#propiedades-destacadas" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Propiedades</Link>
            <Link href="#cobertura" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Cobertura</Link>
            <Link href="#testimonios" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Testimonios</Link>
            <Link href="#faq" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">FAQ</Link>
            <Link href="/buscar" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-800 hover:text-blue-600">Buscar propiedades</Link>

            <div className="flex flex-col gap-3 mt-8 border-t border-blue-100 pt-6">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white w-full" asChild>
                <Link href="/registro" onClick={() => setOpen(false)}>Registrarse</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}