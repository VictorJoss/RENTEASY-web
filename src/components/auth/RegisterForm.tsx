"use client";
import { useState } from "react";
import { register } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", document: "", role: "propietario" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (e: { target: { value: string } }) => {
    // Solo permitimos propietario o inquilino
    if (e.target.value === "propietario" || e.target.value === "inquilino") {
      setForm({ ...form, role: e.target.value });
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    await register(form);
    setLoading(false);
    router.push("/confirmacion-cuenta");
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <Input name="document" placeholder="Documento de identidad" value={form.document} onChange={handleChange} required />
        <div>
          <label className="block mb-1 text-sm font-medium">Tipo de usuario</label>
          <select
            name="role"
            value={form.role}
            onChange={handleRoleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="propietario">Propietario</option>
            <option value="inquilino">Inquilino</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear cuenta"}</Button>
      </form>
      <div className="mt-4 flex justify-center text-sm">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => router.push("/login")}
        >
          ¿Ya tienes cuenta? Iniciar sesión
        </button>
      </div>
    </Card>
  );
}
