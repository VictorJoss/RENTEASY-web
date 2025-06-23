"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-green-600/10 backdrop-blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Empieza hoy con RentEasy</h2>
          <p className="text-xl mb-8 text-neutral-600">
            Automatiza tus procesos de arriendo en minutos
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
              onClick={() => window.location.href = "/registro"}
            >
              Registrarse como propietario
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-600/20 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = "/registro"}
            >
              Registrarse como inquilino
            </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
} 