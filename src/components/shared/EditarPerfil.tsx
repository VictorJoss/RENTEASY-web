"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Mail, Phone, Lock, Camera, CheckCircle, XCircle } from "lucide-react";

const mockUser = {
  nombre: "Juan Pérez",
  email: "juan.perez@email.com",
  telefono: "+57 300 123 4567",
  foto: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default function EditarPerfil() {
  const [form, setForm] = useState({
    nombre: mockUser.nombre,
    email: mockUser.email,
    telefono: mockUser.telefono,
    password: "",
    foto: mockUser.foto,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(mockUser.foto);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFoto = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setForm({ ...form, foto: url });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setTimeout(() => {
      if (!form.nombre || !form.email) {
        setError("Por favor completa todos los campos obligatorios.");
      } else {
        setSuccess("¡Perfil actualizado exitosamente!");
      }
    }, 800);
  };

  return (
    <section className="w-full min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-0 md:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-8 mt-4">
          <div className="relative group">
            <img src={preview} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg" />
            <button
              type="button"
              className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition-colors border-2 border-white"
              onClick={() => fileInput.current?.click()}
              aria-label="Cambiar foto"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              className="hidden"
              onChange={handleFoto}
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mt-2"><User className="w-7 h-7" /> Editar perfil</h2>
          <span className="text-sm text-neutral-500">Haz clic en la cámara para cambiar tu foto</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><User className="w-4 h-4" /> Nombre completo</label>
            <Input name="nombre" value={form.nombre} onChange={handleChange} required autoComplete="name" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Mail className="w-4 h-4" /> Email</label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Phone className="w-4 h-4" /> Teléfono</label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} autoComplete="tel" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Lock className="w-4 h-4" /> Nueva contraseña</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="mt-1 pr-10"
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-blue-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-xs text-neutral-400">Mínimo 6 caracteres. Deja en blanco para no cambiar.</span>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            {success && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded p-2 text-sm"><CheckCircle className="w-4 h-4" /> {success}</div>}
            {error && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded p-2 text-sm"><XCircle className="w-4 h-4" /> {error}</div>}
            <Button type="submit" className="mt-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold shadow self-end w-full md:w-auto">Guardar cambios</Button>
          </div>
        </form>
      </div>
    </section>
  );
} 