"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Lock, Unlock, Trash2, XCircle, User } from "lucide-react";

const mockUsuarios = [
  { id: 1, nombre: "Juan Pérez", email: "juan@mail.com", rol: "inquilino", estado: "activo", fecha: "2024-01-10" },
  { id: 2, nombre: "Ana Torres", email: "ana@mail.com", rol: "propietario", estado: "bloqueado", fecha: "2023-12-22" },
  { id: 3, nombre: "Carlos López", email: "carlos@mail.com", rol: "inquilino", estado: "activo", fecha: "2024-02-05" },
  { id: 4, nombre: "María Ruiz", email: "maria@mail.com", rol: "admin", estado: "activo", fecha: "2023-11-15" },
  { id: 5, nombre: "Pedro Gómez", email: "pedro@mail.com", rol: "propietario", estado: "activo", fecha: "2024-03-01" },
];
const PAGE_SIZE = 4;

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalUsuario, setModalUsuario] = useState<any>(null);

  const roles = ["inquilino", "propietario", "admin"];
  const estados = ["activo", "bloqueado"];

  const usuariosFiltrados = usuarios.filter(u =>
    (filtroRol ? u.rol === filtroRol : true) &&
    (filtroEstado ? u.estado === filtroEstado : true) &&
    (busqueda ? (
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / PAGE_SIZE) || 1;
  const usuariosPagina = usuariosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Acciones mock
  const toggleEstado = (id: number) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: u.estado === "activo" ? "bloqueado" : "activo" } : u));
  };
  const eliminarUsuario = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setModalUsuario(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de usuarios</h2>
      {/* Filtros */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Rol</label>
          <select value={filtroRol} onChange={e => { setFiltroRol(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {roles.map(r => <option key={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Nombre o email..."
          />
        </div>
      </div>
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm md:text-base">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b text-left">Nombre</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Rol</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Fecha registro</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((u) => (
              <tr key={u.id} className={`transition-colors ${u.estado === "bloqueado" ? "bg-red-50" : ""} hover:bg-blue-50/40`}>
                <td className="px-4 py-2 border-b">{u.nombre}</td>
                <td className="px-4 py-2 border-b">{u.email}</td>
                <td className="px-4 py-2 border-b capitalize">{u.rol}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${u.estado === "activo" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>{u.estado.charAt(0).toUpperCase() + u.estado.slice(1)}</span>
                </td>
                <td className="px-4 py-2 border-b">{u.fecha}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalUsuario(u)}><Eye size={16} className="mr-1" />Ver</Button>
                  <Button size="sm" onClick={() => toggleEstado(u.id)} className={u.estado === "activo" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}>
                    {u.estado === "activo" ? <Lock size={16} className="mr-1" /> : <Unlock size={16} className="mr-1" />}
                    {u.estado === "activo" ? "Bloquear" : "Desbloquear"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => eliminarUsuario(u.id)}><Trash2 size={16} className="mr-1" />Eliminar</Button>
                </td>
              </tr>
            ))}
            {usuariosPagina.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-400 py-4">No hay usuarios para los filtros/búsqueda seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-4">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
      </div>
      {/* Modal de detalle de usuario */}
      {modalUsuario && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalUsuario(null)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <User size={32} className="text-blue-600" />
              <h3 className="text-lg font-bold">Detalle de usuario</h3>
            </div>
            <div className="grid grid-cols-1 gap-y-2 mb-2">
              <div><b>Nombre:</b> {modalUsuario.nombre}</div>
              <div><b>Email:</b> {modalUsuario.email}</div>
              <div><b>Rol:</b> {modalUsuario.rol.charAt(0).toUpperCase() + modalUsuario.rol.slice(1)}</div>
              <div><b>Estado:</b> <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${modalUsuario.estado === "activo" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>{modalUsuario.estado.charAt(0).toUpperCase() + modalUsuario.estado.slice(1)}</span></div>
              <div><b>Fecha de registro:</b> {modalUsuario.fecha}</div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" onClick={() => toggleEstado(modalUsuario.id)} className={modalUsuario.estado === "activo" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}>
                {modalUsuario.estado === "activo" ? <Lock size={16} className="mr-1" /> : <Unlock size={16} className="mr-1" />}
                {modalUsuario.estado === "activo" ? "Bloquear" : "Desbloquear"}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => eliminarUsuario(modalUsuario.id)}><Trash2 size={16} className="mr-1" />Eliminar</Button>
              <Button size="sm" variant="outline" onClick={() => setModalUsuario(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

