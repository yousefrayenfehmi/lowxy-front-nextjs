'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TaxiApi from "../Api/AuthApi/TaxiApi";

export default function InscriptionTaxi() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    info:{
      nom_complet: '',
      email: '',
      telephone: '',
      motdepasse: '',
      confirmPassword: ''
    }
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Gère les noms de champs imbriqués comme 'info.nom_complet'
    if (name.startsWith('info.')) {
      const fieldName = name.replace('info.', '');
      setFormData({
        ...formData,
        info: {
          ...formData.info,
          [fieldName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Validation spécifique pour la confirmation du mot de passe
    if (name === 'info.confirmPassword') {
      if (value !== formData.info.motdepasse) {
        setError('Les mots de passe ne correspondent pas');
      } else {
        setError(''); // Efface l'erreur si les mots de passe correspondent
      }
    }

    // Validation quand on change le mot de passe principal
    if (name === 'info.motdepasse') {
      // D'abord vérifier la force du mot de passe
      const motDePasseValide = verifierPassword(value);
      
      // Ensuite vérifier la correspondance avec la confirmation
      if (motDePasseValide && formData.info.confirmPassword && value !== formData.info.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Envoie l'objet complet avec la structure attendue par le backend
      const taxi = await TaxiApi(formData);
      console.log(taxi.token);
      localStorage.setItem('token', taxi.token);
      // Navigation vers la page de confirmation de code
      console.log('Tentative de navigation vers /Auth/CodeConfirmation');
      router.push('/Auth/CodeConfirmation?type=chauffeur');
      console.log('Navigation déclenchée');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const verifierPassword = (password: string) => {
    // Vérifications avec regex
    const aAuMoins8Caracteres = password.length >= 8;
    const aUneMajuscule = /[A-Z]/.test(password);
    const aUneMinuscule = /[a-z]/.test(password);
    const aUnChiffre = /[0-9]/.test(password);
    const aUnSymbole = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Messages d'erreur spécifiques
    if (!aAuMoins8Caracteres) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!aUneMajuscule) {
      setError('Le mot de passe doit contenir au moins une majuscule (A-Z)');
      return false;
    }
    if (!aUneMinuscule) {
      setError('Le mot de passe doit contenir au moins une minuscule (a-z)');
      return false;
    }
    if (!aUnChiffre) {
      setError('Le mot de passe doit contenir au moins un chiffre (0-9)');
      return false;
    }
    if (!aUnSymbole) {
      setError('Le mot de passe doit contenir au moins un symbole (!@#$%^&*...)');
      return false;
    }

    // Si tout est bon
    setError('');
    return true;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Taxi</h1>
          <p className="text-gray-600">Créez votre compte chauffeur LOWXY</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Nom Complet */}
            <div>
              <input
                id="info.nom_complet"
                name="info.nom_complet"
                type="text"
                required
                value={formData.info.nom_complet}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Nom Complet"
              />
            </div>

            {/* Adresse Email */}
            <div>
              <input
                id="info.email"
                name="info.email"
                type="email"
                autoComplete="email"
                required
                value={formData.info.email}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Adresse Email"
              />
            </div>

            {/* Numéro de Téléphone */}
            <div>
              <input
                id="info.telephone"
                name="info.telephone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.info.telephone}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Numéro de Téléphone"
              />
            </div>

            {/* Mot de Passe */}
            <div>
              <input
                id="info.motdepasse"
                name="info.motdepasse"
                type="password"
                autoComplete="new-password"
                required
                value={formData.info.motdepasse}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Mot de Passe"
              />
            </div>

            {/* Confirmer Mot de Passe */}
            <div>
              <input
                id="info.confirmPassword"
                name="info.confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.info.confirmPassword}
                onChange={handleChange}
                className={`appearance-none rounded-xl relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-colors bg-white ${
                  error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Confirmer Mot de Passe"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>

          

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Créer mon Compte Chauffeur
            </button>
          </div>

          {/* Lien de connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500 underline">
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
