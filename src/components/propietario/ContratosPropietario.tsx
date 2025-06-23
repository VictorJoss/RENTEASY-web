"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getOwnerContracts } from "@/lib/api-client";
import { FileText, User, Home, CheckCircle, AlertTriangle, Calendar, X, PenLine, Eye, ChevronLeft, ChevronRight, FileSignature, Search } from "lucide-react";
import { format } from 'date-fns';

interface Contract {
  id: number;
  tenantName: string;
  propertyName: string;
  status: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
}

export default function ContratosPropietario() {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalContrato, setModalContrato] = useState<Contract | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getOwnerContracts();
        setContratos(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los contratos. Por favor, inténtelo de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const handleFirmar = (id: number) => {
    // Lógica para firmar contrato (a implementar)
    alert("Funcionalidad de firma pendiente de implementación.");
  };

  const estados = Array.from(new Set(contratos.map(c => c.status)));
  const propiedades = Array.from(new Set(contratos.map(c => c.propertyName)));
  const PAGE_SIZE = 4;
  const [pagina, setPagina] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const contratosFiltrados = contratos.filter(c =>
    (filtroEstado ? c.status === filtroEstado : true) &&
    (filtroPropiedad ? c.propertyName === filtroPropiedad : true) &&
    (busqueda ? (
      c.propertyName.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );
  const totalPaginas = Math.ceil(contratosFiltrados.length / PAGE_SIZE) || 1;
  const contratosPagina = contratosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const resumen = estados.map(e => ({
    estado: e,
    cantidad: contratos.filter(c => c.status === e).length
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold">Cargando Contratos...</h2>
          <p className="text-gray-500">Estamos preparando todo para usted.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-blue-600" /> Contratos</h2>
        <Button onClick={() => router.push("/panel-propietario/contratos/nuevo")} className="flex items-center gap-2"><PenLine className="w-4 h-4" />Crear contrato</Button>
      </div>
      {/* Filtros y resumen */}
      <div className="mb-4 w-full overflow-x-auto">
        <div className="flex gap-4 flex-nowrap bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm items-end min-w-[600px]">
          <div className="flex flex-col min-w-[140px]">
            <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><User className="w-4 h-4 text-blue-400" /> Inquilino</label>
            <div className="relative">
              <input 
                type="text" 
                value={busqueda} 
                onChange={e => { setBusqueda(e.target.value); setPagina(1); }} 
                className="w-full border border-blue-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-sm shadow-sm" 
                placeholder="Buscar por inquilino..." 
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-blue-300"><Search className="w-4 h-4" /></span>
            </div>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Home className="w-4 h-4 text-green-400" /> Propiedad</label>
            <div className="relative">
              <select value={filtroPropiedad} onChange={e => { setFiltroPropiedad(e.target.value); setPagina(1); }} className="appearance-none w-full border border-green-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 transition text-sm shadow-sm">
                <option value="">Todas</option>
                {propiedades.map(p => <option key={p}>{p}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
          <div className="flex flex-col min-w-[180px]">
             <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><CheckCircle className="w-4 h-4 text-purple-400" /> Estado</label>
            <div className="relative">
              <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="appearance-none w-full border border-purple-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition text-sm shadow-sm">
                <option value="">Todos</option>
                {estados.map(e => <option key={e}>{e}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-purple-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
        </div>
      </div>
      {/* Resumen visual */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Resumen de contratos</h3>
        <div className="flex gap-6">
          {resumen.map(r => (
            <div key={r.estado} className={`rounded-xl p-4 text-center min-w-[120px] shadow border ${r.estado === "PENDIENTE" ? "bg-yellow-50 border-yellow-200" : r.estado === "ACTIVO" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200" }`}>
              <div className={`text-lg font-bold flex items-center justify-center gap-1 ${r.estado === "PENDIENTE" ? "text-yellow-600" : r.estado === "ACTIVO" ? "text-green-700" : "text-red-700"}`}>
                {r.estado === "PENDIENTE" ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />} {r.cantidad}
              </div>
              <div className="text-xs text-neutral-600 mt-1">
                <span className={`inline-block px-2 py-1 rounded font-semibold ${r.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" : r.estado === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`}>{r.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tabla moderna */}
      <div className="overflow-x-auto rounded-xl shadow border border-neutral-100 bg-white">
        <table className="min-w-full text-sm align-middle">
          <thead className="bg-gradient-to-r from-blue-50 to-white">
            <tr>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Inquilino</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Propiedad</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Estado</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Fecha Inicio</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contratosPagina.map((contrato) => (
              <tr key={contrato.id} className="even:bg-blue-50/40">
                <td className="px-4 py-3 border-b align-middle"><span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400 shrink-0" /> {contrato.tenantName}</span></td>
                <td className="px-4 py-3 border-b align-middle"><span className="flex items-center gap-2"><Home className="w-4 h-4 text-green-400 shrink-0" /> {contrato.propertyName}</span></td>
                <td className="px-4 py-3 border-b align-middle">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${contrato.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" : contrato.status === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {contrato.status === "PENDIENTE" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />} {contrato.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b align-middle"><span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400 shrink-0" /> {format(new Date(contrato.startDate), 'dd/MM/yyyy')}</span></td>
                <td className="px-4 py-3 border-b align-middle flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalContrato(contrato)}><Eye className="w-4 h-4 mr-1" />Ver</Button>
                  {contrato.status === "PENDIENTE_FIRMA_PROPIETARIO" && (
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow flex items-center gap-1" onClick={() => handleFirmar(contrato.id)}><FileSignature className="w-4 h-4" />Firmar</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-6">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}><ChevronLeft className="w-4 h-4" /> Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente <ChevronRight className="w-4 h-4" /></Button>
      </div>
      {/* Modal de contrato */}
      {modalContrato && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-blue-100 relative animate-in fade-in duration-200">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl" onClick={() => setModalContrato(null)} aria-label="Cerrar"><X /></button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700"><FileText className="w-5 h-5" /> Contrato de {modalContrato.propertyName}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /><b>Inquilino:</b> <span className="text-neutral-700">{modalContrato.tenantName}</span></div>
              <div className="flex items-center gap-2"><Home className="w-4 h-4 text-green-400" /><b>Propiedad:</b> <span className="text-neutral-700">{modalContrato.propertyName}</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><b>Estado:</b> <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${modalContrato.status === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" : modalContrato.status === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{modalContrato.status}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /><b>Fecha Inicio:</b> <span className="text-neutral-700">{format(new Date(modalContrato.startDate), 'dd/MM/yyyy')}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-400" /><b>Fecha Fin:</b> <span className="text-neutral-700">{format(new Date(modalContrato.endDate), 'dd/MM/yyyy')}</span></div>
              <div className="flex items-center gap-2"><span className="font-bold text-lg text-green-600">${new Intl.NumberFormat('es-CO').format(modalContrato.rentAmount)}</span></div>
            </div>
            {/* Visor PDF simulado */}
            <div className="mb-4">
              <div className="rounded border border-blue-100 overflow-hidden shadow-sm bg-blue-50 flex flex-col items-center justify-center">
                <iframe src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" title="Contrato PDF" className="w-full h-72" />
              </div>
            </div>
            {modalContrato.status === "PENDIENTE_FIRMA_PROPIETARIO" && (
              <div className="flex flex-col gap-2 mb-2">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow flex items-center gap-2 self-end"><FileSignature className="w-5 h-5" />Firmar digitalmente</Button>
                <span className="text-xs text-neutral-400">Al firmar digitalmente, el contrato quedará registrado como firmado y se notificará al inquilino.</span>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalContrato(null)}><X className="w-4 h-4 mr-1" />Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
