"use client";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Loader2, X, Plus } from "lucide-react";
import { createProperty } from "@/lib/api-client";
import { Card } from "@/components/ui/card";

interface FormState {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number | string;
  images: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function NuevaPropiedadForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    address: "",
    city: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!form.title) newErrors.title = "El título es obligatorio.";
    if (!form.description) newErrors.description = "La descripción es obligatoria.";
    if (!form.address) newErrors.address = "La dirección es obligatoria.";
    if (!form.city) newErrors.city = "La ciudad es obligatoria.";
    if (!form.price || +form.price <= 0) newErrors.price = "El precio debe ser mayor a cero.";
    if (!form.bedrooms) newErrors.bedrooms = "El número de habitaciones es obligatorio.";
    if (!form.bathrooms) newErrors.bathrooms = "El número de baños es obligatorio.";
    if (!form.area) newErrors.area = "El área es obligatoria.";
    if (form.images.length === 0) newErrors.images = "Debe subir al menos una imagen.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setForm({ ...form, price: value ? parseInt(value, 10) : '' });
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...form.images, ...files];
      setForm({ ...form, images: newImages });
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: newImages });

    const newPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await createProperty(form);
      router.push("/panel-propietario?created=true");
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        setErrors(err.response.data);
      } else {
        setErrors({ form: err.message || "Ocurrió un error al crear la propiedad." });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Plus className="w-6 h-6" /> Nueva Propiedad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input name="title" placeholder="Ej: Apartamento moderno en Chapinero" value={form.title} onChange={handleChange} required />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" placeholder="Describe las características principales de tu propiedad" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white" rows={4} required maxLength={1000} />
          <div className="text-right text-xs text-gray-500">{form.description.length}/1000</div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <Input name="address" placeholder="Ej: Cra 7 # 63-10" value={form.address} onChange={handleChange} required />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <Input name="city" placeholder="Ej: Bogotá" value={form.city} onChange={handleChange} required />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio (COP)</label>
          <Input name="price" type="text" placeholder="Ej: 1500000" value={form.price ? Number(form.price).toLocaleString('es-CO') : ''} onChange={handlePriceChange} required />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Habitaciones</label>
            <Input name="bedrooms" type="number" placeholder="Ej: 3" value={form.bedrooms} onChange={handleChange} required />
            {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baños</label>
            <Input name="bathrooms" type="number" placeholder="Ej: 2" value={form.bathrooms} onChange={handleChange} required />
            {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Área (m²)</label>
            <Input name="area" type="number" placeholder="Ej: 80" value={form.area} onChange={handleChange} required />
            {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
          </div>
        </div>
        
        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium mb-2">Imágenes</label>
          <div className="flex flex-wrap gap-4">
            {previews.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border shadow-sm" />
                <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600" onClick={() => handleRemoveImage(idx)}><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-gray-400 hover:bg-gray-50 hover:border-blue-500" onClick={() => fileInput.current?.click()}>
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-xs">Agregar</span>
            </button>
            <input type="file" accept="image/*" multiple ref={fileInput} className="hidden" onChange={handleImageChange} />
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
        </div>

        {errors.form && <div className="text-red-500 text-sm mt-2">{errors.form}</div>}
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Publicando...</> : "Publicar Propiedad"}
            </Button>
        </div>
      </form>
    </Card>
  );
}
