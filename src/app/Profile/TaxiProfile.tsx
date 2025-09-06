'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recupererProfileTaxi, modifierProfileTaxi } from "../Api/AuthApi/TaxiApi";

// Structure de données conforme aux spécifications
interface TaxiProfileData {
  info: {
    nom_complet: string;
    email: string;
    telephone: string;
    naissance?: string;
    adresse: {
      ville?: string;
      pays?: string;
    };
    matricule?: string;
    Rib?: string;
    tva?: string;
  };
  vehicule: {
    marque?: string;
    matricule?: string;
    modele?: string;
    places?: number;
  };
}

export default function TaxiProfile() {
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
      adresse: {
        ville: '',
        pays: ''
      },
      matricule: '',
      Rib: '',
      tva: ''
    },
    vehicule: {
      marque: '',
      matricule: '',
      modele: '',
      places: 4
    }
  });

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté en tant que chauffeur
    const userType = localStorage.getItem('type');
    if (userType !== 'chauffeur') {
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
      const profile = await recupererProfileTaxi();
      console.log('Données du profil taxi reçues:', profile);
      
      // S'assurer que la structure des données est correcte
      const normalizedProfile = {
        info: {
          nom_complet: profile?.info?.nom_complet || '',
          email: profile?.info?.email || '',
          telephone: profile?.info?.telephone || '',
          naissance: formatDateForInput(profile?.info?.naissance || ''),
          adresse: {
            ville: profile?.info?.adresse?.ville || '',
            pays: profile?.info?.adresse?.pays || ''
          },
          matricule: profile?.info?.matricule || '',
          Rib: profile?.info?.Rib || '',
          tva: profile?.info?.tva || ''
        },
        vehicule: {
          marque: profile?.vehicule?.marque || '',
          matricule: profile?.vehicule?.matricule || '',
          modele: profile?.vehicule?.modele || '',
          places: profile?.vehicule?.places || 4
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

  // Fonction pour la validation du RIB
  const validateRIB = (rib: string) => {
    if (!rib) return true; // RIB optionnel
    const cleanRIB = rib.replace(/\s/g, '');
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    return ibanRegex.test(cleanRIB);
  };

  // Fonction pour la validation du numéro de TVA
  const validateTVA = (tva: string) => {
    if (!tva) return true; // TVA optionnel
    const cleanTVA = tva.replace(/\s/g, '');
    // Format TVA français : FR + 11 chiffres/lettres (ex: FR12345678901)
    const tvaRegex = /^[A-Z]{2}[A-Z0-9]{2,13}$/;
    return tvaRegex.test(cleanTVA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validation des champs obligatoires
    const { nom_complet, email, telephone } = profileData.info;
    
    if (!nom_complet || !email || !telephone) {
      setError('Les champs nom complet, email et téléphone sont obligatoires');
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

    // Validation du RIB si fourni
    if (profileData.info.Rib && !validateRIB(profileData.info.Rib)) {
      setError('Format RIB/IBAN invalide. Veuillez vérifier votre saisie.');
      setIsLoading(false);
      return;
    }

    // Validation du numéro de TVA si fourni
    if (profileData.info.tva && !validateTVA(profileData.info.tva)) {
      setError('Format numéro de TVA invalide. Veuillez vérifier votre saisie (ex: FR12345678901).');
      setIsLoading(false);
      return;
    }

    // Validation du nombre de places
    if (profileData.vehicule.places && (profileData.vehicule.places < 1 || profileData.vehicule.places > 9)) {
      setError('Le nombre de places doit être entre 1 et 9');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Données à sauvegarder:', profileData);
      
      await modifierProfileTaxi(profileData);
      
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
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.22.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Chauffeur</h1>
                <p className="text-gray-600">Gérez vos informations personnelles et votre véhicule</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
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

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  id="telephone"
                  name="telephone"
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
                  Date de Naissance
                </label>
                <input
                  id="naissance"
                  name="naissance"
                  type="date"
                  value={profileData.info.naissance}
                  onChange={(e) => handleInputChange('info', 'naissance', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                />
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  id="adresse.ville"
                  name="adresse.ville"
                  type="text"
                  value={profileData.info.adresse?.ville || ''}
                  onChange={(e) => handleInputChange('info', 'adresse.ville', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Paris"
                />
              </div>

              {/* Pays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <input
                  id="adresse.pays"
                  name="adresse.pays"
                  type="text"
                  value={profileData.info.adresse?.pays || ''}
                  onChange={(e) => handleInputChange('info', 'adresse.pays', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="France"
                />
              </div>

              {/* Matricule Chauffeur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matricule Chauffeur
                </label>
                <input
                  id="matricule"
                  name="matricule"
                  type="text"
                  value={profileData.info.matricule}
                  onChange={(e) => handleInputChange('info', 'matricule', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="CH123456"
                />
              </div>

              {/* RIB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RIB (Relevé d'Identité Bancaire)
                </label>
                <input
                  id="rib"
                  name="rib"
                  type="text"
                  value={profileData.info.Rib}
                  onChange={(e) => handleInputChange('info', 'Rib', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="FR76 3000 3000 1100 0001 2345 67"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format IBAN : 27 caractères commençant par le code pays (ex: FR76...)
                </p>
              </div>

              {/* TVA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de TVA
                </label>
                <input
                  id="tva"
                  name="tva"
                  type="text"
                  value={profileData.info.tva}
                  onChange={(e) => handleInputChange('info', 'tva', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="FR12345678901"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Numéro de TVA intracommunautaire (optionnel)
                </p>
              </div>
            </div>
          </div>

          {/* Informations Véhicule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.22.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
              </svg>
              Informations du Véhicule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matricule Véhicule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matricule du Véhicule
                </label>
                <input
                  id="vehicule.matricule"
                  name="vehicule.matricule"
                  type="text"
                  value={profileData.vehicule.matricule}
                  onChange={(e) => handleInputChange('vehicule', 'matricule', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="AB-123-CD"
                />
              </div>

                              {/* Marque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque du Véhicule
                </label>
                <input
                  id="vehicule.marque"
                  name="vehicule.marque"
                  type="text"
                  value={profileData.vehicule.marque}
                  onChange={(e) => handleInputChange('vehicule', 'marque', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Peugeot, Renault..."
                />
              </div>


              {/* Modèle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle du Véhicule
                </label>
                <input
                  id="vehicule.modele"
                  name="vehicule.modele"
                  type="text"
                  value={profileData.vehicule.modele}
                  onChange={(e) => handleInputChange('vehicule', 'modele', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Peugeot 208, Renault Clio..."
                />
              </div>

              {/* Nombre de Places */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Places
                </label>
                <input
                  id="vehicule.places"
                  name="vehicule.places"
                  type="number"
                  min="1"
                  max="9"
                  value={profileData.vehicule.places}
                  onChange={(e) => handleInputChange('vehicule', 'places', parseInt(e.target.value) || 4)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="4"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Nombre de places passagers (entre 1 et 9)
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
            className="text-blue-600 hover:text-blue-700 underline transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
