'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ajouterBlog, deletBlog, getBlog, updateBlog } from '@/app/Api/AuthApi/AdminApi'

interface BlogPlace {
  _id?: string
  nom_lieu: string
  categorie: 'all' | 'restaurants' | 'hotels' | 'concerts' | 'spectacles'
  description: string
  url_image: string
  texte_alternatif: string
  rating: number
  adresse: string
  ville: string
  pays: string
  
}


const CATEGORIES = [
  { value: 'restaurants', label: 'Restaurants', icon: '🍽️', color: 'orange' },
  { value: 'hotels', label: 'Hôtels', icon: '🏨', color: 'purple' },
  { value: 'concerts', label: 'Concerts', icon: '🎵', color: 'blue' },
  { value: 'spectacles', label: 'Spectacles', icon: '🎭', color: 'red' }
]

const PRICE_RANGES = ['€', '€€', '€€€', '€€€€']

export default function AdminBlog() {
  const [places, setPlaces] = useState<BlogPlace[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState<BlogPlace | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [placeToDelete, setPlaceToDelete] = useState<string | null>(null)

  // État du formulaire
  const [formData, setFormData] = useState<BlogPlace>({
    nom_lieu: '',
    categorie: 'restaurants',
    description: '',
    url_image: '',    
    texte_alternatif: '',
    rating: 3,
    adresse: '',
    ville: '',
    pays: ''
  })

  // Charger les lieux
  useEffect(() => {
    loadPlaces()
  }, [])

  const loadPlaces = async () => {
    setLoading(true)
    try {
          const response = await getBlog()
          console.log(response.villeArticle)
          // Vérifier que la réponse contient un tableau
          if (response.villeArticle && Array.isArray(response.villeArticle)) {
            setPlaces(response.villeArticle)
          } else {
            console.error('La réponse API ne contient pas un tableau de lieux')
            setPlaces([]) // Initialiser avec un tableau vide
          }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setPlaces([]) // En cas d'erreur, initialiser avec un tableau vide
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingPlace) {
        const response = await updateBlog(editingPlace._id as string, formData)
        console.log('Lieu modifié:', response)
      } else {
        const response = await ajouterBlog(formData)
        console.log('Lieu sauvegardé:', response)
      }
      console.log('Lieu sauvegardé:', formData)
      
      // Réinitialiser le formulaire
      resetForm()
      setIsFormOpen(false)
      loadPlaces()
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nom_lieu: '',
      categorie: 'all',
      description: '',
      url_image: '',
      texte_alternatif: '',
      rating: 3,
      adresse: '',
      ville: '',
      pays: ''
    })
    setEditingPlace(null)
  }

  const handleEdit = async (place: BlogPlace) => {
    
    setFormData(place)
    setEditingPlace(place)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setPlaceToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!placeToDelete) return
    
    setLoading(true)
    try {
      const response = await deletBlog(placeToDelete, {})
      console.log('Lieu supprimé:', placeToDelete)
      loadPlaces()
      setShowDeleteModal(false)
      setPlaceToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPlaceToDelete(null)
  }

  const filteredPlaces = activeCategory === 'all' 
    ? places 
    : places.filter(place => place.categorie === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 mt-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-800">
                Administration Blog Voyage
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez le contenu de votre guide touristique mondial
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✨ Ajouter un lieu
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtres par catégorie */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              Tous ({places.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.value
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label} ({places.filter(p => p.categorie === cat.value).length})
              </button>
            ))}
          </div>
        </div>

        {/* Liste des lieux */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <div
              key={place._id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={place.url_image}
                  alt={place.texte_alternatif}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-bold text-gray-600">
                    {CATEGORIES.find(c => c.value === place.categorie)?.icon}
                  </span>
                </div>
                
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {place.nom_lieu}
                  </h3>
                  <div className="flex text-yellow-400">
                    {'⭐'.repeat(place.rating)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {place.categorie}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    📍 {place.ville}, {place.pays}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(place)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => place._id && handleDelete(place._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPlaces.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏙️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun lieu trouvé
              </h3>
              <p className="text-gray-500">
                Ajoutez votre premier lieu pour commencer
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Formulaire */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPlace ? 'Modifier le lieu' : 'Ajouter un nouveau lieu'}
                </h2>
                <button
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du lieu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom_lieu}
                    onChange={(e) => setFormData({...formData, nom_lieu: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                    placeholder="Ex: Le Jules Verne"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                      value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                  placeholder="Description courte et attrayante..."
                />
              </div>

              {/* Image */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url_image}
                    onChange={(e) => setFormData({
                      ...formData, 
                      url_image: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Texte alternatif *
                  </label>
                  <input
                    type="text"
                    required
                        value={formData.texte_alternatif}
                    onChange={(e) => setFormData({
                      ...formData, 
                      texte_alternatif: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                    placeholder="Description de l'image"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note (étoiles) *
                </label>
                <select
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>
                      {'⭐'.repeat(n)} ({n})
                    </option>
                  ))}
                </select>
              </div>

              {/* Localisation */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ville}
                    onChange={(e) => setFormData({
                      ...formData, 
                      ville: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                    placeholder="Ex: Paris, Londres, Tokyo..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pays *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pays}
                    onChange={(e) => setFormData({
                      ...formData, 
                      pays: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                    placeholder="Ex: France, Royaume-Uni, Japon..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({
                    ...formData, 
                    adresse: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-purple-800"
                  placeholder="15 Place Vendôme, 5th Avenue..."
                />
              </div>



              {/* Boutons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sauvegarde...' : (editingPlace ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-3xl">⚠️</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Attention !
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous absolument sûr de vouloir supprimer ce lieu ?
                <br/><br/>
                <span className="text-red-600 font-semibold">
                  ❌ Cette action est irréversible
                </span>
                <br/>
                Le lieu sera définitivement supprimé de la base de données.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
