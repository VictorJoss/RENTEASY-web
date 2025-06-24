"use client";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">RentEasy</h3>
            <p className="text-sm">
              La plataforma líder en gestión inmobiliaria que conecta propietarios e inquilinos de manera segura y eficiente.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Inicio</Link></li>
              <li><Link href="/#propiedades-destacadas" className="hover:text-white">Propiedades</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white">Cómo funciona</Link></li>
              <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Términos y condiciones</Link></li>
              <li><Link href="#" className="hover:text-white">Política de privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4"/>
                    <a href="mailto:soporte@renteasy.com" className="hover:text-white">
                        soporte@renteasy.com
                    </a>
                </li>
                <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4"/>
                    <span>+57 300 123 4567</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
          <p>© 2024 RentEasy. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 