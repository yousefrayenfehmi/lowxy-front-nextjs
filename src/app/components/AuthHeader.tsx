"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth } from "../utils/auth";

export default function AuthHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // S'assurer qu'on est côté client avant d'accéder à localStorage
    if (typeof window !== 'undefined') {
      setIsClient(true);
      const type = localStorage.getItem('type');
      setUserType(type);
      console.log('Type utilisateur initial:', type);

      // Fonction pour mettre à jour le type d'utilisateur
      const updateUserType = () => {
        const newType = localStorage.getItem('type');
        console.log('Mise à jour du type utilisateur:', newType);
        setUserType(newType);
      };

      // Écouter les changements dans localStorage
      window.addEventListener('storage', updateUserType);
      
      // Écouter les événements personnalisés pour les changements dans le même onglet
      window.addEventListener('userTypeChanged', updateUserType);

      // Vérifier périodiquement les changements (backup solution)
      const interval = setInterval(() => {
        const currentType = localStorage.getItem('type');
        if (currentType !== userType) {
          console.log('Changement détecté par interval:', currentType);
          setUserType(currentType);
        }
      }, 1000);

      // Nettoyage
      return () => {
        window.removeEventListener('storage', updateUserType);
        window.removeEventListener('userTypeChanged', updateUserType);
        clearInterval(interval);
      };
    }
  }, [userType]); // Ajouter userType comme dépendance

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  // Fonction pour obtenir les éléments de menu selon le type d'utilisateur
  const getMenuItems = (type: string) => {
    switch (type) {
      case 'personnel':
        return [
          { label: '🎯 Consulter Tours', href: '/Tours' },
          { label: '🎫 Mes Réservations', href: '/Reservations/mes' },
          { label: '🤝 Coverings Personnel', href: '/Covering_ads/Personnel/partenaire/mes-coverings' },
          { label: '👤 Mon Profil', href: '/Profile' },
        ];
      case 'chauffeur':
        return [
          { label: '🚕 Mes Coverings Taxi', href: '/Covering_ads/Taxi' },
          { label: '🗓️ Mes Assignations', href: '/Covering_ads/Taxi/mes-assignations' },
          { label: '👤 Mon Profil', href: '/Profile' },
        ];
      case 'partenaire':
        return [
          { label: '➕ Ajouter Tour', href: '/Tours/ajouter' },
          { label: '📋 Mes Tours', href: '/Tours/mes' },
          { label: '🤝 Mes Coverings', href: '/Covering_ads/Personnel/partenaire/mes-coverings' },
          { label: '👤 Mon Profil', href: '/Profile' },
        ];
      default:
        return [];
    }
  };

  // Fonction pour obtenir le titre du rôle
  const getRoleTitle = (type: string) => {
    switch (type) {
      case 'personnel': return 'Touriste';
      case 'chauffeur': return 'Chauffeur';
      case 'partenaire': return 'Partenaire';
      default: return type;
    }
  };

  // Fonction pour obtenir la couleur du rôle
  const getRoleColor = (type: string) => {
    switch (type) {
      case 'personnel': return 'bg-blue-100 text-blue-800';
      case 'chauffeur': return 'bg-yellow-100 text-yellow-800';
      case 'partenaire': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre */}
          <button onClick={() => router.push('/')}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Lowxy
            </h1>
          </button>

          {/* Boutons d'authentification */}
          <div className="flex items-center space-x-4">
            {/* Affichage conditionnel seulement côté client */}
            {isClient && (
              <>
                {/* Bouton Connexion */}
                {userType !== 'personnel' && userType !== 'chauffeur' && userType !== 'partenaire' && (
                  <button 
                    onClick={() => router.push('/Auth/Connection?type=' + userType)} 
                    className="group relative px-6 py-2.5 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all duration-300 hover:border-purple-400 hover:text-purple-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                  >
                    <span className="relative z-10">Connexion</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
                {/* Bouton Inscription */}
                {userType !== 'personnel' && userType !== 'chauffeur' && userType !== 'partenaire' && (
                  <button 
                    onClick={() => router.push('/Auth/Inscription')} 
                    className="group relative px-6 py-2.5 font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 overflow-hidden"
                  >
                    <span className="relative z-10">Inscription</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
                {/* Menu utilisateur connecté */}
                {(userType === 'personnel' || userType === 'chauffeur' || userType === 'partenaire') && (
                  <div className="relative">
                    {/* Bouton du menu utilisateur */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getRoleColor(userType)} hover:scale-105`}
                    >
                      <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-5 h-5 text-gray-700" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {getRoleTitle(userType)}
                        </div>
                        <div className="text-xs opacity-75">
                          Mon compte
                        </div>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Menu déroulant */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                        {/* En-tête du menu */}
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor(userType)}`}>
                              <span className="text-lg">
                                {userType === 'personnel' && '👤'}
                                {userType === 'chauffeur' && '🚕'}
                                {userType === 'partenaire' && '🤝'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{getRoleTitle(userType)}</div>
                              <div className="text-sm text-gray-500">Connecté</div>
                            </div>
                          </div>
                        </div>

                        {/* Éléments du menu */}
                        <div className="py-2">
                          {getMenuItems(userType).map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                router.push(item.href);
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-3"
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Bouton de déconnexion */}
                        <div className="border-t border-gray-200/50 pt-2">
                          <button 
                            onClick={() => {
                              clearAuth();
                              setUserType(null);
                              setShowUserMenu(false);
                              router.push('/');
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                              />
                            </svg>
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}