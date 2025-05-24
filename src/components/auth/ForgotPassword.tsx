"use client";
import { useState } from "react";
import { recoverPassword } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    await recoverPassword({ email });
    setLoading(false);
    router.push("/verificar-email");
  };

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar enlace de recuperación"}</Button>
      </form>
      <div className="mt-4 flex justify-center text-sm">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => router.push("/login")}
        >
          Volver a iniciar sesión
        </button>
      </div>
    </Card>
  );
}
