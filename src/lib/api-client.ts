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
    // Manejo de errores más robusto
    const contentType = response.headers.get("content-type");
    let errorMessage = `Error: ${response.status} ${response.statusText}`; // Mensaje por defecto

    if (contentType && contentType.indexOf("application/json") !== -1) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || 'Error al registrar usuario';
      } catch (e) {
        // La respuesta decía ser JSON pero no lo era. Usamos el status text.
        console.error("Error parsing JSON response", e);
      }
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta es OK, el backend devuelve un MessageResponse que es JSON.
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
    // El login sí debería devolver un error JSON o un 401 sin cuerpo.
    // Si es 401, el mensaje será "Error: 401 Unauthorized"
    if(response.status === 401) {
        throw new Error("Credenciales incorrectas");
    }
    // Para otros errores, intentamos leer el JSON
    try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
    } catch (e) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }

  const userData = await response.json();
  
  localStorage.setItem('token', userData.accessToken);
  localStorage.setItem('user', JSON.stringify({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    roles: userData.roles
  }));

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
  window.location.href = '/login';
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
    logout();
    throw new Error('Sesión expirada. Por favor, inicie sesión de nuevo.');
  }
  
  return response;
}
