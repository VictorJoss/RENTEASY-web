"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getPropertyById, updateProperty } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditPropertyFormProps {
  propertyId: string;
}

export default function EditPropertyForm({ propertyId }: EditPropertyFormProps) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getPropertyById(propertyId);
        setProperty(response.data);
      } catch (err) {
        setError("No se pudo cargar la información de la propiedad.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProperty((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setProperty((prev: any) => ({ ...prev, price: value ? parseInt(value, 10) : 0 }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ownerId, ownerName, images, ...updateData } = property;
      await updateProperty(propertyId, updateData);
      router.push("/panel-propietario?updated=true");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar la propiedad.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /> Cargando datos de la propiedad...</div>;
  }

  if (error && !property) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!property) {
    return null; // O un esqueleto de carga más sofisticado
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Editar Propiedad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input name="title" value={property.title ?? ''} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" placeholder="Descripción" value={property.description ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white" rows={4} required maxLength={1000} />
          <div className="text-right text-xs text-gray-500">{(property.description ?? '').length}/1000</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <Input name="address" value={property.address ?? ''} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <Input name="city" value={property.city ?? ''} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio (COP)</label>
          <Input name="price" type="text" value={(property.price ?? 0).toLocaleString('es-CO')} onChange={handlePriceChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Habitaciones</label>
            <Input name="bedrooms" type="number" value={property.bedrooms ?? ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baños</label>
            <Input name="bathrooms" type="number" value={property.bathrooms ?? ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Área (m²)</label>
            <Input name="area" type="number" value={property.area ?? ''} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="status"
            value={property.status ?? 'DISPONIBLE'}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white"
            required
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVADO">Reservado</option>
            <option value="OCUPADO">Ocupado</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
        
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Guardando...</> : "Guardar Cambios"}
            </Button>
        </div>
      </form>
    </Card>
  );
} 