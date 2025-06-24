"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api-client";
import Link from "next/link";

export default function Hero() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      {/* Fondo con blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 backdrop-blur-3xl" />

      {/* Contenedor principal */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Título con espacio extra para que no se corte la 'g' */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 leading-[1.2] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Administra tus propiedades en un solo lugar
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl mb-8 text-neutral-600">
              RentEasy te conecta con tus inquilinos, facilita pagos, contratos y reportes en minutos.
            </p>

            {/* Botones */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
                  asChild
                  >
                  <Link href="/registro">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
