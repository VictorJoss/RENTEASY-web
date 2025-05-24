"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface NuevaPropiedadFormProps {
  modoEdicion?: boolean;
  datosPropiedad?: FormState;
}

const mockEditData = {
  title: "Apartamento en Bogotá",
  location: "Chapinero",
  type: "Apartamento",
  price: "1200000",
  images: ["foto1.jpg", "foto2.jpg"],
  description: "Hermoso apartamento en el centro de Bogotá, cerca a todo.",
};

interface FormState {
  title: string;
  location: string;
  type: string;
  price: string;
  images: string[];
  description: string;
}

export default function NuevaPropiedadForm({ modoEdicion = false, datosPropiedad }: NuevaPropiedadFormProps) {
  const [form, setForm] = useState<FormState>(datosPropiedad || {
    title: "",
    location: "",
    type: "Apartamento",
    price: "",
    images: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (modoEdicion && datosPropiedad) {
      setForm(datosPropiedad);
    }
  }, [modoEdicion, datosPropiedad]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e: any) => {
    // Solo mock: guardamos los nombres de los archivos
    setForm({ ...form, images: Array.from(e.target.files).map((f: any) => f.name) });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Simula POST
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    router.push("/panel-propietario");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{modoEdicion ? "Editar propiedad" : "Nueva propiedad"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <Input name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} required />
        <div>
          <label className="block mb-1 text-sm font-medium">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Oficina</option>
            <option>Local</option>
          </select>
        </div>
        <Input name="price" type="number" placeholder="Precio (COP)" value={form.price} onChange={handleChange} required />
        <div>
          <label className="block mb-1 text-sm font-medium">Imágenes</label>
          <Input name="images" type="file" multiple onChange={handleImageChange} />
          {form.images.length > 0 && (
            <ul className="text-xs mt-2 text-neutral-600">
              {form.images.map((img: any, i: number) => <li key={i}>{img}</li>)}
            </ul>
          )}
        </div>
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 min-h-[80px]"
          required
        />
        <Button type="submit" disabled={loading}>{loading ? (modoEdicion ? "Guardando..." : "Publicando...") : modoEdicion ? "Guardar cambios" : "Publicar propiedad"}</Button>
      </form>
    </div>
  );
}
