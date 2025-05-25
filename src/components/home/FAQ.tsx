"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "¿Es seguro realizar pagos a través de RentEasy?",
    answer: "Sí, los pagos se procesan mediante Wompi, una pasarela de pagos segura y confiable en Colombia.",
  },
  {
    question: "¿Puedo firmar contratos digitalmente?",
    answer: "Sí, RentEasy permite la generación y firma digital de contratos de arrendamiento, válidos legalmente.",
  },
  {
    question: "¿Puedo gestionar varias propiedades desde una sola cuenta?",
    answer: "Sí, los propietarios pueden administrar múltiples propiedades desde un solo panel de control.",
  },
  {
    question: "¿RentEasy está disponible en todo Colombia?",
    answer: "Sí, la plataforma está disponible para usuarios en todo el territorio colombiano.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-blue-50/50 to-green-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-neutral-600">Resuelve tus dudas sobre RentEasy</p>
        </motion.div>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-6 py-4 bg-white/70 border border-white/20 rounded-lg shadow hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 flex justify-between items-center"
                aria-expanded={openIndex === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="font-semibold text-neutral-800">{faq.question}</span>
                <span className={`ml-4 transition-transform ${openIndex === idx ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-40 py-2 px-6" : "max-h-0 py-0 px-6"}`}
                aria-hidden={openIndex !== idx}
              >
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 