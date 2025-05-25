"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, BarChart2, FileText, Home, User } from "lucide-react";
import { Line } from "react-chartjs-2";

const ultimasIncidencias = [
  { id: 1, usuario: "Juan Pérez", tipo: "Daño", propiedad: "Apto Bogotá", fecha: "2024-06-01", estado: "Pendiente" },
  { id: 2, usuario: "Ana Torres", tipo: "Fuga", propiedad: "Casa Medellín", fecha: "2024-05-28", estado: "Resuelta" },
];

const pagosRecientes = [
  { id: 1, usuario: "Carlos López", propiedad: "Apto Bogotá", fecha: "2024-06-02", monto: 1200000 },
  { id: 2, usuario: "María Ruiz", propiedad: "Casa Medellín", fecha: "2024-06-01", monto: 2500000 },
];

const actividad = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Nuevos usuarios",
      data: [10, 15, 12, 18, 20, 22],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.1)",
      tension: 0.3,
    },
    {
      label: "Contratos firmados",
      data: [5, 8, 7, 10, 12, 14],
      borderColor: "#f59e42",
      backgroundColor: "rgba(245,158,66,0.1)",
      tension: 0.3,
    },
  ],
};

const actividadOptions = {
  responsive: true,
  maintainAspectRatio: false, // ✅ evita que el gráfico se deforme
  plugins: {
    legend: { display: true },
    title: { display: true, text: "Actividad reciente" },
  },
};

const resumen = [
  { label: "Usuarios", value: 124, icon: <User className="text-blue-600" /> },
  { label: "Propiedades", value: 58, icon: <Home className="text-green-600" /> },
  { label: "Contratos", value: 41, icon: <FileText className="text-amber-600" /> },
  { label: "Incidencias", value: 7, icon: <AlertTriangle className="text-red-600" /> },
  { label: "Ingresos (mes)", value: "$32.500.000", icon: <BarChart2 className="text-emerald-600" /> },
];

export default function AdminDashboard() {
  return (

  <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {resumen.map((r) => (
            <Card key={r.label} className="p-4 flex flex-col items-center justify-center">
              <div className="mb-2">{r.icon}</div>
              <div className="text-2xl font-bold">{r.value}</div>
              <div className="text-xs text-neutral-500">{r.label}</div>
            </Card>
          ))}
        </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Últimas incidencias</h3>
        <ul className="divide-y">
          {ultimasIncidencias.map((i) => (
            <li key={i.id} className="py-2 flex flex-col text-sm">
              <span className="font-medium">
                {i.tipo} en {i.propiedad}
              </span>
              <span className="text-neutral-500">
                {i.usuario} • {i.fecha} •{" "}
                <span className={i.estado === "Resuelta" ? "text-green-600" : "text-yellow-600"}>
                  {i.estado}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Pagos recientes</h3>
        <ul className="divide-y">
          {pagosRecientes.map((p) => (
            <li key={p.id} className="py-2 flex flex-col text-sm">
              <span className="font-medium">
                {p.usuario} - {p.propiedad}
              </span>
              <span className="text-neutral-500">
                {p.fecha} •{" "}
                <span className="text-blue-700 font-bold">
                  ${p.monto.toLocaleString("es-CO")}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Contenedor del gráfico */}
      <div className="col-span-1 md:col-span-2 flex justify-center items-center">
        <div
          className="bg-white rounded-xl shadow p-6 w-full max-w-4xl"
          style={{ height: 400 }} // ✅ altura fija y controlada
        >
          <Line data={actividad} options={actividadOptions} />
        </div>
      </div>
    </div>
    </div>
  );
}
