"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Home, MapPin, Image as ImageIcon, DollarSign, FileText, Loader2, X, Plus } from "lucide-react";

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
  const [previews, setPreviews] = useState<string[]>(datosPropiedad?.images || []);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (modoEdicion && datosPropiedad) {
      setForm(datosPropiedad);
      setPreviews(datosPropiedad.images || []);
    }
  }, [modoEdicion, datosPropiedad]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f: any) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
    setForm({ ...form, images: [...form.images, ...urls] });
  };

  const handleRemoveImage = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.location || !form.price || !form.description || form.images.length === 0) {
      setError("Por favor completa todos los campos y sube al menos una imagen.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    router.push("/panel-propietario");
  };

  return (
    <section className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-0 md:p-10 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700"><Plus className="w-7 h-7" /> {modoEdicion ? "Editar propiedad" : "Nueva propiedad"}</h2>
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-6 bg-white/80 rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Home className="w-4 h-4" /> Título</label>
              <Input name="title" placeholder="Título" value={form.title} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> Ubicación</label>
              <Input name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><FileText className="w-4 h-4" /> Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Oficina</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Precio (COP)</label>
              <Input name="price" type="number" placeholder="Precio (COP)" value={form.price} onChange={handleChange} required className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Imágenes</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {previews.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Imagen ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border shadow" />
                  <button type="button" className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors" onClick={() => handleRemoveImage(idx)} aria-label="Eliminar imagen"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button
                type="button"
                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg text-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => fileInput.current?.click()}
                aria-label="Agregar imagen"
              >
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-xs">Agregar</span>
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInput}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <span className="text-xs text-neutral-400 block mt-1">Puedes subir varias imágenes. Arrastra para cambiar el orden (próximamente).</span>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><FileText className="w-4 h-4" /> Descripción</label>
            <textarea
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 min-h-[80px] mt-1"
              required
            />
          </div>
          {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded p-2 text-sm"><X className="w-4 h-4" /> {error}</div>}
          <Button type="submit" disabled={loading} className="mt-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow self-end w-full md:w-auto flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} {modoEdicion ? (loading ? "Guardando..." : "Guardar cambios") : (loading ? "Publicando..." : "Publicar propiedad")}
          </Button>
        </form>
      </div>
    </section>
  );
}
