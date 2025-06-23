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

export const getMyProperties = () => apiClient.get('/api/properties/my-properties');

export const getPropertyById = (id: string) => apiClient.get(`/api/properties/${id}`);

export const createProperty = (data: any) => {
  const { images, ...rest } = data;
  return uploadFiles(images).then(imageUrls => {
    return apiClient.post('/api/properties', { ...rest, images: imageUrls });
  });
};

export const updateProperty = (id: string, data: any) => apiClient.put(`/api/properties/${id}`, data);

export const deleteProperty = (id: number) => apiClient.delete(`/api/properties/${id}`);

export const uploadFiles = (files: FileList) => {
  const uploadPromises: Promise<string>[] = [];
  for (let i = 0; i < files.length; i++) {
    uploadPromises.push(uploadFile(files[i]));
  }
  return Promise.all(uploadPromises);
};
