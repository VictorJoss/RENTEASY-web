"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const mockPagos = [
  { id: 1, inquilino: "Juan Pérez", propiedad: "Apartamento en Bogotá", fecha: "2024-05-10", monto: 1200000, metodo: "Wompi" },
  { id: 2, inquilino: "Ana Gómez", propiedad: "Casa en Medellín", fecha: "2024-05-05", monto: 2500000, metodo: "Transferencia" },
  { id: 3, inquilino: "Juan Pérez", propiedad: "Apartamento en Bogotá", fecha: "2024-04-10", monto: 1200000, metodo: "Wompi" },
];

export default function PagosPropietario() {
  const [pagos] = useState(mockPagos);
  const [filtroInquilino, setFiltroInquilino] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [modalPago, setModalPago] = useState<any>(null);

  const inquilinos = Array.from(new Set(pagos.map(p => p.inquilino)));
  const propiedades = Array.from(new Set(pagos.map(p => p.propiedad)));

  const pagosFiltrados = pagos.filter(p =>
    (filtroInquilino ? p.inquilino === filtroInquilino : true) &&
    (filtroPropiedad ? p.propiedad === filtroPropiedad : true)
  );

  return (
    <div>
      <div className="flex justify-between mb-4 items-end">
        <h2 className="text-xl font-bold">Pagos</h2>
        <div className="flex gap-2">
          <div>
            <label className="block text-xs mb-1">Inquilino</label>
            <select value={filtroInquilino} onChange={e => setFiltroInquilino(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Todos</option>
              {inquilinos.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Propiedad</label>
            <select value={filtroPropiedad} onChange={e => setFiltroPropiedad(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Todas</option>
              {propiedades.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Inquilino</th>
              <th className="px-4 py-2 border-b">Propiedad</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Monto</th>
              <th className="px-4 py-2 border-b">Método</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map((pago) => (
              <tr key={pago.id}>
                <td className="px-4 py-2 border-b">{pago.inquilino}</td>
                <td className="px-4 py-2 border-b">{pago.propiedad}</td>
                <td className="px-4 py-2 border-b">{pago.fecha}</td>
                <td className="px-4 py-2 border-b">${pago.monto.toLocaleString("es-CO")}</td>
                <td className="px-4 py-2 border-b">{pago.metodo}</td>
                <td className="px-4 py-2 border-b">
                  <Button size="sm" variant="outline" onClick={() => setModalPago(pago)}>Ver detalle</Button>
                </td>
              </tr>
            ))}
            {pagosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-400 py-4">No hay pagos para los filtros seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Detalle del pago</h3>
            <p><b>Inquilino:</b> {modalPago.inquilino}</p>
            <p><b>Propiedad:</b> {modalPago.propiedad}</p>
            <p><b>Fecha:</b> {modalPago.fecha}</p>
            <p><b>Monto:</b> ${modalPago.monto.toLocaleString("es-CO")}</p>
            <p><b>Método:</b> {modalPago.metodo}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalPago(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
