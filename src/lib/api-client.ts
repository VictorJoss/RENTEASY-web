const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function register(data: { name: string; email: string; password: string; document: string; role: string }) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al registrar usuario');
  }

  return response.json();
}

export async function login(data: { email: string; password: string }): Promise<{ role: string }> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const userData = await response.json();
  
  // Guardar token y datos del usuario en localStorage
  localStorage.setItem('token', userData.accessToken);
  localStorage.setItem('user', JSON.stringify({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    roles: userData.roles
  }));

  // El frontend espera un solo rol para la redirección.
  // Devolvemos el primer rol, que debería ser el más específico.
  // Ej: "ROLE_PROPIETARIO" -> "propietario"
  const mainRole = userData.roles[0].replace('ROLE_', '').toLowerCase();
  
  return { role: mainRole };
}

export async function recoverPassword(data: { email: string }) {
  // TODO: Implementar la llamada al endpoint de recuperación de contraseña cuando exista.
  console.log("Recover password for", data.email);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}


// --- Helper functions ---

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUser(): any | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Aquí podrías redirigir al login
  // window.location.href = '/login';
}

// Puedes añadir una función para realizar llamadas autenticadas
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (response.status === 401) {
    // Token inválido o expirado, desloguear al usuario
    logout();
    throw new Error('Sesión expirada. Por favor, inicie sesión de nuevo.');
  }
  
  return response;
}
