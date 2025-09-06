'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserCoverings } from '../../../Api/AuthApi/CoveringApi'

interface CoveringAd {
  _id: string
  createdAt: string
  status: string
  creator: {
    type: string
    id: string
  }
  details: {
    modele_voiture: 'berline' | 'suv' | 'utilitaire' | 'break' | 'monospace'
    type_covering: 'partiel' | 'total' | 'toit' | 'lateral' | 'arriere'
    image: string
    nombre_taxi: number
    nombre_jour: number
    prix?: number
  }
  assigned_taxis: any[]
}

const TYPES_COVERING = {
  'partiel': { label: 'Covering Partiel', icon: '🚖' },
  'total': { label: 'Covering Total', icon: '🚕' },
  'toit': { label: 'Toit uniquement', icon: '🔝' },
  'lateral': { label: 'Latéral', icon: '↔️' },
  'arriere': { label: 'Arrière', icon: '🔙' }
}

const TYPES_VOITURE = {
  'berline': { label: 'Berline', icon: '🚗' },
  'suv': { label: 'SUV', icon: '🚙' },
  'utilitaire': { label: 'Utilitaire', icon: '🚐' },
  'break': { label: 'Break', icon: '🚗' },
  'monospace': { label: 'Monospace', icon: '🚌' }
}

const STATUS_COLORS: { [key: string]: string } = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Active': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-red-100 text-red-800'
}

export default function MesCoverings() {
  const router = useRouter()
  const [coverings, setCoverings] = useState<CoveringAd[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadCoverings()
  }, [])

  const loadCoverings = async () => {
    try {
      setLoading(true)
      const data = await getUserCoverings()
      setCoverings(data.data)
      console.log(data)
    } catch (error) {
      console.error('Erreur lors du chargement des coverings:', error)
    } finally {
      setLoading(false)
    }
  }

  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos coverings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 mt-16">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-gray-800">
                  🚖 Mes Coverings
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez vos campagnes publicitaires pour taxis
                </p>
              </div>
              <button
                onClick={() => router.push('/Covering_ads/Personnel/partenaire')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ➕ Nouveau Covering
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {coverings.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="text-6xl mb-4">🚖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun covering trouvé</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore créé de covering publicitaire</p>
            <button
              onClick={() => router.push('/Covering_ads/Personnel/partenaire/AjouterCovering')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Créer mon premier covering
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                         {coverings.map((covering) => (
               <div
                 key={covering._id}
                 className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 {/* Image du covering */}
                 {covering.details.image && (
                   <div className="h-48 overflow-hidden">
                     <img
                       src={covering.details.image}
                       alt="Photo du covering"
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none'
                       }}
                     />
                   </div>
                 )}

                 <div className="p-6">
                   {/* Status badge */}
                   <div className="flex justify-between items-start mb-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[covering.status] || STATUS_COLORS.Pending}`}>
                       {covering.status === 'Pending' && '⏳ En attente'}
                       {covering.status === 'Active' && '✅ Actif'}
                       {covering.status === 'Completed' && '⏹️ Terminé'}
                       {covering.status === 'Cancelled' && '❌ Annulé'}
                     </span>
                     <div className="flex space-x-2">
                       <button
                         disabled={deleting === covering._id}
                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                       >
                         {deleting === covering._id ? '⏳' : '🗑️'}
                       </button>
                     </div>
                   </div>

                   {/* Informations principales */}
                   <div className="space-y-3">
                     <div className="flex items-center gap-3">
                       <span className="text-2xl">{TYPES_COVERING[covering.details.type_covering]?.icon}</span>
                       <div>
                         <p className="font-semibold text-gray-800">{TYPES_COVERING[covering.details.type_covering]?.label}</p>
                         <p className="text-sm text-gray-600">Type de covering</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-3">
                       <span className="text-2xl">{TYPES_VOITURE[covering.details.modele_voiture]?.icon}</span>
                       <div>
                         <p className="font-semibold text-gray-800">{TYPES_VOITURE[covering.details.modele_voiture]?.label}</p>
                         <p className="text-sm text-gray-600">Type de véhicule</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                       <div className="text-center">
                         <p className="text-2xl font-bold text-purple-600">{covering.details.nombre_jour}</p>
                         <p className="text-xs text-gray-600">jour(s)</p>
                       </div>
                       <div className="text-center">
                         <p className="text-2xl font-bold text-indigo-600">{covering.details.nombre_taxi}</p>
                         <p className="text-xs text-gray-600">taxi(s)</p>
                       </div>
                     </div>

                     {covering.details.prix && (
                       <div className="pt-4 border-t border-gray-200">
                         <div className="text-center">
                           <p className="text-xl font-bold text-green-600">{covering.details.prix}€</p>
                           <p className="text-xs text-gray-600">Prix total</p>
                         </div>
                       </div>
                     )}

                     <div className="pt-4 border-t border-gray-200">
                       <p className="text-xs text-gray-500">
                         Créé le {formatDate(covering.createdAt)}
                       </p>
                       <p className="text-xs text-gray-500 mt-1">
                         Taxis assignés: {covering.assigned_taxis.length}
                       </p>
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
