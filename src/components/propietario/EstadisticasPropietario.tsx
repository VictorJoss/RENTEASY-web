"use client";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const mockEstadisticas = {
  ingresos: [
    { mes: "Enero", valor: 2000000 },
    { mes: "Febrero", valor: 1800000 },
    { mes: "Marzo", valor: 2200000 },
    { mes: "Abril", valor: 2100000 },
    { mes: "Mayo", valor: 2500000 },
  ],
  ocupacion: [
    { propiedad: "Apartamento en Bogotá", tasa: 0.95, mesesOcupado: 5, mesesTotal: 5 },
    { propiedad: "Casa en Medellín", tasa: 0.85, mesesOcupado: 4, mesesTotal: 5 },
  ],
  ranking: [
    { propiedad: "Apartamento en Bogotá", ingresos: 10000000 },
    { propiedad: "Casa en Medellín", ingresos: 8000000 },
  ],
  evolucion: [
    { fecha: "2024-01", valor: 2000000 },
    { fecha: "2024-02", valor: 1800000 },
    { fecha: "2024-03", valor: 2200000 },
    { fecha: "2024-04", valor: 2100000 },
    { fecha: "2024-05", valor: 2500000 },
  ],
};

const data = {
  labels: mockEstadisticas.evolucion.map(e => e.fecha),
  datasets: [
    {
      label: "Ingresos",
      data: mockEstadisticas.evolucion.map(e => e.valor),
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
    title: { display: true, text: "Evolución de ingresos" },
  },
};

export default function EstadisticasPropietario() {
  const totalIngresos = mockEstadisticas.ingresos.reduce((acc, curr) => acc + curr.valor, 0);
  const ocupacionPromedio = (
    mockEstadisticas.ocupacion.reduce((acc, curr) => acc + curr.tasa, 0) /
    mockEstadisticas.ocupacion.length
  );

  function exportarCSV() {
    const rows = [
      ["Mes", "Ingresos"],
      ...mockEstadisticas.ingresos.map(i => [i.mes, i.valor])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "ingresos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Estadísticas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Ingresos totales</h3>
          <div className="text-2xl font-bold text-green-700 mb-2">${totalIngresos.toLocaleString("es-CO")}</div>
          <div className="text-sm text-neutral-500">Suma de todos los meses</div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Tasa de ocupación promedio</h3>
          <div className="text-2xl font-bold text-blue-700 mb-2">
            {ocupacionPromedio.toLocaleString("es-CO", { style: "percent", minimumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-neutral-500">Promedio de todas las propiedades</div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Propiedad más rentable</h3>
          <div className="text-lg font-bold text-amber-700 mb-2">{mockEstadisticas.ranking[0].propiedad}</div>
          <div className="text-sm text-neutral-500">Ingresos: ${mockEstadisticas.ranking[0].ingresos.toLocaleString("es-CO")}</div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Evolución de ingresos (últimos 5 meses)</h3>
          <ul className="space-y-1">
            {mockEstadisticas.evolucion.map((e) => (
              <li key={e.fecha} className="flex justify-between">
                <span>{e.fecha}</span>
                <span>${e.valor.toLocaleString("es-CO")}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ingresos por mes</h3>
          <ul className="space-y-1">
            {mockEstadisticas.ingresos.map((i) => (
              <li key={i.mes} className="flex justify-between">
                <span>{i.mes}</span>
                <span>${i.valor.toLocaleString("es-CO")}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ocupación por propiedad</h3>
          <ul className="space-y-1">
            {mockEstadisticas.ocupacion.map((o) => (
              <li key={o.propiedad} className="flex justify-between">
                <span>{o.propiedad}</span>
                <span>{(o.tasa * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="mt-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Resumen de ocupación</h3>
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Propiedad</th>
                <th className="px-4 py-2 border-b">Meses ocupada</th>
                <th className="px-4 py-2 border-b">Meses totales</th>
                <th className="px-4 py-2 border-b">Tasa</th>
              </tr>
            </thead>
            <tbody>
              {mockEstadisticas.ocupacion.map((o) => (
                <tr key={o.propiedad}>
                  <td className="px-4 py-2 border-b">{o.propiedad}</td>
                  <td className="px-4 py-2 border-b">{o.mesesOcupado}</td>
                  <td className="px-4 py-2 border-b">{o.mesesTotal}</td>
                  <td className="px-4 py-2 border-b">{(o.tasa * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="mt-8 bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Gráfico de ingresos (mock)</h3>
        <Line data={data} options={options} />
      </div>
      <Button onClick={exportarCSV} className="mb-4">Exportar ingresos a CSV</Button>
    </div>
  );
}
