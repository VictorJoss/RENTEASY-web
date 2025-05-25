"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Calendar, User, Home, DollarSign, FileText, CheckCircle } from "lucide-react";

const mockInquilinos = ["Juan Pérez", "Ana Gómez", "Carlos Ruiz"];
const mockPropiedades = ["Apartamento en Bogotá", "Casa en Medellín"];

const clausulasLegales = [
  { id: "no_subarriendo", label: "Prohibido subarrendar la propiedad" },
  { id: "mascotas", label: "No se permiten mascotas sin autorización" },
  { id: "incremento", label: "Incremento anual del canon según IPC" },
  { id: "mantenimiento", label: "El inquilino debe mantener la propiedad en buen estado" },
  { id: "visitas", label: "El propietario puede realizar visitas con previo aviso" },
  { id: "terminacion", label: "Causales de terminación anticipada según ley" },
  { id: "deposito", label: "Depósito de garantía equivalente a un mes de arriendo" },
  { id: "pagos", label: "El pago debe realizarse los primeros 5 días de cada mes" },
  { id: "servicios", label: "El inquilino asume servicios públicos salvo acuerdo distinto" },
  { id: "otros", label: "Otras condiciones específicas (especificar en el contrato)" },
];

export default function CrearContratoForm() {
  const [form, setForm] = useState({
    inquilino: mockInquilinos[0],
    propiedad: mockPropiedades[0],
    fechaInicio: "",
    fechaFin: "",
    monto: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [clausulas, setClausulas] = useState<string[]>([clausulasLegales[0].id, clausulasLegales[2].id, clausulasLegales[3].id]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Simula POST
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    router.push("/panel-propietario/contratos");
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-700"><FileText className="w-8 h-8" /> Crear contrato</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
        {/* Datos principales */}
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Datos del contrato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1 mb-1"><User className="w-4 h-4" /> Inquilino</label>
              <select name="inquilino" value={form.inquilino} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {mockInquilinos.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1 mb-1"><Home className="w-4 h-4" /> Propiedad</label>
              <select name="propiedad" value={form.propiedad} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {mockPropiedades.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1 mb-1"><Calendar className="w-4 h-4" /> Fecha inicio</label>
              <input name="fechaInicio" type="date" placeholder="Fecha inicio" value={form.fechaInicio} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1 mb-1"><Calendar className="w-4 h-4" /> Fecha fin</label>
              <input name="fechaFin" type="date" placeholder="Fecha fin" value={form.fechaFin} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1 mb-1"><DollarSign className="w-4 h-4" /> Monto (COP)</label>
              <input name="monto" type="number" placeholder="Monto (COP)" value={form.monto} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </section>
        <hr className="my-2 border-neutral-200" />
        {/* Cláusulas legales */}
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Términos y condiciones del contrato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clausulasLegales.map(cl => (
              <label key={cl.id} className="flex items-center gap-2 bg-neutral-50 rounded px-3 py-2 border border-neutral-200 cursor-pointer hover:border-blue-300 transition">
                <input
                  type="checkbox"
                  checked={clausulas.includes(cl.id)}
                  onChange={e => setClausulas(
                    e.target.checked
                      ? [...clausulas, cl.id]
                      : clausulas.filter(c => c !== cl.id)
                  )}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-neutral-700">{cl.label}</span>
              </label>
            ))}
          </div>
          <span className="text-xs text-neutral-400 block mt-2">Selecciona las cláusulas que aplican para este contrato. Puedes personalizar o agregar condiciones específicas en el documento final.</span>
        </section>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow flex items-center gap-2 px-8 py-3 text-base">
            {loading ? "Creando..." : "Crear contrato"}
          </Button>
        </div>
      </form>
    </div>
  );
} 