'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cancelReservation, createReservationCheckoutSession, getMyReservations } from '../../Api/AuthApi/ToursApi'
import { loadStripe } from '@stripe/stripe-js'

interface ReservationItem {
  _id: string
  tour_id: string
  jour_id?: string
  nom_tour?: string
  date?: string
  participants?: { adultes: number; enfants: number }
  adultes?: number
  enfants?: number
  prix_total?: number
  statut?: 'en attente de paiement' | 'confirmée' | 'annulée'
  payment_id?: string
  payment_date?: string
  createdAt?: string
  tour_info?: any
  jour_info?: any
}

export default function MesReservationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<ReservationItem[]>([])
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyReservations()
        console.log(data);
        
        const list = Array.isArray((data as any)?.reservations)
          ? (data as any).reservations
          : Array.isArray((data as any)?.data?.reservations)
            ? (data as any).data.reservations
            : Array.isArray(data)
              ? (data as any)
              : []
        setReservations(list)
        console.log(list);
        
      } catch (e) {
        console.error(e)
        setError('Impossible de charger vos réservations.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // Fonction pour gérer le paiement
  const handlePayment = async (reservationId: string, tourId: string) => {
    try {
      setActionLoading(reservationId)
      
      // Trouver la réservation pour récupérer tour_info et jour_info
      const reservation = reservations.find(r => r._id === reservationId)
      if (!reservation) {
        throw new Error('Réservation non trouvée')
      }

      const paymentData = {
        _id: reservationId,
        tour_info: reservation.tour_info,
        jour_info: reservation.jour_info
      }

      const res = await createReservationCheckoutSession(paymentData)
      console.log('Réponse complète de l\'API:', res)
      
      // Essayer de récupérer l'URL de redirection directe
      const redirectUrl = (res as any)?.url || (res as any)?.checkoutUrl || (res as any)?.data?.url
      console.log('URL de redirection trouvée:', redirectUrl)
      
      if (redirectUrl) {
        console.log('Redirection directe vers:', redirectUrl)
        window.location.href = redirectUrl as string
        return
      }
      
      // Essayer de récupérer le sessionId pour Stripe Checkout
      const sessionId = (res as any)?.id || (res as any)?.data?.id || (res as any)?.sessionId || (res as any)?.data?.sessionId
      console.log('Session ID trouvé:', sessionId)
      
      if (sessionId) {
        console.log('Initialisation de Stripe avec sessionId:', sessionId)
        const stripe = await loadStripe('pk_test_51S3lkdQyRlRGZEmDT6UtTJeA3bhmi6nvTbjLG2tVfYqbm0HArsoQFDcxGxAHg4kLWFUJ16Pqwpnk2kPCPtWNIldL0090bGp5Ko')
        if (!stripe) {
          console.error('Stripe non initialisé')
          alert('Stripe non initialisé. Veuillez réessayer.')
          return
        }
        
        console.log('Redirection vers Stripe Checkout...')
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Erreur Stripe:', error)
          alert(`Erreur de paiement: ${error.message || 'Redirection de paiement échouée.'}`)
        }
      } else {
        console.error('Aucun sessionId ou URL de redirection trouvé dans la réponse')
        alert('Impossible d\'initialiser le paiement. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur lors de la redirection vers le paiement:', error)
      
      let errorMessage = 'Erreur lors de la redirection vers le paiement'
      
      // Gestion spécifique des erreurs d'API
      if ((error as any)?.response?.status === 404) {
        errorMessage = 'Session de paiement non trouvée. Veuillez réessayer.'
      } else if ((error as any)?.response?.status === 400) {
        errorMessage = 'Données de paiement invalides. Veuillez vérifier votre réservation.'
      } else if ((error as any)?.response?.data?.message) {
        errorMessage = (error as any).response.data.message
      } else if ((error as any)?.message) {
        errorMessage = (error as any).message
      }
      
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  // Fonction pour ouvrir le modal de confirmation
  const handleCancelClick = (reservationId: string) => {
    setReservationToCancel(reservationId)
    setShowConfirmModal(true)
  }

  // Fonction pour annuler la réservation après confirmation
  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return
    
    setShowConfirmModal(false)

    try {
      setActionLoading(reservationToCancel)
      setError('')
      
      // Trouver la réservation pour récupérer tourId et jourId
      const reservation = reservations.find(r => r._id === reservationToCancel)
      if (!reservation) {
        throw new Error('Réservation non trouvée')
      }

      const cancelData = {
        reservationId: reservationToCancel,
        tourId: reservation.tour_info.tour_id,
        jourId: reservation.jour_info.jour_id
      }
      console.log(cancelData);

      console.log('Données envoyées pour l\'annulation:', cancelData)
      const res = await cancelReservation(cancelData)
      console.log('Réponse d\'annulation:', res)
      
      // Mettre à jour localement le statut
      setReservations(prev => 
        prev.map(r => 
          r._id === reservationToCancel 
            ? { ...r, statut: 'annulée' as const }
            : r
        )
      )
      
      // Réinitialiser les states
      setReservationToCancel(null)
      
    } catch (error) {
      console.log(error);
      
      console.error('Erreur lors de l\'annulation:', error)
      setError('Erreur lors de l\'annulation de la réservation')
    } finally {
      setActionLoading(null)
    }
  }

  // Fonction pour fermer le modal sans annuler
  const handleCloseModal = () => {
    setShowConfirmModal(false)
    setReservationToCancel(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-700">Chargement de vos réservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-4 mt-16">
      <header className="mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200 shadow-xl ring-1 ring-black/5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">🧾 Mes Réservations</h1>
                <p className="text-neutral-700 mt-2">Suivez vos réservations de tours.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.refresh()} className="px-6 py-3 border border-neutral-300 rounded-xl text-neutral-900 hover:bg-neutral-100 ring-1 ring-black/5">Rafraîchir</button>
              </div>
            </div>
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {reservations.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-black/5 border border-neutral-200 p-12 text-center">
            <div className="text-6xl mb-4">🗓️</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aucune réservation pour l'instant</h2>
            <p className="text-neutral-700 mb-6">Réservez un tour pour commencer.</p>
            <button onClick={() => router.push('/Tours')} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl ring-1 ring-black/5">Parcourir les tours</button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => {
              const nbAdultes = r.participants?.adultes ?? r.adultes ?? 0
              console.log("nbAdultes", r.participants);
              const nbEnfants = r.participants?.enfants ?? r.enfants ?? 0
              const total = r.prix_total ?? 0
              const dateStr = r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—'
              const statutColor = r.statut === 'confirmée' ? 'bg-green-100 text-green-800' : r.statut === 'annulée' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              return (
                <div key={r._id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200 shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{r.nom_tour || 'Tour'}</h3>
                      <p className="text-sm text-neutral-700">Date: <span className="font-medium">{dateStr}</span></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statutColor}`}>{r.statut || '—'}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm mt-4">
                    <div>
                      <p className="text-neutral-700">Participants</p>
                      <p className="font-semibold text-neutral-900">{nbAdultes} adultes • {nbEnfants} enfants</p>
                    </div>
                    <div>
                      <p className="text-neutral-700">Total</p>
                      <p className="font-semibold text-neutral-900">{total.toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-neutral-700">Créée le</p>
                      <p className="font-semibold text-neutral-900">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
                    {r.statut === 'en attente de paiement' && (
                      <>
                        <button 
                          onClick={() => handlePayment(r._id, r.tour_id)}
                          disabled={actionLoading === r._id}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {actionLoading === r._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            '💳 Payer'
                          )}
                        </button>
                        <button 
                          onClick={() => handleCancelClick(r._id)}
                          disabled={actionLoading === r._id}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {actionLoading === r._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            '❌ Annuler'
                          )}
                        </button>
                      </>
                    )}
                    {r.statut === 'confirmée' && (
                      <button 
                        onClick={() => handleCancelClick(r._id)}
                        disabled={actionLoading === r._id}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {actionLoading === r._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          '❌ Annuler la réservation'
                        )}
                      </button>
                    )}
                    {r.statut === 'annulée' && (
                      <div className="text-center text-neutral-500 italic py-2">
                        Réservation annulée
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de confirmation d'annulation */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Confirmer l'annulation
              </h3>
              <p className="text-neutral-700 mb-6">
                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={actionLoading !== null}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {actionLoading !== null ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


