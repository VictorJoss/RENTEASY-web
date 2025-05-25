"use client";
import { motion } from "framer-motion";

const ciudades = [
  { nombre: "Bogotá" },
  { nombre: "Medellín" },
  { nombre: "Cali" },
  { nombre: "Barranquilla" },
  { nombre: "Cartagena" },
  { nombre: "Bucaramanga" },
  { nombre: "Monteria" },
  { nombre: "Santa Marta" },
  { nombre: "Manizales" },
  { nombre: "Cúcuta" },
];

export default function MapaCobertura() {
  return (
    <section id="cobertura" className="py-20 bg-gradient-to-br from-blue-50/50 to-green-50/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(ellipse at 70% 30%, #60a5fa22 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, #34d39922 0%, transparent 70%)'}} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Cobertura Nacional</h2>
          <p className="text-neutral-600">RentEasy está disponible en las principales ciudades de Colombia</p>
        </motion.div>
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-white/60 rounded-xl shadow-lg p-4 backdrop-blur-md border border-white/20 w-full max-w-md">
              <iframe
                title="Mapa de Colombia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6374277.073964282!2d-79.297645!3d4.570868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a6c5b6b6b1%3A0x4018f7b7c6c4d60!2sColombia!5e0!3m2!1ses-419!2sco!4v1716240000000!5m2!1ses-419!2sco"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 16 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-lg mb-4 text-neutral-800">Ciudades cubiertas:</h3>
            <ul className="grid grid-cols-2 gap-2 text-neutral-600">
              {ciudades.map((ciudad, idx) => (
                <li key={idx} className="bg-white/70 rounded px-3 py-2 shadow text-sm border border-white/20">
                  {ciudad.nombre}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 