'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { confirmPayment } from '@/app/Api/AuthApi/ToursApi'

interface PaymentSuccessData {
  reservation_id: string
  tour_id: string
  jour_id: string
  client_id: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null)
  const [confirmationData, setConfirmationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processPaymentConfirmation = async () => {
      try {
        const dataParam = searchParams.get('data')
        const typeParam = searchParams.get('type')
        const paymentIdParam = searchParams.get('payment_intent') || searchParams.get('session_id')
        const reservationId = params.reservationId as string

        let decodedData: PaymentSuccessData | null = null

        if (dataParam) {
          decodedData = JSON.parse(decodeURIComponent(dataParam)) as PaymentSuccessData
          setPaymentData(decodedData)
        }

        console.log('Paramètres de paiement:', {
          reservationId,
          type: typeParam,
          paymentId: paymentIdParam,
          data: decodedData
        })

        // Préparer les données pour la confirmation de paiement
        const confirmationData = {
          reservation_id: reservationId,
          tour_id: decodedData?.tour_id || '',
          jour_id: decodedData?.jour_id || '',
          client_id: decodedData?.client_id || '',
          payment_id: paymentIdParam || ''
        }

        console.log('Données envoyées pour confirmation:', confirmationData)

        // Appeler l'API pour confirmer le paiement
        const res = await confirmPayment(confirmationData)
        console.log('Réponse de confirmation:', res)
        
        // Stocker les données de confirmation pour l'affichage
        setConfirmationData(res)

      } catch (error) {
        console.error('Erreur lors du traitement de la confirmation de paiement:', error)
      } finally {
        setLoading(false)
      }
    }

    processPaymentConfirmation()
  }, [params.reservationId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-neutral-700">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-green-200 shadow-xl ring-1 ring-green-500/20">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
              Paiement Réussi !
            </h1>
            <p className="text-lg text-neutral-700">
              Votre réservation a été confirmée avec succès
            </p>
          </div>
        </div>

        {/* Détails de la réservation */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200 shadow-xl ring-1 ring-black/5 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
            📋 Détails de votre réservation
          </h2>
          
          {confirmationData?.reservation ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">Date de réservation</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(confirmationData.reservation.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Participants</p>
                  <p className="font-semibold text-neutral-900">
                    {confirmationData.reservation.participants.adultes} adulte(s) • {confirmationData.reservation.participants.enfants} enfant(s)
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">Date de paiement</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(confirmationData.reservation.payment_date).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Prix total</p>
                  <p className="font-bold text-green-600 text-lg">
                    {confirmationData.reservation.prix_total} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Statut</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Confirmée
                  </span>
                </div>
              </div>
            </div>
          ) : paymentData ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">ID de réservation</p>
                  <p className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded border">
                    {paymentData.reservation_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">ID du tour</p>
                  <p className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded border">
                    {paymentData.tour_id}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">ID du jour</p>
                  <p className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded border">
                    {paymentData.jour_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">ID client</p>
                  <p className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded border">
                    {paymentData.client_id}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-600">Chargement des informations de réservation...</p>
          )}
        </div>


        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/Reservations/mes')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl ring-1 ring-black/5"
          >
            📋 Voir mes réservations
          </button>
          
          <button
            onClick={() => router.push('/Tours')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl ring-1 ring-black/5"
          >
            🎯 Découvrir d'autres tours
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-black/5"
          >
            🏠 Retour à l'accueil
          </button>
        </div>

        {/* Message de remerciement */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2">Merci pour votre confiance ! 🙏</h3>
            <p className="text-green-100">
              Nous avons hâte de vous faire vivre une expérience inoubliable lors de votre tour.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
