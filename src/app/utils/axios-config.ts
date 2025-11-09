import axios from 'axios';

// Configuration axios pour utiliser les rewrites Next.js
// Toutes les requêtes vers /api/* seront automatiquement redirigées vers le backend
const axiosInstance = axios.create({
  baseURL: '', // Utiliser les rewrites Next.js, donc pas de baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification si disponible
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token selon le type d'utilisateur
    const tokenPersonnel = localStorage.getItem('tokenpersonnel');
    const tokenChauffeur = localStorage.getItem('tokenchauffeur');
    const tokenPartenaire = localStorage.getItem('tokenpartenaire');
    const token = localStorage.getItem('token');
    
    // Utiliser le token disponible
    const authToken = tokenPersonnel || tokenChauffeur || tokenPartenaire || token;
    
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

