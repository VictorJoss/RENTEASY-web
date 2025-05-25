"use client";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { icon: <Facebook className="h-5 w-5" />, href: "#" },
  { icon: <Twitter className="h-5 w-5" />, href: "#" },
  { icon: <Instagram className="h-5 w-5" />, href: "#" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#" },
];

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
            <div className="flex items-center gap-4 mt-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#caracteristicas" className="hover:text-white">Características</Link></li>
              <li><Link href="#" className="hover:text-white">Precios</Link></li>
              <li><Link href="#" className="hover:text-white">Seguridad</Link></li>
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Sobre nosotros</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Carreras</Link></li>
              <li><Link href="#" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Términos y condiciones</Link></li>
              <li><Link href="#" className="hover:text-white">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-white">Cookies</Link></li>
              <li><Link href="#" className="hover:text-white">Licencias</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
          <p>© 2024 RentEasy. Todos los derechos reservados.</p>
          <p className="mt-2">
            <Link href="mailto:soporte@renteasy.com" className="hover:text-white">
              soporte@renteasy.com
            </Link>
            {" • "}
            <Link href="tel:+573001234567" className="hover:text-white">
              +57 300 123 4567
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
} 