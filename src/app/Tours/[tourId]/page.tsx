'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getTourById } from '../../Api/AuthApi/ToursApi'

interface Capacite { adultes: number; enfants: number }
interface PrixParJour { adulte: number; enfant: number }
interface Jour { date: string; depart: string; capacite: Capacite; prix: PrixParJour; supplements: string[] }
interface TourDetails {
  _id: string
  nom: string
  description: string
  ville: string
  duree: number
  itineraire: { depart: string; arrivee: string; plan?: string }
  images: string[]
  commission?: number
  jours: Jour[]
}

export default function DetailsTourPage() {
  const router = useRouter()
  const params = useParams<{ tourId: string }>()
  const tourId = params?.tourId
  const [loading, setLoading] = useState(true)
  const [tour, setTour] = useState<TourDetails | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!tourId) return
      try {
        setLoading(true)
        setError('')
        const data = await getTourById(tourId as string)
        const t = (data as any)?.tour || (data as any)?.data?.tour || data
        setTour(t)
      } catch (e) {
        console.error(e)
        setError('Impossible de charger ce tour.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tourId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tour...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center mt-16">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Tour introuvable</h1>
          <p className="text-gray-600 mb-6">{error || 'Veuillez réessayer plus tard.'}</p>
          <button onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Retour</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          <div className="flex items-start gap-3 mb-6">
            <div className="text-2xl" aria-hidden>🧭</div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">{tour.nom}</h1>
              <p className="text-gray-600">{tour.ville} • {tour.duree} jour(s)</p>
            </div>
          </div>

          {tour.images?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {tour.images.slice(0, 4).map((src, idx) => (
                <div key={idx} className="h-48 overflow-hidden rounded-xl border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`image-${idx}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              ))}
            </div>
          ) : null}

          <section className="space-y-2 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Description</h2>
            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
          </section>

          <section className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-gray-700">Départ</p>
              <p className="font-semibold text-gray-900">{tour.itineraire?.depart}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-gray-700">Arrivée</p>
              <p className="font-semibold text-gray-900">{tour.itineraire?.arrivee}</p>
            </div>
            {tour.itineraire?.plan && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-700">Plan</p>
                <p className="font-semibold text-gray-900 truncate">{tour.itineraire.plan}</p>
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Jours & Tarifs</h2>
            <div className="space-y-3">
              {tour.jours?.map((j, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{j.date ? new Date(j.date).toLocaleDateString('fr-FR') : 'Date -'}</p>
                    <p className="text-gray-800">Départ: <span className="font-semibold">{j.depart}</span></p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700">Capacité</p>
                      <p className="font-semibold text-gray-900">{j.capacite?.adultes ?? 0} adultes • {j.capacite?.enfants ?? 0} enfants</p>
                    </div>
                    <div>
                      <p className="text-gray-700">Prix</p>
                      <p className="font-semibold text-gray-900">{j.prix?.adulte ?? 0}€ adulte • {j.prix?.enfant ?? 0}€ enfant</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex gap-3">
            <button onClick={() => router.push(`/Tours/reserver/${tour._id}`)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">Commander</button>
            <button onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Retour</button>
          </div>
        </div>
      </div>
    </div>
  )
}


