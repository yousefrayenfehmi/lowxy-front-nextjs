'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerApi } from "../Api/AuthApi/PartnerApi";

export default function InscriptionPartenair() {
  const router = useRouter();
  const [formData, setFormData] = useState(
    {inforamtion:{
              inforegester: {
                nom_entreprise: '',
                Proprietaire: '',
                email: '',
                telephone: '',
                motdepasse: '',
                confirmPassword: ''
              }
  }});

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Gère les noms de champs imbriqués
    if (name.startsWith('inforamtion.inforegester.')) {
      const fieldName = name.replace('inforamtion.inforegester.', '');
      setFormData({
        ...formData,
        inforamtion: {
          ...formData.inforamtion,
          inforegester: {
            ...formData.inforamtion.inforegester,
            [fieldName]: value
          }
        }
      });
    } else if (name.startsWith('inforegester.')) {
      const fieldName = name.replace('inforegester.', '');
      setFormData({
        ...formData,
        inforamtion: {
          ...formData.inforamtion,
          inforegester: {
            ...formData.inforamtion.inforegester,
            [fieldName]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        inforamtion: {
          ...formData.inforamtion,
          [name]: value
        }
      });
    }

    // Validation spécifique pour la confirmation du mot de passe
    if (name.endsWith('confirmPassword')) {
      if (value !== formData.inforamtion.inforegester.motdepasse) {
        setError('Les mots de passe ne correspondent pas');
      } else {
        setError(''); // Efface l'erreur si les mots de passe correspondent
      }
    }

    // Validation quand on change le mot de passe principal
    if (name.endsWith('motdepasse')) {
      // D'abord vérifier la force du mot de passe
      const motDePasseValide = verifierPassword(value);
      
      // Ensuite vérifier la correspondance avec la confirmation
      if (motDePasseValide && formData.inforamtion.inforegester.confirmPassword && value !== formData.inforamtion.inforegester.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Créer l'objet final sans confirmPassword
      const { confirmPassword, ...inforegesterData } = formData.inforamtion.inforegester;
      const finalData = {
        inforamtion: {
          inforegester: inforegesterData
        }
      };
      
      console.log('Données du formulaire partenaire:', finalData);
      // Appeler l'API partenaire
      const partner = await PartnerApi(finalData);
      localStorage.setItem('token', partner.token);
      router.push('/Auth/CodeConfirmation?type=partenaire');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Partenaire</h1>
          <p className="text-gray-600">Devenez partenaire LOWXY</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Nom de l'Entreprise */}
            <div>
              <input
                id="inforamtion.inforegester.nom_entreprise"
                name="inforamtion.inforegester.nom_entreprise"
                type="text"
                required
                value={formData.inforamtion.inforegester.nom_entreprise}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Nom de l'Entreprise"
              />
            </div>

            {/* Nom du Propriétaire */}
            <div>
              <input
                id="inforegester.Proprietaire"
                name="inforegester.Proprietaire"
                type="text"
                required
                value={formData.inforamtion.inforegester.Proprietaire}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Nom du Propriétaire"
              />
            </div>

            {/* Adresse Email */}
            <div>
              <input
                id="inforegester.email"
                name="inforegester.email"
                type="email"
                autoComplete="email"
                required
                value={formData.inforamtion.inforegester.email}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Adresse Email"
              />
            </div>

            {/* Numéro de Téléphone */}
            <div>
              <input
                id="inforegester.telephone"
                name="inforegester.telephone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.inforamtion.inforegester.telephone}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Numéro de Téléphone"
              />
            </div>

            {/* Mot de Passe */}
            <div>
              <input
                id="inforegester.motdepasse"
                name="inforegester.motdepasse"
                type="password"
                autoComplete="new-password"
                required
                value={formData.inforamtion.inforegester.motdepasse}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                placeholder="Mot de Passe"
              />
            </div>

            {/* Confirmer Mot de Passe */}
            <div>
              <input
                id="inforegester.confirmPassword"
                name="inforegester.confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.inforamtion.inforegester.confirmPassword}
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
         

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Devenir Partenaire LOWXY
            </button>
          </div>

          {/* Lien de connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte partenaire ?{' '}
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
