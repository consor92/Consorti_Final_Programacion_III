import axios from 'axios'
//import localStorage from './localStorage'

const api = axios.create({
  baseURL: 'http://localhost:4000/',
  timeout: 1000 * 15, // 15 sec
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
    (config) => {
      // Antes de enviar la solicitud, obten el token de localStorage
      const storedDataString = localStorage.getItem('authData');
      const storedData = storedDataString ? JSON.parse(storedDataString) : null;
  
      config.headers = config.headers || {};

      if (storedData) {
        // Si hay datos almacenados, establece el token en las cabeceras de la solicitud
        config.headers.Authorization = `Bearer ${storedData.token}`;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
 
  api.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      const { response } = error;
  
      if (response) {
        switch (response.status) {
          case 401:
            console.error('Error 401: Usuario no autorizado.');
            break;
          case 404:
            console.error('Error 404: Recurso no encontrado.');
            break;
          default:
            console.error(`Error ${response.status}: Ocurrió un error inesperado.`);
        }
      } else {
        console.error('Error en la solicitud:', error.message);
      }
  
      return Promise.reject(error);
    }
  );

export default api