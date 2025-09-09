'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveTours } from '../../Api/AuthApi/ToursApi'
import { useMessage } from '@/app/contexts/MessageContext'

interface Jour {
  date: string
  depart: string
  capacite: { adultes: number; enfants: number }
  prix: { adulte: number; enfant: number }
  supplements: string[]
}

interface TourForm {
  nom: string
  description: string
  ville: string
  duree: number
  itineraire: { depart: string; arrivee: string; plan: string }
  images: string[]
  commission: number
  jours: Jour[]
}

export default function AjouterTourPage() {
  const router = useRouter()
  const { showMessage } = useMessage()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<TourForm>({
    nom: '',
    description: '',
    ville: '',
    duree: 1,
    itineraire: { depart: '', arrivee: '', plan: '' },
    images: [''],
    commission: 20,
    jours: [
      {
        date: '',
        depart: '',
        capacite: { adultes: 0, enfants: 0 },
        prix: { adulte: 0, enfant: 0 },
        supplements: []
      }
    ]
  })
  const [collapsed, setCollapsed] = useState<boolean[]>([false])

  useEffect(() => {
    setCollapsed(prev => {
      const copy = [...prev]
      while (copy.length < form.jours.length) copy.push(false)
      while (copy.length > form.jours.length) copy.pop()
      return copy
    })
  }, [form.jours.length])

  const updateImage = (idx: number, value: string) => {
    const images = [...form.images]
    images[idx] = value
    setForm({ ...form, images })
  }

  const addImage = () => setForm({ ...form, images: [...form.images, ''] })
  const removeImage = (idx: number) => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })

  const addJour = () => {
    setForm({
      ...form,
      jours: [
        ...form.jours,
        { date: '', depart: '', capacite: { adultes: 0, enfants: 0 }, prix: { adulte: 0, enfant: 0 }, supplements: [] }
      ]
    })
    setCollapsed(prev => [...prev, false])
  }

  const removeJour = (idx: number) => {
    setForm({ ...form, jours: form.jours.filter((_, i) => i !== idx) })
    setCollapsed(prev => prev.filter((_, i) => i !== idx))
  }

  const updateJour = (idx: number, patch: Partial<Jour>) => {
    const jours = [...form.jours]
    jours[idx] = { ...jours[idx], ...patch }
    setForm({ ...form, jours })
  }

  const toggleJour = (idx: number) => {
    setCollapsed(prev => prev.map((c, i) => (i === idx ? !c : c)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveTours(form)
      showMessage('Tour créé avec succès', 'success')
      router.push('/Tours')
    } catch (e) {
      console.error(e)
      showMessage('Erreur lors de la création du tour', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sectionTitle = (emoji: string, title: string, subtitle?: string) => (
    <div className="flex items-start gap-3 mb-4">
      <div className="text-2xl" aria-hidden>{emoji}</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  )

  const Step = ({ label, active }: { label: string; active?: boolean }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200'}`}>{label}</div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <h1 className="text-2xl font-black text-gray-900">Créer un Tour</h1>
          <div className="flex flex-wrap gap-2">
            <Step label="Général" active />
            <Step label="Itinéraire" />
            <Step label="Images" />
            <Step label="Jours" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            {sectionTitle('🧾', 'Informations générales', "Renseignez les informations de base")}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du tour</label>
                <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="Ex: Tour de la Médina" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                <p className="text-xs text-gray-500 mt-1">Un nom clair et accrocheur.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="Ex: Marrakech" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600 text-gray-900" rows={3} placeholder="Décrivez l'expérience proposée" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
            </div>
          </section>

          <section>
            {sectionTitle('🗺️', 'Itinéraire', "Points de départ et d'arrivée")}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="Lieu de départ" value={form.itineraire.depart} onChange={e => setForm({ ...form, itineraire: { ...form.itineraire, depart: e.target.value } })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="Lieu d'arrivée" value={form.itineraire.arrivee} onChange={e => setForm({ ...form, itineraire: { ...form.itineraire, arrivee: e.target.value } })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien du plan (URL)</label>
                <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="https://..." value={form.itineraire.plan} onChange={e => setForm({ ...form, itineraire: { ...form.itineraire, plan: e.target.value } })} />
              </div>
            </div>
          </section>

          <section>
            {sectionTitle('🖼️', 'Images', "Ajoutez une ou plusieurs images")}
            <div className="space-y-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="grid md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-9">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image #{idx + 1}</label>
                    <input className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="URL de l'image" value={img} onChange={e => updateImage(idx, e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">Collez l'URL d'une image publique (JPEG/PNG).</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="w-full h-[72px] rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="aperçu" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <span className="text-gray-400 text-xs">Aperçu</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex md:justify-end">
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(idx)} className="px-3 py-2 rounded-lg bg-red-100 text-red-700 w-full md:w-auto">Supprimer</button>
                    )}
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={addImage} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium">+ Ajouter une image</button>
              </div>
            </div>
          </section>

          <section>
            {sectionTitle('📅', 'Jours', "Planifiez les départs, capacités et tarifs")}
            <div className="space-y-4">
              {form.jours.map((j, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <button type="button" onClick={() => toggleJour(idx)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-xl">🗓️</span>
                      <div>
                        <p className="font-semibold text-gray-800">Jour {idx + 1}</p>
                        <p className="text-xs text-gray-600">{j.date || 'Date non définie'} • {j.depart || 'Heure ?'}</p>
                      </div>
                    </div>
                    <span className="text-gray-500">{collapsed[idx] ? '▼' : '▲'}</span>
                  </button>

                  {(!collapsed[idx]) && (
                    <div className="p-4 space-y-4">
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input type="date" placeholder="YYYY-MM-DD" className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.date} onChange={e => updateJour(idx, { date: e.target.value })} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Heure de départ</label>
                          <input type="time" placeholder="HH:mm" className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.depart} onChange={e => updateJour(idx, { depart: e.target.value })} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suppléments</label>
                          <input className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" placeholder="Audio-guide FR, Transfert hôtel" value={j.supplements.join(', ')} onChange={e => updateJour(idx, { supplements: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                          <p className="text-xs text-gray-500 mt-1">Séparez par des virgules.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Capacité</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Adultes</label>
                              <input type="number" min={0} placeholder="0" className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.capacite.adultes} onChange={e => updateJour(idx, { capacite: { ...j.capacite, adultes: Number(e.target.value) } })} required />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Enfants</label>
                              <input type="number" min={0} placeholder="0" className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.capacite.enfants} onChange={e => updateJour(idx, { capacite: { ...j.capacite, enfants: Number(e.target.value) } })} required />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-3">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Tarifs</p>
                          <div className="grid grid-cols-2 gap-3 items-end">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Prix adulte (€)</label>
                              <div className="relative">
                                <input type="number" min={0} placeholder="0" className="border rounded-xl px-3 py-2 w-full pr-8 focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.prix.adulte} onChange={e => updateJour(idx, { prix: { ...j.prix, adulte: Number(e.target.value) } })} required />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Prix enfant (€)</label>
                              <div className="relative">
                                <input type="number" min={0} placeholder="0" className="border rounded-xl px-3 py-2 w-full pr-8 focus:ring-2 focus:ring-indigo-500 placeholder-gray-600" value={j.prix.enfant} onChange={e => updateJour(idx, { prix: { ...j.prix, enfant: Number(e.target.value) } })} required />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {form.jours.length > 1 && (
                        <div className="pt-2">
                          <button type="button" onClick={() => removeJour(idx)} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100">Supprimer ce jour</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <button type="button" onClick={addJour} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium">+ Ajouter un jour</button>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50">
              {loading ? 'Création en cours…' : 'Créer le Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

