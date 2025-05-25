"use client";
import { Home, Users, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const profiles = [
  {
    icon: <Home className="h-12 w-12 text-blue-600" />,
    title: "Propietarios",
    description: "Publica, gestiona y controla tus propiedades desde cualquier lugar.",
  },
  {
    icon: <Users className="h-12 w-12 text-green-600" />,
    title: "Inquilinos",
    description: "Realiza pagos seguros, firma contratos y reporta problemas fácilmente.",
  },
  {
    icon: <Building2 className="h-12 w-12 text-blue-600" />,
    title: "Administradores",
    description: "Gestiona la plataforma para ofrecer una experiencia fluida y segura.",
  },
];

export default function UserProfiles() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">¿Para quién es RentEasy?</h2>
          <p className="text-neutral-600">La plataforma perfecta para cada actor del mercado inmobiliario</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full backdrop-blur-lg bg-white/50 border border-white/20 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="mb-4">{profile.icon}</div>
                  <CardTitle>{profile.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{profile.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 