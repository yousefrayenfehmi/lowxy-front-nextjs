'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { createCoveringAd } from '@/app/Api/AuthApi/CoveringApi'

export default function CoveringPaymentSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedCampaign, setSavedCampaign] = useState<any>(null)


  useEffect(() => {
    const run = async () => {
      try {
        const dataParam = searchParams.get('data')
        let payloadData: any = null
        if (dataParam) {
          try {
            payloadData = JSON.parse(decodeURIComponent(dataParam))
          } catch {}
        }
        
        // Sauvegarder automatiquement la campagne avec les données reçues
        if (payloadData) {
          setSaving(true)
          try {
            console.log('payloadData', payloadData)
            const saved = await createCoveringAd(payloadData)
            setSavedCampaign(saved)
          } catch (e: any) {
            setError(e?.message || 'Erreur lors de la sauvegarde du covering')
          } finally {
            setSaving(false)
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Erreur lors de la confirmation du paiement')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params, searchParams])

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
        <div className="text-center mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-green-200 shadow-xl ring-1 ring-green-500/20">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
              Paiement Covering Réussi !
            </h1>
            <p className="text-lg text-neutral-700">
              Votre paiement a été confirmé. Votre campagne sera enregistrée si ce n'est pas déjà fait.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/Covering_ads/Personnel/partenaire/mes-coverings')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-green-500/20"
          >
            📋 Voir mes coverages
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


