"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const mockContratos = [
  { id: 1, inquilino: "Juan Pérez", propiedad: "Apartamento en Bogotá", estado: "Pendiente", fecha: "2024-05-01" },
  { id: 2, inquilino: "Ana Gómez", propiedad: "Casa en Medellín", estado: "Firmado", fecha: "2024-04-15" },
];

export default function ContratosPropietario() {
  const [contratos, setContratos] = useState(mockContratos);
  const [modalContrato, setModalContrato] = useState<any>(null);
  const router = useRouter();

  const handleFirmar = (id: number) => {
    setContratos((prev) => prev.map(c => c.id === id ? { ...c, estado: "Firmado" } : c));
    alert("Contrato firmado exitosamente (mock)");
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Contratos</h2>
        <Button onClick={() => router.push("/panel-propietario/contratos/nuevo")}>Crear contrato</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Inquilino</th>
              <th className="px-4 py-2 border-b">Propiedad</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((contrato) => (
              <tr key={contrato.id}>
                <td className="px-4 py-2 border-b">{contrato.inquilino}</td>
                <td className="px-4 py-2 border-b">{contrato.propiedad}</td>
                <td className="px-4 py-2 border-b">{contrato.estado}</td>
                <td className="px-4 py-2 border-b">{contrato.fecha}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalContrato(contrato)}>Ver</Button>
                  {contrato.estado === "Pendiente" && (
                    <Button size="sm" onClick={() => handleFirmar(contrato.id)}>Firmar</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalContrato && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Detalle del contrato</h3>
            <p><b>Inquilino:</b> {modalContrato.inquilino}</p>
            <p><b>Propiedad:</b> {modalContrato.propiedad}</p>
            <p><b>Estado:</b> {modalContrato.estado}</p>
            <p><b>Fecha:</b> {modalContrato.fecha}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalContrato(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
