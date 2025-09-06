'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useParams, useRouter } from 'next/navigation'
import { createTourCheckoutSession, getTourById } from '../../../Api/AuthApi/ToursApi'

interface Capacite { adultes: number; enfants: number }
interface PrixParJour { adulte: number; enfant: number }
interface Jour { _id?: string; date: string; depart: string; capacite: Capacite; prix: PrixParJour; supplements: string[] }
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

export default function ReserverTourPage() {
  const router = useRouter()
  const params = useParams<{ tourId: string }>()
  const tourId = params?.tourId
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tour, setTour] = useState<TourDetails | null>(null)
  const [error, setError] = useState('')

  const [date, setDate] = useState('')
  const [selectedJourIndex, setSelectedJourIndex] = useState<number>(0)
  const [adultes, setAdultes] = useState(1)
  const [enfants, setEnfants] = useState(0)

  useEffect(() => {
    const load = async () => {
      if (!tourId) return
      try {
        console.log(tourId)
        setLoading(true)
        setError('')
        const data = await getTourById(tourId as string)
        console.log(data)
        const t = (data as any)?.tour || (data as any)?.data?.tour || data
        setTour(t)
        // Préselectionner le premier jour s'il existe
        if (Array.isArray(t?.jours) && t.jours.length > 0) {
          setSelectedJourIndex(0)
          const firstDate = t.jours[0]?.date ? new Date(t.jours[0].date).toISOString().slice(0,10) : ''
          setDate(firstDate)
        } else {
          setSelectedJourIndex(0)
          setDate('')
        }
      } catch (e) {
        console.error(e)
        setError('Impossible de charger ce tour.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tourId])

  const jourSelectionne = useMemo(() => {
    if (!tour) return undefined
    const jours = tour.jours || []
    return jours[selectedJourIndex]
  }, [tour, selectedJourIndex])

  const prixTotal = useMemo(() => {
    if (!tour) return 0
    // Trouver le jour correspondant à la date choisie si structure par jour
    const prixAdulte = jourSelectionne?.prix?.adulte ?? 0
    const prixEnfant = jourSelectionne?.prix?.enfant ?? 0
    const total = adultes * prixAdulte + enfants * prixEnfant
    return Math.max(0, total)
  }, [tour, date, adultes, enfants, jourSelectionne])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tourId) return
    try {
      setSubmitting(true)
      const payload = {
        tour_id: tour?._id,
        jour_id: jourSelectionne?._id,
        date: jourSelectionne?.date ? new Date(jourSelectionne.date).toISOString() : undefined,
        adultes,
        enfants,
        nom_tour: tour?.nom
      }
      const res = await createTourCheckoutSession(tourId as string, payload)
      console.log(res)
      const redirectUrl = (res as any)?.url || (res as any)?.checkoutUrl || (res as any)?.data?.url
      console.log(redirectUrl)

      if (redirectUrl) {
        window.location.href = redirectUrl as string
        return
      }

      const sessionId = (res as any)?.id || (res as any)?.data?.id
      if (sessionId) {
        
        const stripe = await loadStripe('pk_test_51S3OND3Y6eRVzgj578y5XjzRml1c0UkC1wj7lBWiSQzSyBR7xaGaGLwSPCr368ISueMPnuqLHNdsTXBNta9P2WnV00Q1IbZOwx')
        if (!stripe) {
          alert('Stripe non initialisé. Veuillez réessayer.')
          return
        }
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error(error)
          alert('Redirection de paiement échouée.')
        }
        return
      }

      alert('Impossible d\'ouvrir la page de paiement. Veuillez réessayer.')
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la création de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-700">Chargement du tour...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 flex items-center justify-center mt-16">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Tour introuvable</h1>
          <p className="text-slate-700 mb-6">{error || 'Veuillez réessayer plus tard.'}</p>
          <button onClick={() => router.back()} className="px-6 py-3 border border-slate-300 rounded-xl text-slate-800 hover:bg-slate-50">Retour</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200 shadow-xl ring-1 ring-black/5 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl" aria-hidden>📝</div>
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Réserver: {tour.nom}</h1>
                <p className="text-neutral-700">{tour.ville} • départ {tour.itineraire?.depart}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white ring-1 ring-black/5">1. Date</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white ring-1 ring-black/5">2. Participants</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-neutral-900 border border-neutral-200 ring-1 ring-black/5">3. Récapitulatif</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 shadow-xl ring-1 ring-black/5">
              <form id="reservation-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-1">Jour</label>
                    <div className="relative group">
                      <select
                        value={selectedJourIndex}
                        onChange={(e) => {
                          const idx = parseInt(e.target.value, 10)
                          setSelectedJourIndex(idx)
                          const d = tour?.jours?.[idx]?.date
                          setDate(d ? new Date(d).toISOString().slice(0,10) : '')
                        }}
                        className="appearance-none w-full h-12 rounded-xl border border-neutral-300 bg-white/90 px-4 pr-10 text-neutral-900 shadow-sm ring-1 ring-black/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                      >
                        {(tour?.jours || []).map((j, i) => (
                          <option key={i} value={i}>
                            {(j.date ? new Date(j.date).toLocaleDateString('fr-FR') : 'Date -')} • départ {j.depart}
                          </option>
                        ))}
                      </select>
                      <svg
                        aria-hidden
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Adultes</label>
                    <div className="flex items-center gap-2">
                      <button aria-label="Diminuer adultes" type="button" onClick={() => setAdultes(Math.max(0, adultes - 1))} className="h-11 w-11 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-semibold">-</button>
                      <input type="number" min={0} value={adultes} onChange={(e) => setAdultes(parseInt(e.target.value || '0', 10))} className="w-full h-11 rounded-xl border-neutral-300 px-4 text-neutral-900 focus:ring-2 focus:ring-indigo-500" required />
                      <button aria-label="Augmenter adultes" type="button" onClick={() => setAdultes(jourSelectionne?.capacite?.adultes !== undefined ? Math.min(jourSelectionne.capacite.adultes, adultes + 1) : adultes + 1)} className="h-11 w-11 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-semibold">+</button>
                    </div>
                    {jourSelectionne?.capacite?.adultes !== undefined && (
                      <p className="text-xs text-neutral-700 mt-1">Max {jourSelectionne.capacite.adultes} adultes</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Enfants</label>
                    <div className="flex items-center gap-2">
                      <button aria-label="Diminuer enfants" type="button" onClick={() => setEnfants(Math.max(0, enfants - 1))} className="h-11 w-11 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-semibold">-</button>
                      <input type="number" min={0} value={enfants} onChange={(e) => setEnfants(parseInt(e.target.value || '0', 10))} className="w-full h-11 rounded-xl border-neutral-300 px-4 text-neutral-900 focus:ring-2 focus:ring-indigo-500" required />
                      <button aria-label="Augmenter enfants" type="button" onClick={() => setEnfants(jourSelectionne?.capacite?.enfants !== undefined ? Math.min(jourSelectionne.capacite.enfants, enfants + 1) : enfants + 1)} className="h-11 w-11 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-semibold">+</button>
                    </div>
                    {jourSelectionne?.capacite?.enfants !== undefined && (
                      <p className="text-xs text-neutral-700 mt-1">Max {jourSelectionne.capacite.enfants} enfants</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-neutral-300 rounded-xl text-neutral-900 hover:bg-neutral-100 ring-1 ring-black/5">Annuler</button>
                </div>
              </form>
            </div>
          </div>

          <aside>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200 shadow-xl ring-1 ring-black/5 sticky top-24">
              {tour.images?.[0] && (
                <div className="h-40 overflow-hidden rounded-xl border border-neutral-200 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tour.images[0]} alt={tour.nom} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Récapitulatif</h3>
              <div className="text-sm text-neutral-900 space-y-1 mb-3">
                <p>Date: <span className="font-medium">{date || '—'}</span></p>
                <p>Participants: <span className="font-medium">{adultes} adulte(s), {enfants} enfant(s)</span></p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-900">Adultes</span>
                  <span className="text-neutral-900 font-medium">{adultes} × {(jourSelectionne?.prix?.adulte ?? 0).toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-neutral-900">Enfants</span>
                  <span className="text-neutral-900 font-medium">{enfants} × {(jourSelectionne?.prix?.enfant ?? 0).toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-2xl font-extrabold text-neutral-900">{prixTotal.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-neutral-700 mt-2">Statut: « en attente de paiement » jusqu'à confirmation.</p>
              </div>
              <button form="reservation-form" type="submit" disabled={submitting || !jourSelectionne || prixTotal <= 0} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl ring-1 ring-black/5 disabled:opacity-70">
                {submitting ? 'En cours...' : 'Réserver'}
              </button>
              <p className="text-xs text-neutral-600 mt-3 text-center">🔒 Paiement sécurisé par Stripe</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}


