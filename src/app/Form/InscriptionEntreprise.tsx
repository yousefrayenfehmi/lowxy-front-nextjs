'use client';
import React, { useState } from "react";

export default function InscriptionEntreprise() {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Met à jour les données du formulaire
    setFormData({
      ...formData,
      [name]: value
    });

    // Validation spécifique pour la confirmation du mot de passe
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setError('Les mots de passe ne correspondent pas');
      } else {
        setError(''); // Efface l'erreur si les mots de passe correspondent
      }
    }

    // Validation quand on change le mot de passe principal
    if (name === 'password') {
      // D'abord vérifier la force du mot de passe
      const motDePasseValide = verifierPassword(value);
      
      // Ensuite vérifier la correspondance avec la confirmation
      if (motDePasseValide && formData.confirmPassword && value !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données du formulaire entreprise:', formData);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Entreprise</h1>
          <p className="text-gray-600">Créez votre compte professionnel LOWXY</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Nom de l'Entreprise */}
            <div>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Nom de l'Entreprise"
              />
            </div>

            {/* Nom du Propriétaire */}
            <div>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Nom du Propriétaire"
              />
            </div>

            {/* Adresse Email */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Adresse Email"
              />
            </div>

            {/* Numéro de Téléphone */}
            <div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Numéro de Téléphone"
              />
            </div>

            {/* Mot de Passe */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Mot de Passe"
              />
            </div>

            {/* Confirmer Mot de Passe */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
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

          {/* Conditions d'utilisation */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-purple-600 hover:text-purple-500 underline">
                Conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-purple-600 hover:text-purple-500 underline">
                Politique de confidentialité
              </a>
            </label>
          </div>

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Créer mon Compte Entreprise
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

