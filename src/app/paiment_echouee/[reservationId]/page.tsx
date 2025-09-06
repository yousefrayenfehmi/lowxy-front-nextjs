'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

interface PaymentFailData {
  reservation_id: string
  tour_id: string
  jour_id: string
  client_id: string
}

export default function PaymentFailedPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentFailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processFailureParams = async () => {
      try {
        const dataParam = searchParams.get('data')
        if (dataParam) {
          const decodedData = JSON.parse(decodeURIComponent(dataParam)) as PaymentFailData
          setPaymentData(decodedData)
        }
      } catch (error) {
        console.error('Erreur lors du traitement des paramètres d\'échec de paiement:', error)
      } finally {
        setLoading(false)
      }
    }

    processFailureParams()
  }, [params.reservationId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-neutral-700">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header d'échec */}
        <div className="text-center mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-red-200 shadow-xl ring-1 ring-red-500/20">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 mb-2">
              Paiement échoué
            </h1>
            <p className="text-lg text-neutral-700">
              Nous n'avons pas pu confirmer votre paiement. Aucun montant ne vous a été débité.
            </p>
          </div>
        </div>

        

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/Reservations/mes')}
            className="px-8 py-4 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-black/5"
          >
            📋 Voir mes réservations
          </button>

          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-black/5"
          >
            🏠 Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}


