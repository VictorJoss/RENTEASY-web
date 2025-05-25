import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

const navItems = [
  { href: "/panel-propietario", label: "Mis propiedades" },
  { href: "/panel-propietario/contratos", label: "Contratos" },
  { href: "/panel-propietario/pagos", label: "Pagos" },
  { href: "/panel-propietario/estadisticas", label: "Estadísticas" },
  { href: "/panel-propietario/incidencias", label: "Incidencias" },
];

export default function PropietarioDashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4">
        <div className="mb-8">
          <span className="font-bold text-lg text-neutral-800">Panel Propietario</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded hover:bg-neutral-100 text-neutral-700 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t">
          <Link
            href="/panel-propietario/editar-perfil"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold transition-colors"
          >
            <User className="w-5 h-5" /> Editar perfil
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
