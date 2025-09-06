'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getBlogByVille } from '../Api/AuthApi/AdminApi'

export default function Blog() {
  const router = useRouter()
  const [restau, setRestau] = useState<any[]>([])
  const [hotel, setHotel] = useState<any[]>([])
  const [concert, setConcert] = useState<any[]>([])
  const [spectacle, setSpectacle] = useState<any[]>([])
  
  useEffect(() => {
        const getLocation = async () => {
            const position = await navigator.geolocation.getCurrentPosition(
                async (position) => {
                    console.log(position.coords.latitude)
                    console.log(position.coords.longitude)
                    // api pour recuperer ville d'apres langitude et latitude
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522&zoom=18&addressdetails=1`)
                    const data = await response.json()
                    
                    // api pour recuperer les donnees de la ville hotel  resteau 
                    const response2 = await getBlogByVille(data.address.city_district)
                    console.log(response2.villeArticle)
                    response2.villeArticle.forEach((item: any) => {
                      console.log(item.categorie)
                        if(item.categorie === 'restaurants'){
                          console.log('d5al');
                          
                            setRestau(prev => [...prev, item])
                            console.log(restau)
                        }
                        if(item.categorie === 'hotel'){
                            setHotel(prev => [...prev, item.data])
                        }
                        if(item.categorie === 'concert'){
                            setConcert(item.data)
                        }
                    })
                   
                },
                (error) => {
                    console.log(error)
                }
            )
            console.log(position)
        }
        getLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      {/* Header du Blog */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-cyan-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-300 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">✨ Guide Exclusif 2024</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-center mb-6 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Découvrez Paris
            </h1>
            <p className="text-xl md:text-2xl text-center opacity-90 max-w-2xl mx-auto font-light">
              Votre guide ultime pour explorer la Ville Lumière avec style
            </p>
            <div className="flex justify-center pt-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="relative z-10">Commencer l'exploration</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-12 py-4">
            <li><a href="#restaurants" className="group relative text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
              <span>🍽️ Restaurants</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a></li>
            <li><a href="#hotels" className="group relative text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
              <span>🏨 Hôtels</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a></li>

            <li><a href="#concerts" className="group relative text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
              <span>🎵 Concerts</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a></li>
            <li><a href="#spectacles" className="group relative text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
              <span>🎭 Spectacles</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        {/* Section Restaurants */}
        <section id="restaurants" className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
              <span className="text-orange-600 font-medium text-sm">GASTRONOMIE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">Restaurants Parisiens</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Découvrez les saveurs authentiques de Paris, des bistrots traditionnels aux tables étoilées</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {restau.map((item: any, index: number) => (
               <div key={index} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
                 <div className="relative overflow-hidden">
                   <img src={item.url_image} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>
                 <div className="p-8">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="text-xl font-bold text-gray-800">{item.nom_lieu}</h3>
                     {item.rating > 0 && <div className="flex text-yellow-400">
                       {Array.from({ length: item.rating }).map((_, etoileIndex: number) => (
                         <span key={etoileIndex}>⭐</span>
                       ))}
                     </div>}
                   </div>
                   <p className="text-gray-600 mb-4 leading-relaxed">{item.texte_alternatif}</p>
                   <div className="flex items-center justify-between">
                     <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-medium">✨ {item.rating || 0} étoiles Michelin</span>
                     <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Voir plus →</button>  
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </section>

        {/* Section Hôtels */}
        <section id="hotels" className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
              <span className="text-purple-600 font-medium text-sm">HÉBERGEMENT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">Hôtels de Prestige</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Séjournez dans les plus beaux établissements de la capitale, du luxe parisien authentique</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
                             <div className="relative overflow-hidden">
                 <img src={hotel[0]?.image || "https://t4.ftcdn.net/jpg/04/11/46/41/360_F_411464133_Wea3HZvf5ViQ98cYfFYmYpcqs3WCNUPj.jpg"} alt="Le Ritz Paris" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-purple-600">PALACE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Le Ritz Paris</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Palace mythique Place Vendôme, symbole du luxe parisien</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">👑 5 étoiles</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Réserver →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://www.ahotellife.com/wp-content/uploads/2018/04/breakfast.jpg" alt="Hotel des Grands Boulevards" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-indigo-600">BOUTIQUE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Hôtel des Grands Boulevards</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Hôtel boutique élégant dans le 2ème arrondissement</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-sm font-medium">🎨 Boutique</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Réserver →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://i0.wp.com/mercedesconstantine.com/wp-content/uploads/2022/04/Duplex-Terrace-Eiffel-view-Suite-Bedroom-and-Terrace-n308-1300-x-950.webp?resize=685,500&ssl=1" alt="Shangri-La Paris" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-red-600">PALACE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Shangri-La Paris</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Vue imprenable sur la Tour Eiffel depuis Trocadéro</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-sm font-medium">🏰 Palace</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Réserver →</button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Section Concerts */}
        <section id="concerts" className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
              <span className="text-blue-600 font-medium text-sm">MUSIQUE LIVE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">Scène Musicale</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Vibrez au son des plus grandes salles de concert parisiennes, du jazz au rock</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://media.gettyimages.com/id/967090918/photo/fa%C3%A7ade-de-lolympia-concert-du-groupe-eagles-of-death-metal-le-16-f%C3%A9vrier-2016-paris-france.jpg?s=612x612&w=0&k=20&c=ngdGAcaS-dC1pCYnt7fKLMIJa4LgH-JHY9ogW8Ikjzk=" alt="L'Olympia" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-red-600">LÉGENDAIRE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">L'Olympia</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Salle de concert mythique, passage obligé des artistes</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full text-sm font-medium">🎤 Légendaire</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Billets →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://media-cdn.tripadvisor.com/media/photo-o/11/01/89/aa/le-zenith.jpg" alt="Le Zenith" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-blue-600">GRANDE SALLE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Le Zénith</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Grande salle pour les concerts de variété et rock</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">🏟️ Grande Salle</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Billets →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://paris-promeneurs.com/wp-content/uploads/2018/02/new-morning-500.jpg" alt="Le New Morning" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-green-600">JAZZ</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Le New Morning</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Temple du jazz parisien depuis 1981</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium">🎷 Jazz</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Billets →</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Spectacles */}
        <section id="spectacles" className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full mb-4">
              <span className="text-red-600 font-medium text-sm">ARTS VIVANTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">Arts du Spectacle</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Plongez dans l'univers magique du théâtre, de l'opéra et des cabarets parisiens</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://cdn.pixabay.com/photo/2021/09/02/22/04/palais-garnier-6594597_640.jpg" alt="Opéra de Paris" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-purple-600">OPÉRA</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Opéra de Paris</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Institution prestigieuse avec Palais Garnier et Opéra Bastille</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-sm font-medium">🎭 Opéra</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Réserver →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://c8.alamy.com/comp/DK3NTH/moulin-rouge-paris-the-moulin-rouge-at-dusk-lit-up-in-neon-DK3NTH.jpg" alt="Moulin Rouge" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-red-600">CABARET</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Moulin Rouge</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Cabaret légendaire de Montmartre, symbole du French Cancan</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-sm font-medium">💃 Cabaret</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Spectacle →</button>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative overflow-hidden">
                <img src="https://media.istockphoto.com/id/1132809547/fr/photo/fa%C3%A7ade-de-la-com%C3%A9die-francaise-%C3%A0-paris.jpg?s=612x612&w=0&k=20&c=CiQrNd7-k7HFpgBQNItkzD72ZdJ57HAeCi28wJRQz7M=" alt="Comédie Française" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-indigo-600">THÉÂTRE</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Comédie-Française</h3>
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">Plus ancienne troupe théâtrale de France, fondée en 1680</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-sm font-medium">🎬 Théâtre</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Pièces →</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-16 mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400 rounded-full blur-2xl"></div>
          <div className="absolute top-10 right-20 w-24 h-24 bg-cyan-400 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Découvrez Paris</h3>
              <p className="text-gray-300 max-w-lg mx-auto">Votre guide ultime pour explorer la Ville Lumière avec élégance et authenticité</p>
            </div>
            
            <div className="flex justify-center space-x-6">
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                <span className="text-xl group-hover:scale-110 transition-transform">📷</span>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
              </a>
            </div>
            
            <div className="border-t border-white/20 pt-8">
              <p className="text-gray-400 text-sm">© 2024 Découvrez Paris - Fait avec ❤️ à Paris</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}