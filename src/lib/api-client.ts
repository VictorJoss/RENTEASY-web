export async function register(data: { name: string; email: string; password: string; document: string; role: string }) {
  // Seguridad: solo permitimos propietario o inquilino
  const safeRole = data.role === "propietario" || data.role === "inquilino" ? data.role : "inquilino";
  // Simulación de registro
  return new Promise((resolve) => setTimeout(() => resolve({ ...data, role: safeRole }), 1000));
}

export async function login(data: { email: string; password: string }): Promise<{ role: string }> {
  // Simulación de login
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === "propietario@demo.com") resolve({ role: "propietario" });
      else if (data.email === "inquilino@demo.com") resolve({ role: "inquilino" });
      else if (data.email === "admin@demo.com") resolve({ role: "admin" });
      else reject(new Error("Credenciales incorrectas"));
    }, 1000);
  });
}

export async function recoverPassword(data: { email: string }) {
  // Simulación de recuperación de contraseña
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
