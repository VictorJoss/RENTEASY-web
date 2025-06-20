"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { Home, MapPin, Image as ImageIcon, DollarSign, FileText, Loader2, X, Plus } from "lucide-react";
import { uploadFile, createProperty, updateProperty } from "@/lib/api-client";

interface FormState {
  title: string;
  location: string;
  type: string;
  price: string;
  images: string[];
  description: string;
}

interface NuevaPropiedadFormProps {
  modoEdicion?: boolean;
  datosPropiedad?: FormState | null;
}

export default function NuevaPropiedadForm({ modoEdicion = false, datosPropiedad }: NuevaPropiedadFormProps) {
  const [form, setForm] = useState<FormState>({
    title: "",
    location: "",
    type: "Apartamento",
    price: "",
    images: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (modoEdicion && datosPropiedad) {
      setForm(datosPropiedad);
      setPreviews(datosPropiedad.images || []);
    }
  }, [modoEdicion, datosPropiedad]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setLoading(true);
    try {
      const uploadPromises = files.map(uploadFile);
      const urls = await Promise.all(uploadPromises);
      setPreviews((prev) => [...prev, ...urls]);
      setForm((prevForm) => ({ ...prevForm, images: [...prevForm.images, ...urls] }));
    } catch (err) {
      setError("Error al subir las imágenes.");
    } finally {
      setLoading(false);
    }
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
    try {
      if (modoEdicion) {
        await updateProperty(id as string, form);
      } else {
        await createProperty(form);
      }
      router.push("/panel-propietario");
    } catch (err: any) {
        setError(err.message || "Ocurrió un error inesperado.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-700"><Plus className="w-8 h-8" /> {modoEdicion ? "Editar propiedad" : "Nueva propiedad"}</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
        {/* Datos principales */}
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"><Home className="w-5 h-5" /> Datos de la propiedad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-semibold text-neutral-600 flex items-center gap-1 mb-2"><Home className="w-5 h-5" /> Título</label>
              <Input name="title" placeholder="Título" value={form.title} onChange={handleChange} required className="mt-1 text-base py-3" />
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-600 flex items-center gap-1 mb-2"><MapPin className="w-5 h-5" /> Ubicación</label>
              <Input name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} required className="mt-1 text-base py-3" />
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-600 flex items-center gap-1 mb-2"><FileText className="w-5 h-5" /> Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-3 mt-1 text-base">
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Oficina</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-600 flex items-center gap-1 mb-2"><DollarSign className="w-5 h-5" /> Precio (COP)</label>
              <Input name="price" type="number" placeholder="Precio (COP)" value={form.price} onChange={handleChange} required className="mt-1 text-base py-3" />
            </div>
          </div>
        </section>
        <hr className="my-2 border-neutral-200" />
        {/* Imágenes */}
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Imágenes</h3>
          <div className="flex flex-wrap gap-4 mt-2">
            {previews.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt={`Imagen ${idx + 1}`} className="w-28 h-28 object-cover rounded-lg border shadow" />
                <button type="button" className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors" onClick={() => handleRemoveImage(idx)} aria-label="Eliminar imagen"><X className="w-5 h-5" /></button>
              </div>
            ))}
            <button
              type="button"
              className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg text-blue-400 hover:bg-blue-50 transition-colors"
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
          <span className="text-xs text-neutral-400 block mt-1">Puedes subir varias imágenes.</span>
        </section>
        <hr className="my-2 border-neutral-200" />
        {/* Descripción */}
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Descripción</h3>
          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-3 min-h-[100px] mt-1 text-base"
            required
          />
        </section>
        {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded p-2 text-sm"><X className="w-4 h-4" /> {error}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow flex items-center gap-2 px-8 py-3 text-base">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />} {modoEdicion ? (loading ? "Guardando..." : "Guardar cambios") : (loading ? "Publicando..." : "Publicar propiedad")}
          </Button>
        </div>
      </form>
    </div>
  );
}
