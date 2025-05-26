import axios from 'axios';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// TODO: ajouter token ici plutot que authStore ?

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Gestion des erreurs (ex: redirection vers login si 401)
//     if (error.response?.status === 401) {
//       // Rediriger vers la page de login ou rafraîchir le token
//     }
//     return Promise.reject(error);
//   }
// );

export default api;