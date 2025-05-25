"use client";
import { motion } from "framer-motion";

const propiedades = [
  {
    nombre: "Apartamento moderno en Bogotá",
    ubicacion: "Chapinero, Bogotá",
    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Casa familiar en Medellín",
    ubicacion: "El Poblado, Medellín",
    imagen: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Estudio acogedor en Cali",
    ubicacion: "San Antonio, Cali",
    imagen: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Apartamento con vista en Cartagena",
    ubicacion: "Bocagrande, Cartagena",
    imagen: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Loft minimalista en Barranquilla",
    ubicacion: "Riomar, Barranquilla",
    imagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Casa campestre en Bucaramanga",
    ubicacion: "Floridablanca, Bucaramanga",
    imagen: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
  },
];

export default function PropiedadesDestacadas() {
  return (
    <section id="propiedades-destacadas" className="py-20 bg-gradient-to-br from-green-100/60 via-blue-50/60 to-blue-200/60 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Propiedades Destacadas</h2>
          <p className="text-neutral-600">Explora algunos de los inmuebles disponibles en RentEasy</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {propiedades.map((prop, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg bg-white/70 border border-white/20 hover:shadow-xl transition-all"
            >
              <img
                src={prop.imagen}
                alt={prop.nombre}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-neutral-800 mb-1">{prop.nombre}</h3>
                <p className="text-sm text-neutral-500">{prop.ubicacion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
