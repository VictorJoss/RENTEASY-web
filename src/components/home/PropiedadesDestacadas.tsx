"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFeaturedProperties } from "@/lib/api-client";

interface Property {
  id: number;
  title: string;
  city: string;
  price: number;
  images: string[];
}

export default function PropiedadesDestacadas() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedProperties();
        setProperties(response.data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las propiedades destacadas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
          {loading ? (
            <p className="col-span-full text-center">Cargando propiedades...</p>
          ) : error ? (
            <p className="col-span-full text-center text-red-500">{error}</p>
          ) : (
            properties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden shadow-lg bg-white/70 border border-white/20 hover:shadow-xl transition-all"
              >
                <img
                  src={prop.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                  alt={prop.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-neutral-800 mb-1 truncate">{prop.title}</h3>
                  <p className="text-sm text-neutral-500">{prop.city}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${new Intl.NumberFormat('es-CO').format(prop.price)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
