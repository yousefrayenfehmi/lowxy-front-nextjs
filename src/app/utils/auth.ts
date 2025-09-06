// Utilitaire pour gérer l'authentification et notifier les changements

export const setUserType = (type: string | null) => {
  if (typeof window !== 'undefined') {
    if (type) {
      localStorage.setItem('type', type);
    } else {
      localStorage.removeItem('type');
    }
    
    // Déclencher un événement personnalisé pour notifier le changement
    window.dispatchEvent(new CustomEvent('userTypeChanged'));
  }
};

export const getUserType = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('type');
  }
  return null;
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('type');
    localStorage.removeItem('tokenPersonnel');
    localStorage.removeItem('tokenTaxi');
    localStorage.removeItem('tokenPartner');
    
    // Déclencher un événement personnalisé pour notifier le changement
    window.dispatchEvent(new CustomEvent('userTypeChanged'));
  }
};
