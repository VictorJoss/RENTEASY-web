"use client";
import { FileText, CreditCard, AlertCircle, Smile, CalendarCheck, BadgeCheck } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Badge } from "@/components/ui/badge";

Chart.register(ArcElement, ChartTooltip, Legend);

const resumenMock = {
  nombre: "Juan Pérez",
  contratosActivos: 2,
  pagosPendientes: 1,
  incidenciasAbiertas: 1,
  pagosTotales: 12,
  pagosRealizados: 11,
  proximoPago: {
    fecha: "2024-07-10",
    valor: 1200000,
    estado: "Pendiente",
  },
};

const pieData = {
  labels: ["Pagados", "Pendiente"],
  datasets: [
    {
      data: [resumenMock.pagosRealizados, resumenMock.pagosTotales - resumenMock.pagosRealizados],
      backgroundColor: ["#22c55e", "#fbbf24"],
      borderWidth: 2,
    },
  ],
};

export default function ResumenInquilino() {
  return (
    <section className="mb-8">
      <div className="mb-6 flex items-center gap-3">
        <Smile className="w-7 h-7 text-green-600" />
        <h2 className="text-2xl font-bold text-neutral-800">Hola, {resumenMock.nombre}</h2>
        <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200">Inquilino activo</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 rounded-xl shadow p-5 flex items-center gap-4 border border-white/30">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <div className="text-2xl font-bold text-blue-700">{resumenMock.contratosActivos}</div>
            <div className="text-sm text-neutral-500">Contratos activos</div>
          </div>
        </div>
        <div className="bg-white/80 rounded-xl shadow p-5 flex items-center gap-4 border border-white/30">
          <CreditCard className="w-8 h-8 text-green-600" />
          <div>
            <div className="text-2xl font-bold text-green-700">{resumenMock.pagosPendientes}</div>
            <div className="text-sm text-neutral-500">Pagos pendientes</div>
          </div>
        </div>
        <div className="bg-white/80 rounded-xl shadow p-5 flex items-center gap-4 border border-white/30">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
          <div>
            <div className="text-2xl font-bold text-yellow-600">{resumenMock.incidenciasAbiertas}</div>
            <div className="text-sm text-neutral-500">Incidencias abiertas</div>
          </div>
        </div>
        <div className="bg-white/80 rounded-xl shadow p-5 flex flex-col items-center border border-white/30">
          <div className="w-20 h-20 mb-2">
            <Pie data={pieData} options={{ plugins: { legend: { display: false } }, cutout: "70%" }} />
          </div>
          <div className="text-xs text-neutral-500">Pagos realizados</div>
          <div className="text-lg font-bold text-green-700">{resumenMock.pagosRealizados} / {resumenMock.pagosTotales}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-gradient-to-r from-blue-50/80 to-green-50/80 rounded-xl p-6 flex items-center gap-4 border border-white/30 shadow">
          <CalendarCheck className="w-10 h-10 text-blue-500" />
          <div>
            <div className="text-sm text-neutral-500 mb-1">Próximo pago</div>
            <div className="text-lg font-bold text-blue-700">{new Date(resumenMock.proximoPago.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</div>
            <div className="text-green-700 font-bold">${resumenMock.proximoPago.valor.toLocaleString("es-CO")}</div>
            <Badge variant="outline" className="mt-1 bg-yellow-100 text-yellow-700 border-yellow-200">{resumenMock.proximoPago.estado}</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-green-600" />
            <span className="text-green-700 font-semibold">¡Estás al día con tus pagos!</span>
          </div>
          <p className="text-neutral-500 text-sm">Recuerda que puedes descargar tus recibos y reportar incidencias desde tu panel.</p>
        </div>
      </div>
    </section>
  );
} 