'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recupererProfile, modifierProfile } from "../Api/AuthApi/PersonnelApi";

export default function PersonnelProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

      const [profileData, setProfileData] = useState({
      info: {
        nom_complet: '',
        email: '',
        telephone: '',
        naissance: '',
        adresse:{
          ville: '',
          pays: '',
        },
        matricule_taxi: '',
        rib: ''

      }
    });

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    const userType = localStorage.getItem('type');
    if (userType !== 'personnel') {
      router.push('/Auth/Connection');
      return;
    }
    loadProfileData();
  }, []);

  // Fonction pour formater la date au format YYYY-MM-DD
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    
    // Si la date est déjà au bon format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Essayer de parser différents formats de date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Formater au format YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const loadProfileData = async () => {
    try {
      const profile = await recupererProfile();
      console.log('Données du profil reçues:', profile);
      
      // S'assurer que la structure des données est correcte
      const normalizedProfile = {
        info: {
          nom_complet: profile?.info?.nom_complet || '',
          email: profile?.info?.email || '',
          telephone: profile?.info?.telephone || '',
          naissance: formatDateForInput(profile?.info?.naissance || ''),
          adresse: {
            ville: profile?.info?.adresse?.ville || '',
            pays: profile?.info?.adresse?.pays || '',
          },
          matricule_taxi: profile?.info?.matricule_taxi || '',
          rib: profile?.info?.rib || ''
        }
      };
      
      setProfileData(normalizedProfile);
      console.log('Données normalisées:', normalizedProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (field.includes('.')) {
      // Gestion des champs imbriqués comme 'adresse.ville'
      const [parentField, childField] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [parentField]: {
            ...(prev[section as keyof typeof prev] as any)[parentField],
            [childField]: value
          }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    }
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  // Fonction pour la validation du RIB
  const validateRIB = (rib: string) => {
    // Format IBAN européen : 27 caractères
    const cleanRIB = rib.replace(/\s/g, ''); // Supprimer les espaces
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    return ibanRegex.test(cleanRIB);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validation des champs obligatoires
    const { nom_complet, email, telephone, naissance, adresse, matricule_taxi, rib } = profileData.info;
    
    if (!nom_complet || !email || !telephone || !naissance || !adresse?.ville || !adresse?.pays || !matricule_taxi || !rib) {
      setError('Tous les champs marqués d\'un * sont obligatoires');
      setIsLoading(false);
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez saisir une adresse email valide');
      setIsLoading(false);
      return;
    }

    // Validation du RIB
    if (!validateRIB(rib)) {
      setError('Format RIB/IBAN invalide. Veuillez vérifier votre saisie.');
      setIsLoading(false);
      return;
    }

    try {
      console.log(profileData);
      
        const response = await modifierProfile(profileData);
        console.log(response);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage('Profil complété avec succès ! Vos informations ont été sauvegardées.');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Personnelles */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Informations Personnelles
            </h2>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Nom Complet */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Nom Complet <span className="text-red-500">*</span>
                 </label>
                 <input
                 id="nom_complet"
                 name="nom_complet"
                   type="text"
                   value={profileData.info.nom_complet}
                   onChange={(e) => handleInputChange('info', 'nom_complet', e.target.value)}
                   disabled={!isEditing}
                   required
                   className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                   placeholder="Votre nom et prénom"
                 />
               </div>

               {/* Email */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Adresse Email <span className="text-red-500">*</span>
                 </label>
                 <input
                 id="email"
                 name="email"
                   type="email"
                   value={profileData.info.email}
                   onChange={(e) => handleInputChange('info', 'email', e.target.value)}
                   disabled={!isEditing}
                   required
                   className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                   placeholder="votre.email@exemple.com"
                 />
               </div>

               {/* Numéro de Téléphone */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Numéro de Téléphone <span className="text-red-500">*</span>
                 </label>
                 <input
                   id="numero"
                   name="numero"
                   type="tel"
                   value={profileData.info.telephone}
                   onChange={(e) => handleInputChange('info', 'telephone', e.target.value)}
                   disabled={!isEditing}
                   required
                   className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                   placeholder="+33 6 12 34 56 78"
                 />
               </div>

               {/* Date de Naissance */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Date de Naissance <span className="text-red-500">*</span>
                 </label>
                                 <input
                id="naissance"
                name="naissance"
                  type="date"
                  value={profileData.info.naissance}
                  onChange={(e) => handleInputChange('info', 'naissance', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                />
               </div>

               {/* Numéro de Taxi */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Numéro de Taxi <span className="text-red-500">*</span>
                 </label>
                 <input
                 id="numero_taxi"
                 name="numero_taxi"
                   type="text"
                   value={profileData.info.matricule_taxi}
                   onChange={(e) => handleInputChange('info', 'numero_taxi', e.target.value)}
                   disabled={!isEditing}
                   required
                   className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                   placeholder="Ex: TX123456"
                 />
               </div>

              

               {/* Ville */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Ville <span className="text-red-500">*</span>
                 </label>
                                 <input
                id="adresse.ville"
                name="adresse.ville"
                  type="text"
                  value={profileData.info.adresse?.ville || ''}
                  onChange={(e) => handleInputChange('info', 'adresse.ville', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Paris"
                />
               </div>

               {/* Pays */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Pays <span className="text-red-500">*</span>
                 </label>
                                 <input
                id="adresse.pays"
                name="adresse.pays"
                  type="text"
                  value={profileData.info.adresse?.pays || ''}
                  onChange={(e) => handleInputChange('info', 'adresse.pays', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="France"
                />
               </div>

               {/* RIB */}
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-black mb-2">
                   RIB (Relevé d'Identité Bancaire) <span className="text-red-500">*</span>
                 </label>
                 <input
                 id="rib"
                 name="rib"
                   type="text"
                   value={profileData.info.rib}
                   onChange={(e) => handleInputChange('info', 'rib', e.target.value)}
                   disabled={!isEditing}
                   required
                   className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                   placeholder="FR76 3000 3000 1100 0001 2345 67"
                 />
                 <p className="text-sm text-gray-500 mt-1">
                   Format IBAN : 27 caractères commençant par le code pays (ex: FR76...)
                 </p>
               </div>
             </div>
          </div>

          

           

          

          {/* Boutons d'action */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sauvegarde...
                  </>
                ) : (
                  'Sauvegarder'
                )}
              </button>
            </div>
          )}
        </form>

        {/* Bouton retour */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-purple-600 hover:text-purple-700 underline transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
