"use client";
import React from "react";
import { useRouter } from 'next/navigation'

const steps = [
  { 
    label: "Quizz", 
    title: "Quizz géolocaliser",
    subtitle: "Gagne ta course en répondant à temps",
    color: "bg-gradient-to-b from-pink-400 to-pink-500",
    href: '/quizz',
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="8" width="24" height="20" rx="4" fill="#fff" stroke="#ec4899" strokeWidth="2"/>
      <circle cx="18" cy="15" r="3" fill="#ec4899"/>
      <rect x="16" y="20" width="4" height="6" rx="2" fill="#ec4899"/>
      <rect x="26" y="6" width="6" height="2" rx="1" fill="#fbbf24"/>
    </svg>
  },
  { 
    label: "Blog de ville", 
    title: "Blog de la ville",
    subtitle: "Découvre les dessous de ta ville",
    color: "bg-gradient-to-b from-blue-400 to-blue-500",
    href: '/blog',
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="8" y="6" width="20" height="24" rx="3" fill="#fff" stroke="#3b82f6" strokeWidth="2"/>
      <rect x="11" y="10" width="14" height="2" rx="1" fill="#3b82f6"/>
      <rect x="11" y="14" width="10" height="1.5" rx="0.75" fill="#60a5fa"/>
      <rect x="11" y="17" width="12" height="1.5" rx="0.75" fill="#60a5fa"/>
      <rect x="11" y="20" width="8" height="1.5" rx="0.75" fill="#93c5fd"/>
      <rect x="11" y="23" width="6" height="1.5" rx="0.75" fill="#93c5fd"/>
      <rect x="4" y="8" width="8" height="8" rx="2" fill="#10b981"/>
      <polygon points="8,10 10,12 8,14" fill="#fff"/>
    </svg>
  },
  { 
    label: "Billetteries", 
    title: "Billetteries & Tours",
    subtitle: "Meilleur attractions au meilleur prix",
    color: "bg-gradient-to-b from-green-400 to-green-500",
    href: '/Tours',
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="12" width="24" height="12" rx="3" fill="#fff" stroke="#22c55e" strokeWidth="2"/>
      <rect x="9" y="15" width="18" height="6" rx="2" fill="#dcfce7"/>
      <rect x="12" y="17" width="12" height="2" rx="1" fill="#22c55e"/>
      <circle cx="18" cy="18" r="1.5" fill="#16a34a"/>
      <rect x="3" y="16" width="3" height="4" rx="1.5" fill="#22c55e"/>
      <rect x="30" y="16" width="3" height="4" rx="1.5" fill="#22c55e"/>
      <rect x="14" y="10" width="8" height="2" rx="1" fill="#fbbf24"/>
    </svg>
  },
  { 
    label: "Guide AI", 
    title: "La guide touristique",
    subtitle: "Prépare tes trajet avec ce guide IA",
    color: "bg-gradient-to-b from-yellow-400 to-yellow-500",
    href: '/docs',
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="10" y="8" width="16" height="20" rx="8" fill="#fff" stroke="#eab308" strokeWidth="2"/>
      <rect x="12" y="12" width="12" height="8" rx="4" fill="#fef3c7"/>
      <circle cx="15" cy="16" r="1.5" fill="#eab308"/>
      <circle cx="21" cy="16" r="1.5" fill="#eab308"/>
      <rect x="16" y="20" width="4" height="1" rx="0.5" fill="#eab308"/>
      <rect x="14" y="24" width="8" height="2" rx="1" fill="#ca8a04"/>
      <circle cx="10" cy="8" r="3" fill="#10b981"/>
      <circle cx="26" cy="8" r="3" fill="#10b981"/>
      <rect x="6" y="14" width="6" height="8" rx="3" fill="#3b82f6"/>
      <rect x="24" y="14" width="6" height="8" rx="3" fill="#3b82f6"/>
    </svg>
  },
  { 
    label: "Covering Ads", 
    title: "La plus grande des petites annonces",
    subtitle: "A votre tour d'afficher",
    color: "bg-gradient-to-b from-purple-400 to-purple-500",
    href: '/Covering_ads/Personnel/partenaire',
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="10" width="18" height="16" rx="3" fill="#fff" stroke="#a855f7" strokeWidth="2"/>
      <rect x="9" y="13" width="12" height="10" rx="2" fill="#f3e8ff"/>
      <rect x="11" y="16" width="8" height="2" rx="1" fill="#a855f7"/>
      <rect x="11" y="19" width="6" height="1.5" rx="0.75" fill="#c084fc"/>
      <circle cx="26" cy="18" r="6" fill="#a855f7"/>
      <polygon points="24,16 28,18 24,20" fill="#fff"/>
      <circle cx="29" cy="15" r="1.5" fill="#fbbf24"/>
      <circle cx="29" cy="21" r="1.5" fill="#fbbf24"/>
      <circle cx="32" cy="18" r="1.5" fill="#fbbf24"/>
    </svg>
  },
];

// URLs SVG/PNG libres de droits pour les drapeaux européens
const flagImages = [
  { src: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg", style: { top: "10%", left: "15%", width: 48 } },
  { src: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg", style: { top: "30%", left: "70%", width: 44 } },
  { src: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg", style: { top: "60%", left: "20%", width: 44 } },
  { src: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg", style: { top: "15%", left: "40%", width: 44 } },
  { src: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg", style: { top: "40%", left: "60%", width: 44 } },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg", style: { top: "70%", left: "10%", width: 40 } },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg", style: { top: "80%", left: "50%", width: 40 } },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg", style: { top: "25%", left: "80%", width: 36 } },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg", style: { top: "55%", left: "75%", width: 38 } },
  { src: "https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg", style: { top: "65%", left: "35%", width: 36 } },
];



export default function Accueil() {
  const router = useRouter()
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-16">
      {/* Drapeaux européens en SVG/PNG colorés */}
      {flagImages.map((item, idx) => (
        <img
          key={idx}
          src={item.src}
          alt="drapeau européen"
          style={{
            position: "absolute",
            opacity: 0.75,
            pointerEvents: "none",
            zIndex: 0,
            filter: "drop-shadow(0 6px 16px rgba(167, 139, 250, 0.8)) drop-shadow(0 0 25px rgba(251, 191, 36, 0.6)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3)) brightness(1.1) contrast(1.15)",
            transform: "scale(1.1)",
            ...item.style,
          }}
        />
      ))}
      {/* Emojis de monuments historiques */}
      
      {/* Boutons au centre vertical de la page */}
      <div className="relative z-10 flex flex-col gap-10 items-center justify-center min-h-screen py-12">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Bouton avec texte seulement */}
            <button
              className={`w-80 h-28 rounded-2xl flex items-center justify-center ${step.color} transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm`}
              style={{ 
                boxShadow: '0 8px 0 0 rgba(0,0,0,0.15), 0 12px 24px 0 rgba(0,0,0,0.12), inset 0 1px 0 0 rgba(255,255,255,0.3)',
                border: '3px solid rgba(255,255,255,0.4)',
                background: `linear-gradient(135deg, ${step.color.includes('pink') ? 'rgba(244,114,182,0.9), rgba(236,72,153,0.95)' : step.color.includes('blue') ? 'rgba(96,165,250,0.9), rgba(59,130,246,0.95)' : step.color.includes('green') ? 'rgba(74,222,128,0.9), rgba(34,197,94,0.95)' : step.color.includes('yellow') ? 'rgba(251,191,36,0.9), rgba(245,158,11,0.95)' : 'rgba(167,139,250,0.9), rgba(139,92,246,0.95)'})`,
                paddingLeft: '5px',
                paddingRight: '5px'
              }}
              onClick={() => step.href && router.push(step.href)}
            >
              {/* Texte centré avec espacement exact */}
              <div className="flex flex-col items-center justify-center text-center w-full">
               <h3 className="text-white font-bold text-lg mb-2 tracking-wide drop-shadow-lg leading-tight break-words mt-4">
                  {step.title.toUpperCase()}
                </h3>
                <h4 className="text-white/90 text-sm font-medium leading-tight break-words mt-1">
                  {step.subtitle.toUpperCase()}
                </h4>
              </div>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}