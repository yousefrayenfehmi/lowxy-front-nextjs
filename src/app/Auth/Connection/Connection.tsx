'use client';
import React, { useEffect, useState } from "react";
import ConnectionForm from "../../Form/Connection";
import { useSearchParams } from "next/navigation";
import { useMessage } from "../../contexts/MessageContext";
export default function Connection() {
  const [accountType, setAccountType] = useState<'personnel' | 'chauffeur' | 'partenaire'>('personnel');
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const { showMessage } = useMessage();
  useEffect(() => {
    console.log('Type depuis URL:', type);
    
    if (type === 'personnel') {
      setAccountType('personnel');
    } else if (type === 'chauffeur') {
      setAccountType('chauffeur');
    } else if (type === 'partenaire') {
      setAccountType('partenaire');
    } else {
      // Si pas de type ou type null, garder 'personnel' par défaut
      setAccountType('personnel');
    }
  }, [type]);

  // Afficher un message si l'URL contient un indicateur d'échec de connexion
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      showMessage('Échec de connexion. Vérifiez vos identifiants et réessayez.', 'error');
    }
  }, [searchParams, showMessage]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connexion</h1>
          <p className="text-gray-600 text-lg">
            Sélectionnez votre type de compte
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="space-y-6 mt-8">
          <div className="grid grid-cols-3 gap-3">
            {/* Personnel Button */}
            <button
              onClick={() => setAccountType('personnel')}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                accountType === 'personnel'
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white border-gray-300 hover:border-purple-400'
              }`}
            >
              <span
                className={`font-semibold text-sm ${
                  accountType === 'personnel' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Personnel
              </span>
            </button>

            {/* Chauffeur Button */}
            <button
              onClick={() => setAccountType('chauffeur')}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                accountType === 'chauffeur'
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white border-gray-300 hover:border-purple-400'
              }`}
            >
              <span
                className={`font-semibold text-sm ${
                  accountType === 'chauffeur' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Chauffeur
              </span>
            </button>

            {/* Partenaire Button */}
            <button
              onClick={() => setAccountType('partenaire')}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                accountType === 'partenaire'
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white border-gray-300 hover:border-purple-400'
              }`}
            >
              <span
                className={`font-semibold text-sm ${
                  accountType === 'partenaire' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Partenaire
              </span>
            </button>
          </div>
                </div>

        {/* Affichage du formulaire de connexion */}
        <ConnectionForm type={accountType} />
              </div>
    </main>
  );
}
