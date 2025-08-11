"use client";
import React from "react";
import { useRouter } from "next/navigation";
export default function AuthHeader() {
  const router = useRouter();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Lowxy
            </h1>
          </div>

          {/* Boutons d'authentification */}
          <div className="flex items-center space-x-4">
            {/* Bouton Connexion */}
            <button onClick={() => router.push('/Auth/Connection')} className="group relative px-6 py-2.5 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all duration-300 hover:border-purple-400 hover:text-purple-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50">
              <span className="relative z-10">Connexion</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Bouton Inscription */}
            <button onClick={() => router.push('/Auth/Inscription')} className="group relative px-6 py-2.5 font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 overflow-hidden">
              <span className="relative z-10">Inscription</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}