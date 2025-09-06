'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAvailableCoverings, assignTaxiToCovering } from '../../Api/AuthApi/CoveringApi'

interface AvailableCovering {
  _id: string
  createdAt?: string
  status?: string
  details?: {
    modele_voiture?: 'berline' | 'suv' | 'utilitaire' | 'break' | 'monospace'
    type_covering: 'partiel' | 'total' | 'toit' | 'lateral' | 'arriere'
    image?: string
    nombre_taxi?: number
    nombre_jour?: number
    prix?: number
  }
  assigned_taxis?: any[]
}

const TYPES_COVERING = {
  partiel: { label: 'Covering Partiel', icon: '🚖' },
  total: { label: 'Covering Total', icon: '🚕' },
  toit: { label: 'Toit uniquement', icon: '🔝' },
  lateral: { label: 'Latéral', icon: '↔️' },
  arriere: { label: 'Arrière', icon: '🔙' }
}

const TYPES_VOITURE = {
  berline: { label: 'Berline', icon: '🚗' },
  suv: { label: 'SUV', icon: '🚙' },
  utilitaire: { label: 'Utilitaire', icon: '🚐' },
  break: { label: 'Break', icon: '🚗' },
  monospace: { label: 'Monospace', icon: '🚌' }
}

export default function CoveringTaxiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [coverings, setCoverings] = useState<AvailableCovering[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadAvailable()
  }, [])

  const loadAvailable = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAvailableCoverings()
      console.log(data);
      
      setCoverings(data.data || data || [])
    } catch (e) {
      console.error(e)
      setError("Impossible de charger les campagnes disponibles.")
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (campaignId: string) => {
    try {
      setAssigningId(campaignId)
      await assignTaxiToCovering(campaignId)
      alert('Votre taxi a été assigné à la campagne avec succès !')
      await loadAvailable()
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'assignation à la campagne.")
    } finally {
      setAssigningId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des campagnes disponibles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 mt-16">
      <header className="mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-gray-800">🚖 Campagnes Covering disponibles</h1>
                <p className="text-gray-600 mt-2">Choisissez une campagne et assignez votre taxi</p>
              </div>
              <button
                onClick={loadAvailable}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Rafraîchir
              </button>
            </div>
            {error && (
              <p className="text-red-600 mt-3">{error}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {coverings.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="text-6xl mb-4">🗓️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucune campagne disponible</h2>
            <p className="text-gray-600 mb-6">Revenez plus tard pour voir de nouvelles campagnes.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coverings.map((covering) => (
              <div
                key={covering._id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {covering.details?.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={covering.details.image}
                      alt="Visuel de la campagne"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TYPES_COVERING[covering.details?.type_covering || 'partiel']?.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{TYPES_COVERING[covering.details?.type_covering || 'partiel']?.label}</p>
                        <p className="text-sm text-gray-600">Type de covering</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TYPES_VOITURE[(covering.details?.modele_voiture || 'berline') as keyof typeof TYPES_VOITURE]?.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{TYPES_VOITURE[(covering.details?.modele_voiture || 'berline') as keyof typeof TYPES_VOITURE]?.label}</p>
                        <p className="text-sm text-gray-600">Type de véhicule</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{covering.details?.nombre_jour ?? '-'}</p>
                        <p className="text-xs text-gray-600">jour(s)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{covering.details?.nombre_taxi ?? '-'}</p>
                        <p className="text-xs text-gray-600">taxi(s) demandés</p>
                      </div>
                    </div>

                    {typeof covering.details?.prix === 'number' && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">{covering.details.prix}€</p>
                          <p className="text-xs text-gray-600">Prix total estimé</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleAssign(covering._id)}
                        disabled={assigningId === covering._id}
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {assigningId === covering._id ? 'Assignation en cours…' : "S'assigner à cette campagne"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
