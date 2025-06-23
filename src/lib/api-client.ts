import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function register(data: { name: string; email: string; password: string; document: string; role: string }) {
  try {
    const response = await apiClient.post('/api/auth/signup', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al registrar usuario');
    }
    throw new Error('Error de red o del servidor');
  }
}

export async function login(data: { email: string; password: string }): Promise<{ role: string }> {
  try {
    const response = await apiClient.post('/api/auth/signin', data);
    const userData = response.data;

    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      roles: userData.roles
    }));

    const mainRole = userData.roles[0].replace('ROLE_', '').toLowerCase();
    return { role: mainRole };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Credenciales incorrectas");
      }
      throw new Error(error.response.data.message || `Error: ${error.response.status}`);
    }
    throw new Error('Error de red o del servidor');
  }
}

export async function recoverPassword(data: { email: string }) {
  // TODO: Implementar la llamada al endpoint de recuperación de contraseña cuando exista.
  console.log("Recover password for", data.email);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

// --- Helper functions ---

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/signout');
  } catch (error) {
    console.error("Error al cerrar sesión en el servidor:", error);
  } finally {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Se puede crear una instancia de apiClient exportada para usar en otras partes
export { apiClient };

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al subir el archivo');
    }
    throw new Error('Error de red o del servidor al subir el archivo');
  }
}

export async function createProperty(data: {
  title: string;
  location: string;
  type: string;
  price: string;
  images: File[];
  description: string;
}) {
  try {
    const imageUrls = await Promise.all(data.images.map(uploadFile));
    
    const propertyData = {
      ...data,
      images: imageUrls,
    };

    const response = await apiClient.post('/api/properties', propertyData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear la propiedad');
    }
    throw new Error('Error de red o del servidor al crear la propiedad');
  }
}

export async function getMyProperties() {
  try {
    const response = await apiClient.get('/api/properties/my-properties');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener las propiedades');
    }
    throw new Error('Error de red o del servidor al obtener las propiedades');
  }
}

export async function deleteProperty(id: number) {
  try {
    const response = await apiClient.delete(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al eliminar la propiedad');
    }
    throw new Error('Error de red o del servidor al eliminar la propiedad');
  }
}

export async function getPropertyById(id: number) {
  try {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener la propiedad');
    }
    throw new Error('Error de red o del servidor al obtener la propiedad');
  }
}

export async function updateProperty(id: number, data: any) {
    try {
        const response = await apiClient.put(`/api/properties/${id}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al actualizar la propiedad');
        }
        throw new Error('Error de red o del servidor al actualizar la propiedad');
    }
}
