'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCoveringAd } from '../../../Api/AuthApi/CoveringApi'

interface CoveringAd {
  type_covering: 'partiel' | 'total' | 'toit' | 'lateral' | 'arriere'
  type_voiture: 'berline' | 'suv' | 'utilitaire' | 'break' | 'monospace'
  nombre_jours: number
  nombre_taxi: number
  lien_photo: string
  prix: number
}

const TYPES_COVERING = [
  { value: 'partiel', label: 'Covering Partiel', icon: '🚖', description: 'Covering sur une partie du véhicule' },
  { value: 'total', label: 'Covering Total', icon: '🚕', description: 'Covering complet du véhicule' },
  { value: 'toit', label: 'Toit uniquement', icon: '🔝', description: 'Covering sur le toit du véhicule' },
  { value: 'lateral', label: 'Latéral', icon: '↔️', description: 'Covering sur les côtés du véhicule' },
  { value: 'arriere', label: 'Arrière', icon: '🔙', description: 'Covering sur l\'arrière du véhicule' }
]

const TYPES_VOITURE = [
  { value: 'berline', label: 'Berline', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'utilitaire', label: 'Utilitaire', icon: '🚐' },
  { value: 'break', label: 'Break', icon: '🚗' },
  { value: 'monospace', label: 'Monospace', icon: '🚌' }
]



export default function AjouterCovering() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CoveringAd>({
    type_covering: 'partiel',
    type_voiture: 'berline',
    nombre_jours: 30,
    nombre_taxi: 1,
    lien_photo: '',
    prix: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Covering ads créé:', formData)
     const response = await createCoveringAd(formData)
     console.log(response)
      alert('Covering ads créé avec succès !')
      router.push('/Covering_ads/Personnel/partenaire/mes-coverings')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      alert('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 mt-16">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-800">
                🚖 Créer un Covering Ads
              </h1>
              <p className="text-gray-600 mt-2">
                Configurez votre campagne publicitaire pour taxis
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Configuration du Covering
              </h2>
              <p className="text-gray-600 mt-1">Remplissez tous les champs requis</p>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Type de covering */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Type de covering *
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TYPES_COVERING.map(type => (
                    <div
                      key={type.value}
                      onClick={() => setFormData({...formData, type_covering: type.value as any})}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.type_covering === type.value
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-gray-300 hover:border-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="font-semibold text-gray-800 mb-1">{type.label}</div>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type de voiture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Type de voiture *
                </label>
                <div className="flex flex-wrap gap-3">
                  {TYPES_VOITURE.map(voiture => (
                    <button
                      key={voiture.value}
                      type="button"
                      onClick={() => setFormData({...formData, type_voiture: voiture.value as any})}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                        formData.type_voiture === voiture.value
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{voiture.icon}</span>
                      <span>{voiture.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre de jours et nombre de taxis */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de jours *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="365"
                      value={formData.nombre_jours}
                      onChange={(e) => setFormData({...formData, nombre_jours: parseInt(e.target.value)})}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800 font-semibold"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 text-sm">📅</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Entre 1 et 365 jours</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de taxis *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={formData.nombre_taxi}
                      onChange={(e) => setFormData({...formData, nombre_taxi: parseInt(e.target.value)})}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800 font-semibold"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 text-sm">🚖</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Entre 1 et 100 taxis</p>
                </div>
              </div>

              {/* Lien de photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Lien de la photo *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://exemple.com/photo.jpg"
                    value={formData.lien_photo}
                    onChange={(e) => setFormData({...formData, lien_photo: e.target.value})}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800 font-semibold"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-500 text-sm">📸</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">URL de l'image à afficher sur le covering</p>
              </div>



              {/* Récapitulatif */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Récapitulatif
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type covering:</span>
                      <span className="font-semibold">{TYPES_COVERING.find(t => t.value === formData.type_covering)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type véhicule:</span>
                      <span className="font-semibold">{TYPES_VOITURE.find(v => v.value === formData.type_voiture)?.label}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de jours:</span>
                      <span className="font-semibold">{formData.nombre_jours} jour(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de taxis:</span>
                      <span className="font-semibold">{formData.nombre_taxi} taxi(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lien photo:</span>
                      <span className="font-semibold text-xs break-all">{formData.lien_photo || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bouton de soumission */}
            <div className="p-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dashoffset" dur="1s" values="32;0" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    Créer le Covering Ads
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}