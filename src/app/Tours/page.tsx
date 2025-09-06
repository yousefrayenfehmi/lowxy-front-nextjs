'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllTours } from '../Api/AuthApi/ToursApi'

interface Jour {
  date: string
  depart: string
  capacite: { adultes: number; enfants: number }
  prix: { adulte: number; enfant: number }
  supplements: string[]
}

interface TourItem {
  tourId: string
  nom: string
  description: string
  ville: string
  duree: number
  itineraire: { depart: string; arrivee: string; plan?: string }
  images: string[]
  commission?: number
  jours: Jour[]
  createdAt?: string
}

export default function ListeToursPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tours, setTours] = useState<TourItem[]>([])
  const [error, setError] = useState('')
  const [ville, setVille] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        setError('')
        // Essayer d'inférer la ville (optionnel)
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`)
          const geo = await resp.json()
          const ville = geo?.address?.city_district || geo?.address?.city || geo?.address?.town || geo?.address?.village
          console.log(geo)
          console.log('Ville détectée:', ville)
          setVille(ville)
        } catch (_) {
          // géolocalisation non disponible/autorisé: on continue quand même
        }
        const toursData = await getAllTours("paris")
        console.log("toursData", toursData)
        console.log("toursData", toursData)
        const list = Array.isArray((toursData as any)?.tours)
          ? (toursData as any).tours
          : Array.isArray((toursData as any)?.data?.tours)
            ? (toursData as any).data.tours
            : Array.isArray(toursData)
              ? (toursData as any)
              : []
        setTours(list)
      } catch (e) {
        console.error(e)
        setError('Impossible de charger les tours.')
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des tours...</p>
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
                <h1 className="text-3xl font-black text-gray-800">🌍 Tous les Tours</h1>
                <p className="text-gray-600 mt-2">Parcourez et commandez votre prochain tour.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.refresh()} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Rafraîchir</button>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun tour disponible</h2>
            <p className="text-gray-600">Revenez plus tard ou contactez le support.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour.tourId} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300">
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

                  <div className="pt-3 border-t border-gray-200 flex gap-2">
                    <button onClick={() => router.push(`/Tours/reserver/${tour.tourId
}`)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">Commander</button>
                    <button onClick={() => router.push(`/Tours/${tour.tourId}`)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Détails</button>
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


