import axios from 'axios'
//import localStorage from './localStorage'

const api = axios.create({
  baseURL: 'http://localhost:4000/',
  timeout: 1000 * 20, // 15 sec
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
        config.headers.Authorization = storedData.token;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
 
  api.interceptors.response.use(
    (response) => {
      // Hacer algo con la respuesta antes de devolverla
      return response.data;
    },
    (error) => {
      // Hacer algo con el error antes de rechazar la promesa
      console.error('Error en la respuesta:', error);
      return Promise.reject(error);
    }
  );

export default api