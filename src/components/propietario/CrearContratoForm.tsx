"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const mockInquilinos = ["Juan Pérez", "Ana Gómez", "Carlos Ruiz"];
const mockPropiedades = ["Apartamento en Bogotá", "Casa en Medellín"];

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
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear contrato</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Inquilino</label>
          <select name="inquilino" value={form.inquilino} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {mockInquilinos.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Propiedad</label>
          <select name="propiedad" value={form.propiedad} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {mockPropiedades.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <Input name="fechaInicio" type="date" placeholder="Fecha inicio" value={form.fechaInicio} onChange={handleChange} required />
        <Input name="fechaFin" type="date" placeholder="Fecha fin" value={form.fechaFin} onChange={handleChange} required />
        <Input name="monto" type="number" placeholder="Monto (COP)" value={form.monto} onChange={handleChange} required />
        <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear contrato"}</Button>
      </form>
    </div>
  );
} 