"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = {
  propietario: [
    "Regístrate y publica tu inmueble",
    "Genera y firma contratos digitales",
    "Recibe pagos por Wompi y revisa reportes",
  ],
  inquilino: [
    "Crea tu cuenta",
    "Firma tu contrato digital",
    "Realiza pagos y reporta incidencias",
  ],
};

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">¿Cómo funciona RentEasy?</h2>
          <p className="text-neutral-600">Un proceso simple y eficiente para todos</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pasos para Propietarios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="backdrop-blur-lg bg-white/50 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-600">Para Propietarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {steps.propietario.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-neutral-600">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pasos para Inquilinos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="backdrop-blur-lg bg-white/50 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-600">Para Inquilinos</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {steps.inquilino.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-neutral-600">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 