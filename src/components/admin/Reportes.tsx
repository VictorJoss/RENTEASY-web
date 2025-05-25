"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, BarChart2, Users, Home, FileText, DollarSign, Calendar } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const datosUsuarios = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Nuevos usuarios",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "rgba(37, 99, 235, 0.5)",
      borderColor: "rgb(37, 99, 235)",
      borderWidth: 1,
    },
  ],
};

const datosIngresos = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Ingresos (millones)",
      data: [12, 19, 15, 17, 22, 25],
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.3,
    },
  ],
};

const datosPropiedades = {
  labels: ["Apartamentos", "Casas", "Oficinas", "Locales"],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        "rgba(37, 99, 235, 0.5)",
        "rgba(34, 197, 94, 0.5)",
        "rgba(245, 158, 66, 0.5)",
        "rgba(239, 68, 68, 0.5)",
      ],
      borderColor: [
        "rgb(37, 99, 235)",
        "rgb(34, 197, 94)",
        "rgb(245, 158, 66)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 1,
    },
  ],
};

const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const metricas = [
  { label: "Usuarios totales", valor: "1,234", icon: <Users className="text-blue-600" /> },
  { label: "Propiedades activas", valor: "567", icon: <Home className="text-green-600" /> },
  { label: "Contratos vigentes", valor: "890", icon: <FileText className="text-amber-600" /> },
  { label: "Ingresos mensuales", valor: "$32.5M", icon: <DollarSign className="text-emerald-600" /> },
];

export default function Reportes() {
  const [periodo, setPeriodo] = useState("6m");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reportes y estadísticas</h2>
      
      {/* Selector de período */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="text-neutral-600" />
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="1m">Último mes</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último año</option>
          </select>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1" />
            Exportar reporte
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricas.map((m) => (
          <div key={m.label} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              {m.icon}
              <div>
                <div className="text-sm text-neutral-500">{m.label}</div>
                <div className="text-xl font-bold">{m.valor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de usuarios */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-blue-600" />
            <h3 className="font-semibold">Crecimiento de usuarios</h3>
          </div>
          <Bar data={datosUsuarios} options={opcionesGrafico} />
        </div>

        {/* Gráfico de ingresos */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-emerald-600" />
            <h3 className="font-semibold">Ingresos mensuales</h3>
          </div>
          <Line data={datosIngresos} options={opcionesGrafico} />
        </div>

        {/* Gráfico de propiedades */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="text-green-600" />
            <h3 className="font-semibold">Distribución de propiedades</h3>
          </div>
          <Pie data={datosPropiedades} options={opcionesGrafico} />
        </div>

        {/* Gráfico de contratos */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-amber-600" />
            <h3 className="font-semibold">Contratos por tipo</h3>
          </div>
          <Bar
            data={{
              labels: ["Arriendo", "Venta", "Servicios"],
              datasets: [
                {
                  label: "Cantidad",
                  data: [65, 59, 80],
                  backgroundColor: [
                    "rgba(37, 99, 235, 0.5)",
                    "rgba(34, 197, 94, 0.5)",
                    "rgba(245, 158, 66, 0.5)",
                  ],
                  borderColor: [
                    "rgb(37, 99, 235)",
                    "rgb(34, 197, 94)",
                    "rgb(245, 158, 66)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={opcionesGrafico}
          />
        </div>
      </div>
    </div>
  );
} 