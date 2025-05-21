// Importa la librería Axios para realizar peticiones HTTP
import axios from 'axios';

// Crea una instancia personalizada de Axios
const API = axios.create({
  baseURL: 'http://localhost:5000', // URL base del backend (puede cambiar en producción)
});

// Interceptor de solicitudes:
// Antes de enviar cada petición, se adjunta automáticamente el token JWT en los encabezados
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

  // Si existe token, lo agrega al encabezado Authorization en formato Bearer
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Retorna la configuración modificada
});

// Exporta la instancia configurada para ser utilizada en todo el frontend
export default API;
