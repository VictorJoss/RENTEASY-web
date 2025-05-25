"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const mockContratos = [
  {
    id: 1,
    propietario: "Carlos López",
    propiedad: "Apartamento en Bogotá",
    estado: "Pendiente de firma",
    fecha: "2024-05-10",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 2,
    propietario: "Ana Torres",
    propiedad: "Casa en Medellín",
    estado: "Firmado",
    fecha: "2024-04-15",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 3,
    propietario: "Carlos López",
    propiedad: "Apartamento en Bogotá",
    estado: "Pendiente de firma",
    fecha: "2024-03-10",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

const PAGE_SIZE = 4;

export default function ContratosInquilino() {
  const [contratos, setContratos] = useState(mockContratos);
  const [pagina, setPagina] = useState(1);
  const [modalContrato, setModalContrato] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [solicitando, setSolicitando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const estados = ["Pendiente de firma", "Firmado"];
  const propiedades = Array.from(new Set(contratos.map(c => c.propiedad)));

  const contratosFiltrados = contratos.filter(c =>
    (filtroEstado ? c.estado === filtroEstado : true) &&
    (filtroPropiedad ? c.propiedad === filtroPropiedad : true) &&
    (busqueda ? (
      c.propiedad.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.propietario.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(contratosFiltrados.length / PAGE_SIZE) || 1;
  const contratosPagina = contratosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const resumen = estados.map(e => ({
    estado: e,
    cantidad: contratos.filter(c => c.estado === e).length
  }));

  const handleSolicitarFirma = async (contrato: any) => {
    setSolicitando(true);
    setMensaje("");
    // Simula POST
    await new Promise(res => setTimeout(res, 1000));
    setSolicitando(false);
    setMensaje(`Solicitud de firma digital enviada para el contrato de "${contrato.propiedad}".`);
  };

  function exportarCSV() {
    const rows = [
      ["Propiedad", "Propietario", "Estado", "Fecha"],
      ...contratosFiltrados.map(c => [c.propiedad, c.propietario, c.estado, c.fecha])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "contratos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Mis contratos</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="border rounded px-2 py-1">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Propiedad</label>
          <select value={filtroPropiedad} onChange={e => { setFiltroPropiedad(e.target.value); setPagina(1); }} className="border rounded px-2 py-1">
            <option value="">Todas</option>
            {propiedades.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="border rounded px-2 py-1"
            placeholder="Buscar por texto..."
          />
        </div>
        <Button onClick={exportarCSV} className="h-9">Exportar a CSV</Button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Resumen de contratos</h3>
        <div className="flex gap-6">
          {resumen.map(r => (
            <div key={r.estado} className="bg-neutral-100 rounded p-4 text-center min-w-[120px]">
              <div className="text-lg font-bold">{r.cantidad}</div>
              <div className="text-xs text-neutral-600">{r.estado}</div>
            </div>
          ))}
        </div>
      </div>
      {mensaje && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{mensaje}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Propiedad</th>
              <th className="px-4 py-2 border-b">Propietario</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contratosPagina.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2 border-b">{c.propiedad}</td>
                <td className="px-4 py-2 border-b">{c.propietario}</td>
                <td className="px-4 py-2 border-b">{c.estado}</td>
                <td className="px-4 py-2 border-b">{c.fecha}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalContrato(c)}>Ver contrato</Button>
                  {c.estado === "Pendiente de firma" && (
                    <Button size="sm" onClick={() => handleSolicitarFirma(c)} disabled={solicitando}>
                      {solicitando ? "Solicitando..." : "Solicitar firma digital"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {contratosPagina.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-neutral-400 py-4">No tienes contratos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-6">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
      </div>
      {/* Modal de contrato */}
      {modalContrato && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h3 className="text-lg font-bold mb-2">Contrato de {modalContrato.propiedad}</h3>
            <p className="mb-2"><b>Propietario:</b> {modalContrato.propietario}</p>
            <p className="mb-2"><b>Estado:</b> {modalContrato.estado}</p>
            <p className="mb-2"><b>Fecha:</b> {modalContrato.fecha}</p>
            <div className="my-4">
              <a
                href={modalContrato.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver contrato en PDF
              </a>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalContrato(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
