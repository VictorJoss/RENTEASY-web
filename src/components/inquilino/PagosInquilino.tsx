"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Calendar, FileDown, Eye, CreditCard, XCircle, CheckCircle, FileText } from "lucide-react";
import jsPDF from "jspdf";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const mockPagos = [
  { id: 1, propiedad: "Apartamento en Bogotá", estado: "Pendiente", fecha: "2024-05-10", monto: 1200000, metodo: "Wompi" },
  { id: 2, propiedad: "Casa en Medellín", estado: "Pagado", fecha: "2024-04-05", monto: 2500000, metodo: "Transferencia" },
  { id: 3, propiedad: "Apartamento en Bogotá", estado: "Pagado", fecha: "2024-03-10", monto: 1200000, metodo: "Wompi" },
];

const PAGE_SIZE = 4;

// Badge simple inline
function EstadoBadge({ estado }: { estado: string }) {
  const color = estado === "Pagado" ? "bg-green-100 text-green-700 border-green-300" : estado === "Pendiente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-neutral-100 text-neutral-700 border-neutral-300";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${color}`}>{estado}</span>;
}

export default function PagosInquilino() {
  const [pagos, setPagos] = useState(mockPagos);
  const [pagina, setPagina] = useState(1);
  const [modalPago, setModalPago] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [pagando, setPagando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const estados = ["Pendiente", "Pagado"];
  const propiedades = Array.from(new Set(pagos.map(p => p.propiedad)));

  const pagosFiltrados = pagos.filter(p =>
    (filtroEstado ? p.estado === filtroEstado : true) &&
    (filtroPropiedad ? p.propiedad === filtroPropiedad : true) &&
    (busqueda ? (
      p.propiedad.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(pagosFiltrados.length / PAGE_SIZE) || 1;
  const pagosPagina = pagosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const resumen = estados.map(e => ({
    estado: e,
    cantidad: pagos.filter(p => p.estado === e).length
  }));

  // Cálculo de deuda total y próximo pago
  const pagosPendientes = pagos.filter(p => p.estado === "Pendiente");
  const deudaTotal = pagosPendientes.reduce((acc, p) => acc + p.monto, 0);
  const proximoPago = pagosPendientes.length > 0 ? pagosPendientes.reduce((a, b) => (a.fecha < b.fecha ? a : b)) : null;

  const handlePagar = async (pago: any) => {
    setPagando(true);
    setMensaje("");
    // Simula integración Wompi
    await new Promise(res => setTimeout(res, 1000));
    setPagando(false);
    setPagos(prev => prev.map(p => p.id === pago.id ? { ...p, estado: "Pagado", metodo: "Wompi" } : p));
    setMensaje(`Pago realizado exitosamente para "${pago.propiedad}".`);
    setModalPago(null);
  };

  // Exportar a PDF (mock)
function exportarPDF() {
  const doc = new jsPDF();

  // 🎨 Encabezado visual
  doc.setFillColor(34, 197, 94); // Verde RentEasy
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("RentEasy", 15, 17);
  doc.setFontSize(10);
  doc.text("www.renteasy.com.co", 150, 17);

  // 📝 Título
  doc.setFontSize(16);
  doc.setTextColor(34, 34, 34);
  doc.text("Historial de pagos del inquilino", 15, 40);

  // 🔹 Separador
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 44, 195, 44);

  // 🧾 Tabla de pagos
  let y = 55;
  doc.setFontSize(12);
  pagosFiltrados.forEach((p, i) => {
    doc.setTextColor(34, 34, 34);
    doc.text(`Pago #${i + 1}`, 15, y);
    y += 7;
    doc.text("Propiedad:", 20, y); doc.text(p.propiedad, 60, y);
    y += 6;
    doc.text("Estado:", 20, y); doc.text(p.estado, 60, y);
    y += 6;
    doc.text("Fecha:", 20, y); doc.text(p.fecha, 60, y);
    y += 6;
    doc.text("Monto:", 20, y); doc.text(`$${p.monto.toLocaleString("es-CO")}`, 60, y);
    y += 6;
    doc.text("Método:", 20, y); doc.text(p.metodo, 60, y);
    y += 10;

    // ⚪ Línea separadora entre registros
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y - 3, 195, y - 3);

    // ⚠️ Manejo de salto de página
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // 🧩 Pie de página
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Este documento fue generado automáticamente por RentEasy.", 15, 285);
  doc.text("Soporte: soporte@renteasy.com.co", 15, 290);

  // 💾 Guardar
  doc.save("pagos_inquilino.pdf");
}


  // Exportar CSV mejorado
  function exportarCSV() {
    const rows = [
      ["Propiedad", "Estado", "Fecha", "Monto", "Método"],
      ...pagosFiltrados.map(p => [p.propiedad, p.estado, p.fecha, p.monto, p.metodo])
    ];
    const csvContent = "\uFEFF" + rows.map(e => e.join("; ")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    link.setAttribute("download", "pagos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Descargar recibo PDF de un pago (mock, profesional)
  function descargarReciboPDF(pago: any) {
    const doc = new jsPDF();
    // Encabezado con logo (mock) y nombre
    doc.setFillColor(34, 197, 94); // verde
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("RentEasy", 15, 17);
    doc.setFontSize(10);
    doc.text("www.renteasy.com.co", 150, 17);
    // Título
    doc.setTextColor(34, 34, 34);
    doc.setFontSize(16);
    doc.text("Recibo de pago de arriendo", 15, 40);
    // Separador
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 44, 195, 44);
    // Datos del pago en bloques
    doc.setFontSize(12);
    let y = 55;
    doc.text("Propiedad:", 15, y); doc.text(pago.propiedad, 60, y);
    y += 10;
    doc.text("Estado:", 15, y); doc.text(pago.estado, 60, y);
    y += 10;
    doc.text("Fecha de pago:", 15, y); doc.text(pago.fecha, 60, y);
    y += 10;
    doc.text("Monto:", 15, y); doc.text(`$${pago.monto.toLocaleString("es-CO")}`, 60, y);
    y += 10;
    doc.text("Método:", 15, y); doc.text(pago.metodo, 60, y);
    // Separador
    y += 10;
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, 195, y);
    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Este recibo es generado automáticamente por RentEasy. Para soporte: soporte@renteasy.com.co", 15, 285);
    doc.save(`recibo_pago_${pago.id}.pdf`);
  }

  // Datos para el gráfico de historial de pagos
  const pagosPorMes = pagos.reduce((acc: Record<string, number>, p) => {
    const mes = p.fecha.slice(0, 7); // yyyy-mm
    acc[mes] = (acc[mes] || 0) + p.monto;
    return acc;
  }, {});
  const meses = Object.keys(pagosPorMes).sort();
  const data = {
    labels: meses,
    datasets: [
      {
        label: "Pagos realizados",
        data: meses.map(m => pagosPorMes[m]),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Historial de pagos por mes" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Mis pagos</h2>
      {/* Card de gráfico y resumen visual */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
          <span className="inline-block">Historial de pagos</span>
        </h3>
        <div className="w-full max-w-2xl mx-auto min-h-[300px]">
          <Line data={data} options={options} height={120} redraw style={{ minHeight: 300 }} />
        </div>
        {/* Leyenda de estados */}
        <div className="flex gap-4 text-xs text-neutral-500 items-center mt-6 mb-2">
          <EstadoBadge estado="Pagado" /> Pagado
          <EstadoBadge estado="Pendiente" /> Pendiente
        </div>
        {/* Resumen de pagos */}
        <div className="flex gap-6 mt-2">
          {resumen.map(r => (
            <div key={r.estado} className="bg-neutral-100 rounded p-4 text-center min-w-[120px]">
              <div className="text-lg font-bold">{r.cantidad}</div>
              <EstadoBadge estado={r.estado} />
            </div>
          ))}
        </div>
      </div>
      {/* Resumen de deuda y próximo pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
          <span className="bg-yellow-100 text-yellow-700 rounded-full p-2"><FileDown size={24} /></span>
          <div>
            <div className="text-xs text-neutral-500">Deuda total pendiente</div>
            <div className="text-lg font-bold text-yellow-700">${deudaTotal.toLocaleString("es-CO")}</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
          <span className="bg-blue-100 text-blue-700 rounded-full p-2"><Calendar size={24} /></span>
          <div>
            <div className="text-xs text-neutral-500">Próximo pago</div>
            {proximoPago ? (
              <div className="text-lg font-bold text-blue-700">${proximoPago.monto.toLocaleString("es-CO")} <span className='text-xs ml-2'>{proximoPago.fecha}</span></div>
            ) : (
              <div className="text-neutral-400 text-sm">Sin pagos pendientes</div>
            )}
          </div>
        </div>
      </div>
      {/* Filtros mejorados */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end animate-fade-in">
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Propiedad</label>
          <select value={filtroPropiedad} onChange={e => { setFiltroPropiedad(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
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
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Buscar por propiedad..."
          />
        </div>
        <Button onClick={exportarCSV} className="h-9 flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white"><FileDown size={16} /> Exportar a CSV</Button>
        <Button onClick={exportarPDF} className="h-9 flex gap-2 items-center bg-amber-600 hover:bg-amber-700 text-white"><FileText size={16} /> Exportar a PDF</Button>
      </div>
      {/* Feedback visual de mensajes */}
      {mensaje && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded border border-green-200 animate-fade-in">
          <CheckCircle size={20} className="text-green-500" />
          <span>{mensaje}</span>
        </div>
      )}
      {/* Tabla de pagos mejorada */}
      <div className="overflow-x-auto rounded-xl shadow bg-white animate-fade-in">
        <table className="min-w-full border-separate border-spacing-0 text-sm md:text-base">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b text-left">Propiedad</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Fecha</th>
              <th className="px-4 py-2 border-b text-left">Monto</th>
              <th className="px-4 py-2 border-b text-left">Método</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosPagina.map((p) => (
              <tr key={p.id}
                className={`transition-colors ${p.estado === "Pendiente" ? "bg-yellow-50" : ""} hover:bg-blue-50/40`}
              >
                <td className="px-4 py-2 border-b">{p.propiedad}</td>
                <td className="px-4 py-2 border-b"><EstadoBadge estado={p.estado} /></td>
                <td className="px-4 py-2 border-b">{p.fecha}</td>
                <td className="px-4 py-2 border-b">${p.monto.toLocaleString("es-CO")}</td>
                <td className="px-4 py-2 border-b">{p.metodo}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalPago(p)}><Eye size={16} className="mr-1" />Ver detalle</Button>
                  {p.estado === "Pendiente" && (
                    <Button size="sm" onClick={() => handlePagar(p)} disabled={pagando} className="bg-green-600 hover:bg-green-700 text-white">
                      <CreditCard size={16} className="mr-1" />{pagando ? "Pagando..." : "Pagar ahora"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {pagosPagina.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-400 py-4">No tienes pagos registrados.</td>
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
      {/* Modal de detalle mejorado */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalPago(null)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              {modalPago.estado === "Pagado" ? (
                <CheckCircle size={32} className="text-green-500" />
              ) : (
                <CreditCard size={32} className="text-yellow-500" />
              )}
              <h3 className="text-lg font-bold">Detalle del pago</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div><b>Propiedad:</b><br />{modalPago.propiedad}</div>
              <div><b>Estado:</b><br /><EstadoBadge estado={modalPago.estado} /></div>
              <div><b>Fecha:</b><br />{modalPago.fecha}</div>
              <div><b>Monto:</b><br />${modalPago.monto.toLocaleString("es-CO")}</div>
              <div><b>Método:</b><br />{modalPago.metodo}</div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => descargarReciboPDF(modalPago)} className="flex gap-2 items-center bg-amber-600 hover:bg-amber-700 text-white"><FileText size={16} /> Descargar recibo PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
