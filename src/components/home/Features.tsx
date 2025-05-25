"use client";
import { CheckCircle2, Wallet, FileText, MessageSquare, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
    title: "Autenticación Segura",
    description: "Registro y autenticación de usuarios con máxima seguridad.",
  },
  {
    icon: <Wallet className="h-8 w-8 text-blue-600" />,
    title: "Pagos Seguros",
    description: "Integración con Wompi para transacciones seguras.",
  },
  {
    icon: <FileText className="h-8 w-8 text-green-600" />,
    title: "Contratos Digitales",
    description: "Generación y firma digital de contratos.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
    title: "Gestión de Incidencias",
    description: "Reporte y seguimiento de problemas.",
  },
  {
    icon: <Building2 className="h-8 w-8 text-green-600" />,
    title: "Gestión de Propiedades",
    description: "Administra todas tus propiedades en un solo lugar.",
  },
];

export default function Features() {
  return (
    <section id="caracteristicas" className="py-20 bg-gradient-to-br from-blue-50/50 to-green-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
          <p className="text-neutral-600">Todo lo que necesitas para gestionar tus propiedades</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full backdrop-blur-lg bg-white/50 border border-white/20 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 