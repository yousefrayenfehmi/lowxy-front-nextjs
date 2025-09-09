'use client'

import { useRouter } from 'next/navigation'

export default function CoveringPaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-red-200 shadow-xl ring-1 ring-red-500/20">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 mb-2">
              Paiement Covering échoué
            </h1>
            <p className="text-lg text-neutral-700">
              Nous n'avons pas pu confirmer votre paiement. Aucun montant ne vous a été débité.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/Covering_ads/Personnel/partenaire')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-black/5"
          >
            🔁 Réessayer la création
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


