'use client'
import React, { useState } from "react";

export default function ConnectionForm({type}: {type: 'personnel' | 'chauffeur' | 'partenaire'}) {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {   
    e.preventDefault();
    console.log(type);
    console.log(user);
  };
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    <div className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={user.email}
          onChange={handleChange}
          required
          className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
          placeholder="Entrez votre email"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de Passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
          placeholder="Entrez votre mot de passe"
        />
      </div>
    </div>

    {/* Remember me & Forgot password */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
          Se souvenir de moi
        </label>
      </div>

      <div className="text-sm">
        <a href="#" className="font-medium text-purple-600 hover:text-purple-500 underline">
          Mot de passe oublié ?
        </a>
      </div>
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        Se Connecter
      </button>
    </div>

    {/* Sign up link */}
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Vous n'avez pas de compte ?{' '}
        <a href="#" className="font-medium text-purple-600 hover:text-purple-500 underline">
          Créer un compte
        </a>
      </p>
    </div>
  </form>
  );
}