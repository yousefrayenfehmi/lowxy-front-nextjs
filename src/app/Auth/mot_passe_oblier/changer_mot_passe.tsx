'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordApi } from "../../Api/AuthApi/ForgotPasswordApi";

export default function ChangerMotPasse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [type, setType] = useState('');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const typeParam = searchParams.get('type');
    
    setToken(tokenParam || '');
    setType(typeParam || '');
    console.log(tokenParam, typeParam);
    
    if (!tokenParam) {
      setError('Token de réinitialisation manquant ou invalide');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validation en temps réel
    if (name === 'confirmPassword') {
      if (value !== formData.newPassword) {
        setError('Les mots de passe ne correspondent pas');
      } else {
        setError('');
      }
    }

    if (name === 'newPassword') {
      const isValid = verifierPassword(value);
      if (isValid && formData.confirmPassword && value !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
      }
    }
  };

  const verifierPassword = (password: string) => {
    const aAuMoins8Caracteres = password.length >= 8;
    const aUneMajuscule = /[A-Z]/.test(password);
    const aUneMinuscule = /[a-z]/.test(password);
    const aUnChiffre = /[0-9]/.test(password);
    const aUnSymbole = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

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

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!verifierPassword(formData.newPassword)) {
      return; // L'erreur est déjà définie par verifierPassword
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await ResetPasswordApi(token, formData.newPassword, type);
      
      setIsSuccess(true);
      setMessage(response.message || 'Votre mot de passe a été changé avec succès !');
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push(`/Auth/Connection?type=${type}`);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError('Erreur lors du changement de mot de passe. Le lien a peut-être expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-600 mb-4">
            Saisissez votre nouveau mot de passe ci-dessous
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="sr-only">
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading || isSuccess || !token}
                className={`appearance-none rounded-xl relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-colors bg-white ${
                  error 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Nouveau mot de passe"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading || isSuccess || !token}
                className={`appearance-none rounded-xl relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-colors bg-white ${
                  error 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-2">Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Au moins 8 caractères</li>
                <li>Une majuscule (A-Z)</li>
                <li>Une minuscule (a-z)</li>
                <li>Un chiffre (0-9)</li>
                <li>Un symbole (!@#$%^&*...)</li>
              </ul>
            </div>
          </div>

          {/* Success/Error Messages */}
          <div className="text-center">
            {isSuccess && message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">{message}</p>
                <p className="text-green-500 text-xs mt-1">Redirection vers la connexion dans 3 secondes...</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || isSuccess || !token}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changement en cours...
                </>
              ) : isSuccess ? (
                'Mot de passe changé ✓'
              ) : !token ? (
                'Lien invalide'
              ) : (
                'Changer le mot de passe'
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push(`/Auth/Connection?type=${type}`)}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              ← Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
