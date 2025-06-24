"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Banknote, 
  CreditCard, 
  User, 
  Home, 
  Calendar, 
  BadgeCheck, 
  X, 
  Info, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getOwnerPaymentHistory } from "@/lib/api-client";

interface PaymentHistory {
  id: number;
  contractId: number;
  propertyTitle: string;
  propertyAddress: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
  tenantName: string;
}

export default function PagosPropietario() {
  const [pagos, setPagos] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroInquilino, setFiltroInquilino] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalPago, setModalPago] = useState<PaymentHistory | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [pagina, setPagina] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    const loadPaymentHistory = async () => {
      try {
        setLoading(true);
        const data = await getOwnerPaymentHistory();
        setPagos(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el historial de pagos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-neutral-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Cargando historial de pagos...</h2>
        <p className="text-neutral-500">Un momento, por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-red-50 rounded-xl shadow-sm border border-red-200 text-red-700">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-semibold">Error al cargar datos</h2>
        <p>{error}</p>
      </div>
    );
  }

  const inquilinos = Array.from(new Set(pagos.map(p => p.tenantName).filter(Boolean)));
  const propiedades = Array.from(new Set(pagos.map(p => p.propertyTitle)));
  const metodos = Array.from(new Set(pagos.map(p => p.paymentMethod)));

  const pagosFiltrados = pagos.filter(p =>
    (filtroInquilino ? p.tenantName === filtroInquilino : true) &&
    (filtroPropiedad ? p.propertyTitle === filtroPropiedad : true) &&
    (filtroMetodo ? p.paymentMethod === filtroMetodo : true) &&
    (
      !busqueda ||
      p.tenantName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.propertyTitle.toLowerCase().includes(busqueda.toLowerCase())
    ) &&
    (
      (!fechaDesde || new Date(p.paymentDate) >= new Date(fechaDesde)) &&
      (!fechaHasta || new Date(p.paymentDate) <= new Date(fechaHasta))
    )
  );

  const totalPaginas = Math.ceil(pagosFiltrados.length / PAGE_SIZE) || 1;
  const pagosPagina = pagosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Resúmenes
  const totalPagos = pagosFiltrados.reduce((acc, p) => acc + p.amount, 0);
  const totalWompi = pagosFiltrados.filter(p => p.paymentMethod === "Wompi").reduce((acc, p) => acc + p.amount, 0);
  const totalTransfer = pagosFiltrados.filter(p => p.paymentMethod === "Transferencia").reduce((acc, p) => acc + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Título principal */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Banknote className="w-6 h-6" />
          Pagos Recibidos
        </h1>
        <p className="text-green-100 mt-2">Historial de pagos de tus inquilinos</p>
      </div>

      {/* Resumen visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow flex items-center gap-3 p-4 border border-blue-200">
          <Banknote className="w-7 h-7 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(totalPagos)}</div>
            <div className="text-xs text-neutral-500">Total recibido</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow flex items-center gap-3 p-4 border border-green-200">
          <CreditCard className="w-7 h-7 text-green-600" />
          <div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(totalWompi)}</div>
            <div className="text-xs text-neutral-500">Por Wompi</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl shadow flex items-center gap-3 p-4 border border-yellow-200">
          <Banknote className="w-7 h-7 text-yellow-600" />
          <div>
            <div className="text-lg font-bold text-yellow-700">{formatCurrency(totalTransfer)}</div>
            <div className="text-xs text-neutral-500">Por Transferencia</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Búsqueda por texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Inquilino o propiedad..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filtro inquilino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquilino</label>
            <select
              value={filtroInquilino}
              onChange={e => setFiltroInquilino(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              {inquilinos.map(inquilino => (
                <option key={inquilino} value={inquilino}>{inquilino}</option>
              ))}
            </select>
          </div>

          {/* Filtro propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad</label>
            <select
              value={filtroPropiedad}
              onChange={e => setFiltroPropiedad(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todas</option>
              {propiedades.map(propiedad => (
                <option key={propiedad} value={propiedad}>{propiedad}</option>
              ))}
            </select>
          </div>

          {/* Filtro método */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
            <select
              value={filtroMetodo}
              onChange={e => setFiltroMetodo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              {metodos.map(metodo => (
                <option key={metodo} value={metodo}>{metodo}</option>
              ))}
            </select>
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            Pagos recibidos ({pagosFiltrados.length})
          </h3>
        </div>
        
        {pagosFiltrados.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquilino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagosPagina.map((pago, idx) => (
                    <tr key={pago.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{pago.tenantName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-green-400 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pago.propertyTitle}</div>
                            <div className="text-sm text-gray-500">{pago.propertyAddress}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400 shrink-0" />
                          <span className="text-sm text-gray-900">{formatDate(pago.paymentDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-700">{formatCurrency(pago.amount)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                          pago.paymentMethod === "Wompi" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {pago.paymentMethod === "Wompi" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                          {pago.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setModalPago(pago)}
                          className="flex items-center gap-1"
                        >
                          <Info className="w-4 h-4" />
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center gap-2 py-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setPagina(p => Math.max(1, p - 1))} 
                  disabled={pagina === 1}
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </Button>
                <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} 
                  disabled={pagina === totalPaginas}
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
            <p>Aún no tienes pagos en tu historial.</p>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-blue-100 relative">
            <button 
              className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl z-10" 
              onClick={() => setModalPago(null)} 
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700">
                <BadgeCheck className="w-5 h-5" /> 
                Detalle del pago
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">Inquilino:</span> 
                  <span className="text-neutral-700">{modalPago.tenantName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Propiedad:</span> 
                  <span className="text-neutral-700">{modalPago.propertyTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">Fecha:</span> 
                  <span className="text-neutral-700">{formatDate(modalPago.paymentDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-green-700" />
                  <span className="font-medium">Monto:</span> 
                  <span className="text-green-700 font-bold">{formatCurrency(modalPago.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Método:</span> 
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    modalPago.paymentMethod === "Wompi" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {modalPago.paymentMethod === "Wompi" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                    {modalPago.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">ID Transacción:</span> 
                  <span className="text-neutral-700 text-sm">{modalPago.transactionId}</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setModalPago(null)}>
                  <X className="w-4 h-4 mr-1" />
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
