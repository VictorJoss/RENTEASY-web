import React from "react";
import Link from "next/link";

const navItems = [
  { href: "/panel-inquilino", label: "Buscar propiedades" },
  { href: "/panel-inquilino/contratos", label: "Contratos" },
  { href: "/panel-inquilino/pagos", label: "Pagos" },
  { href: "/panel-inquilino/incidencias", label: "Mis incidencias" },
];

export default function InquilinoDashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4">
        <div className="mb-8">
          <span className="font-bold text-lg text-neutral-800">Panel Inquilino</span>
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
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
