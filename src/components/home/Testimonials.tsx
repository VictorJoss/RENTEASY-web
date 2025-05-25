"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Desde que uso RentEasy, gestiono mis 5 apartamentos sin salir de casa.",
    author: "Ever Serrato",
    role: "Propietaria",
  },
  {
    quote: "Firmé mi contrato en línea y pagué el arriendo sin complicaciones.",
    author: "Rafael Principe",
    role: "Inquilino",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-blue-50/50 to-green-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-neutral-600">Experiencias reales de propietarios e inquilinos</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="backdrop-blur-lg bg-white/50 border border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <blockquote className="text-lg italic text-neutral-600 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600" />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 