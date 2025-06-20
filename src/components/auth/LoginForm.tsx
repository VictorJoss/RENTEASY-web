"use client";
import { useState } from "react";
import { login } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { role } = await login(form);
      if (role === "propietario") router.push("/panel-propietario");
      else if (role === "inquilino") router.push("/panel-inquilino");
      else if (role === "admin") router.push("/panel-admin");
      else setError("Rol desconocido");
    } catch (e) {
      setError("Credenciales incorrectas");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-2 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Ingresando..." : "Iniciar sesión"}</Button>
      </form>
      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => router.push("/registro")}
        >
          ¿No tienes cuenta? Crear cuenta
        </button>
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => router.push("/recuperar")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </Card>
  );
}
