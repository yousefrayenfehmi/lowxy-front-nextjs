'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyTours } from '../../Api/AuthApi/ToursApi'

interface Jour {
  date: string
  depart: string
  capacite: { adultes: number; enfants: number }
  prix: { adulte: number; enfant: number }
  supplements: string[]
}

interface TourItem {
  _id: string
  nom: string
  description: string
  ville: string
  duree: number
  itineraire: { depart: string; arrivee: string; plan?: string }
  images: string[]
  commission?: number
  jours: Jour[]
  createdAt?: string
  updatedAt?: string
}

export default function MesToursPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tours, setTours] = useState<TourItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyTours()
      console.log(data)
      const list = Array.isArray((data as any)?.tours)
        ? (data as any).tours
        : Array.isArray((data as any)?.data?.tours)
          ? (data as any).data.tours
          : Array.isArray(data)
            ? (data as any)
            : []
      setTours(list)
    } catch (e) {
      console.error(e)
      setError('Impossible de charger vos tours.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos tours...</p>
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
                <h1 className="text-3xl font-black text-gray-800">🧭 Mes Tours</h1>
                <p className="text-gray-600 mt-2">Liste de tous vos tours créés</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push('/Tours/ajouter')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">+ Nouveau tour</button>
                <button onClick={loadTours} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Rafraîchir</button>
              </div>
            </div>
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {tours.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="text-6xl mb-4">🗓️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun tour pour l'instant</h2>
            <p className="text-gray-600 mb-6">Créez votre premier tour pour commencer.</p>
            <button onClick={() => router.push('/Tours/ajouter')} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">Créer un tour</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour._id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                {tour.images?.[0] && (
                  <div className="h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tour.images[0]} alt={tour.nom} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{tour.nom}</h3>
                      <p className="text-sm text-gray-600">{tour.ville} • {tour.duree} jour(s)</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{tour.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-gray-700">Départ</p>
                      <p className="font-semibold text-gray-900">{tour.itineraire.depart}</p>
                    </div>
                    <div>
                      <p className="text-gray-700">Arrivée</p>
                      <p className="font-semibold text-gray-900">{tour.itineraire.arrivee}</p>
                    </div>
                  </div>

                  {tour.createdAt && (
                    <div className="pt-3 border-t border-gray-200 text-xs text-gray-600">
                      Créé le {new Date(tour.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
