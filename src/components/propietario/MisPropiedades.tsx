"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const mockProperties = [
  { id: 1, title: "Apartamento en Bogotá", location: "Chapinero", price: 1200000 },
  { id: 2, title: "Casa en Medellín", location: "El Poblado", price: 2500000 },
];

export default function MisPropiedades() {
  const [properties, setProperties] = useState(mockProperties);
  const router = useRouter();

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      setProperties((props) => props.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Mis propiedades</h2>
<Button onClick={() => router.push("/panel-propietario/nueva")}>
  Nueva Propiedad
</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Título</th>
              <th className="px-4 py-2 border-b">Ubicación</th>
              <th className="px-4 py-2 border-b">Precio</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.id}>
                <td className="px-4 py-2 border-b">{prop.title}</td>
                <td className="px-4 py-2 border-b">{prop.location}</td>
                <td className="px-4 py-2 border-b">${prop.price.toLocaleString("es-CO")}</td>
                <td className="px-4 py-2 border-b">
                  <Button size="sm" variant="outline" className="mr-2" onClick={() => router.push(`/panel-propietario/editar/${prop.id}`)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(prop.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
