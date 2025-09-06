'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recupererProfilePartenaire, modifierProfilePartenaire } from "../Api/AuthApi/PartnerApi";

export default function PartenaireProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    information: {
      inforegester: {
        nom_entreprise: '',
        Proprietaire: '',
        email: '',
        telephone: ''
      },
      info_societe: {
        numero_siret: '',
        domaines: [''],
        adresse: {
          pays: '',
          ville: '',
          rue: ''
        },
        tva: '',
        rib: ''
      }
    }
  });

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté en tant que partenaire
    const userType = localStorage.getItem('type');
    if (userType !== 'partenaire') {
      router.push('/Auth/Connection');
      return;
    }
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profile = await recupererProfilePartenaire();
      console.log('Données du profil partenaire reçues:', profile);
      
      // S'assurer que la structure des données est correcte
      const normalizedProfile = {
        information: {
          inforegester: {
            nom_entreprise: profile?.information?.inforegester?.nom_entreprise || '',
            Proprietaire: profile?.information?.inforegester?.Proprietaire || '',
            email: profile?.information?.inforegester?.email || '',
            telephone: profile?.information?.inforegester?.telephone || ''
          },
          info_societe: {
            numero_siret: profile?.information?.info_societe?.numero_siret || '',
            domaines: profile?.information?.info_societe?.domaines || [''],
            adresse: {
              pays: profile?.information?.info_societe?.adresse?.pays || '',
              ville: profile?.information?.info_societe?.adresse?.ville || '',
              rue: profile?.information?.info_societe?.adresse?.rue || ''
            },
            tva: profile?.information?.info_societe?.tva || '',
            rib: profile?.information?.info_societe?.rib || ''
          }
        }
      };
      
      setProfileData(normalizedProfile);
      console.log('Données normalisées:', normalizedProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
    }
  };

  const handleInputChange = (section: string, subsection: string | null, field: string, value: any) => {
    if (subsection) {
      // Pour inforamtion.inforegester
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        setProfileData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [subsection]: {
              ...(prev[section as keyof typeof prev] as any)[subsection],
              [parentField]: {
                ...((prev[section as keyof typeof prev] as any)[subsection] as any)[parentField],
                [childField]: value
              }
            }
          }
        }));
      } else {
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
      }
    } else {
      // Pour info_societe
      if (field.includes('.')) {
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
      } else if (field === 'domaines') {
        // Gestion spéciale pour les domaines (array)
        setProfileData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: Array.isArray(value) ? value : [value]
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
    }
  };



  // Fonction pour la validation du numéro de série
  const validateNumeroSerie = (numero: string) => {
    const cleanNumero = numero.replace(/\s/g, '');
    return cleanNumero.length > 0; // Validation simple, ajustez selon vos besoins
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validation des champs obligatoires
    const { nom_entreprise, Proprietaire, email, telephone } = profileData.information.inforegester;
    const { numero_siret, domaines, adresse } = profileData.information.info_societe;
    
    if (!nom_entreprise || !Proprietaire || !email || !telephone || !numero_siret || !adresse?.ville || !adresse?.pays || !adresse?.rue) {
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

    // Validation du numéro de série
    if (!validateNumeroSerie(numero_siret)) {
      setError('Numéro de série invalide.');
      setIsLoading(false);
      return;
    }



    try {
        console.log(profileData);
        
      await modifierProfilePartenaire(profileData);
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
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Partenaire</h1>
                <p className="text-gray-600">Gérez les informations de votre entreprise</p>
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
          {/* Informations de l'Entreprise */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
              </svg>
              Informations de l'Entreprise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom de l'Entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'Entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  id="nom_entreprise"
                  name="nom_entreprise"
                  type="text"
                  value={profileData.information.inforegester.nom_entreprise}
                  onChange={(e) => handleInputChange('information', 'inforegester', 'nom_entreprise', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Ma Super Entreprise SARL"
                />
              </div>

              {/* Propriétaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Propriétaire <span className="text-red-500">*</span>
                </label>
                <input
                  id="Proprietaire"
                  name="Proprietaire"
                  type="text"
                  value={profileData.information.inforegester.Proprietaire}
                  onChange={(e) => handleInputChange('information', 'inforegester', 'Proprietaire', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Jean Dupont"
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
                  value={profileData.information.inforegester.email}
                  onChange={(e) => handleInputChange('information', 'inforegester', 'email', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="contact@entreprise.com"
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
                  value={profileData.information.inforegester.telephone}
                  onChange={(e) => handleInputChange('information', 'inforegester', 'telephone', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              {/* Numéro de Série */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Siret <span className="text-red-500">*</span>
                </label>
                <input
                  id="numero_siret"
                  name="numero_siret"
                  type="text"
                  value={profileData.information.info_societe.numero_siret}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'numero_siret', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="NS123456789"
                />
              </div>

              {/* Domaines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domaines d'Activité <span className="text-red-500">*</span>
                </label>
                <input
                  id="domaines"
                  name="domaines"
                  type="text"
                  value={profileData.information.info_societe.domaines.join(', ')}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'domaines', e.target.value.split(', ').filter(d => d.trim()))}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="Transport, Tourisme, Technologie (séparés par des virgules)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Séparez les domaines par des virgules
                </p>
              </div>

              {/* Rue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rue <span className="text-red-500">*</span>
                </label>
                <input
                  id="adresse.rue"
                  name="adresse.rue"
                  type="text"
                  value={profileData.information.info_societe.adresse.rue}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'adresse.rue', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="123 Rue de la Paix"
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
                  value={profileData.information.info_societe.adresse.ville}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'adresse.ville', e.target.value)}
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
                  value={profileData.information.info_societe.adresse.pays}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'adresse.pays', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="France"
                />
              </div>

              {/* TVA */}

              {/* TVA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TVA <span className="text-red-500">*</span>
                </label>
                <input
                  id="tva"
                  name="tva"
                  type="text"
                  value={profileData.information.info_societe.tva}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'tva', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="FR123456789"
                />
              </div>  
              {/* TVA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RIB <span className="text-red-500">*</span>
                </label>
                <input
                  id="rib"
                  name="rib"
                  type="text"
                  value={profileData.information.info_societe.rib}
                  onChange={(e) => handleInputChange('information', 'info_societe', 'rib', e.target.value)}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-800"
                  placeholder="FR76 3000 3000 1100 0001 2345 67"
                />
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
