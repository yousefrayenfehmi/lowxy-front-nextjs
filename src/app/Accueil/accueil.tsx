"use client";
import React, { useRef } from "react";
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Data for the "Path"
const units = [
  {
    id: 1,
    title: "Découverte",
    description: "Commence ton aventure",
    color: "bg-pink-500", // Header color (Quizz theme)
    nodes: [
      {
        id: 'quizz',
        href: '/quizz',
        label: 'Quizz',
        status: 'current',
        color: 'bg-pink-500',
        borderColor: 'border-pink-600',
        textColor: 'text-pink-500'
      },
      {
        id: 'blog',
        href: '/blog',
        label: 'Blog',
        status: 'current',
        color: 'bg-blue-500',
        borderColor: 'border-blue-600',
        textColor: 'text-blue-500'
      },
      {
        id: 'chest1',
        href: '#',
        label: 'Récompense',
        status: 'locked',
        color: 'bg-yellow-500',
        borderColor: 'border-yellow-600',
        textColor: 'text-yellow-500'
      },
    ]
  },
  {
    id: 2,
    title: "Services",
    description: "Profite de la ville",
    color: "bg-green-500", // Header color (Tickets theme)
    nodes: [
      {
        id: 'tours',
        href: '/Tours',
        label: 'Billetteries',
        status: 'current',
        color: 'bg-green-500',
        borderColor: 'border-green-600',
        textColor: 'text-green-500',
        bubbleText: "La on met des des phrase pour expliquer Lapp"
      },
      {
        id: 'guide',
        href: '/docs',
        label: 'Guide AI',
        status: 'current',
        color: 'bg-yellow-500',
        borderColor: 'border-yellow-600',
        textColor: 'text-yellow-500',
        bubbleText: "Pour que le regarde reste et et scroll toute en bas"
      },
    ]
  },
  {
    id: 3,
    title: "Partenaires",
    description: "Les bons plans",
    color: "bg-purple-500", // Header color (Ads theme)
    nodes: [
      {
        id: 'ads',
        href: '/Covering_ads/Personnel/partenaire',
        label: 'Annonces',
        status: 'current',
        color: 'bg-purple-500',
        borderColor: 'border-purple-600',
        textColor: 'text-purple-500'
      },
      {
        id: 'chest2',
        href: '#',
        label: 'Bonus',
        status: 'locked',
        color: 'bg-orange-500',
        borderColor: 'border-orange-600',
        textColor: 'text-orange-500'
      },
    ]
  }
];

// Icons components
const Icons = {
  Book: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  // Keep SVGs for flags we didn't generate 3D versions for, or as fallbacks
  FlagUk: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 32 24" className="shadow-sm" {...props}>
      <rect width="32" height="24" fill="#00247d" />
      <path d="M0,0 L32,24 M32,0 L0,24" stroke="#fff" strokeWidth="4" />
      <path d="M0,0 L32,24 M32,0 L0,24" stroke="#cf142b" strokeWidth="2" />
      <path d="M16,0 V24 M0,12 H32" stroke="#fff" strokeWidth="6" />
      <path d="M16,0 V24 M0,12 H32" stroke="#cf142b" strokeWidth="3" />
    </svg>
  ),
  FlagIt: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 32 24" className="shadow-sm" {...props}>
      <rect width="32" height="24" fill="#CE2B37" />
      <rect width="21.3" height="24" fill="#fff" />
      <rect width="10.6" height="24" fill="#009246" />
    </svg>
  ),
  FlagJp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 32 24" className="shadow-sm" {...props}>
      <rect width="32" height="24" fill="#fff" />
      <circle cx="16" cy="12" r="8" fill="#BC002D" />
    </svg>
  )
};

export default function Accueil() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const main = mainRef.current;
    if (!main) return;

    // Spin the path nodes on scroll
    gsap.utils.toArray<HTMLElement>('.path-node-button').forEach((btn) => {
      gsap.to(btn, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: main, // Use main container as trigger reference
          scroller: main, // Important: tell ScrollTrigger we are scrolling inside 'main'
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });
    });

    // Parallax/Rotate decorations
    gsap.utils.toArray<HTMLElement>('.decoration-item').forEach((item, i) => {
      const speed = (i + 1) * 0.5;
      gsap.to(item, {
        y: -50 * speed,
        rotation: i % 2 === 0 ? 45 : -45,
        ease: 'none',
        scrollTrigger: {
          trigger: main,
          scroller: main,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });
    });

  }, { scope: mainRef });

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Flag placeholder */}
          <div className="w-8 h-6 rounded overflow-hidden border border-gray-200 relative hover:scale-110 transition-transform cursor-pointer">
            <img src="https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg" className="w-full h-full object-cover" alt="Langue" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/Auth/Connection')}
            className="px-4 py-2 font-bold text-blue-500 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm"
          >
            Connexion
          </button>
          <button
            onClick={() => router.push('/Auth/Inscription')}
            className="px-4 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-600 rounded-xl hover:bg-blue-400 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-sm"
          >
            Inscription
          </button>
        </div>
      </header>

      {/* Main Content - The Path */}
      <main
        ref={mainRef}
        className="flex-1 flex flex-col items-center py-8 px-4 overflow-y-auto relative"
      >
        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="w-full max-w-md mb-8 relative">

            {/* Decorative Elements (3D Monuments/Flags) */}
            {unitIndex === 0 && (
              <>
                <div className="decoration-item absolute -left-20 top-10 opacity-90 pointer-events-none z-0">
                  <img src="/assets/eiffel_tower_3d.png" alt="Eiffel Tower" className="w-24 h-24 object-contain drop-shadow-xl" />
                </div>
                <div className="decoration-item absolute -right-12 top-0 opacity-90 pointer-events-none z-0">
                  <img src="/assets/france_flag_3d.png" alt="France Flag" className="w-16 h-16 object-contain drop-shadow-lg" />
                </div>
                <div className="decoration-item absolute left-10 -bottom-16 opacity-90 pointer-events-none z-0">
                  <img src="/assets/usa_flag_3d.png" alt="USA Flag" className="w-16 h-16 object-contain drop-shadow-lg" />
                </div>
              </>
            )}
            {unitIndex === 1 && (
              <>
                <div className="decoration-item absolute -right-20 top-32 opacity-90 pointer-events-none z-0">
                  <img src="/assets/colosseum_3d.png" alt="Colosseum" className="w-24 h-24 object-contain drop-shadow-xl" />
                </div>
                <div className="decoration-item absolute -left-12 top-24 opacity-80 pointer-events-none z-0">
                  <Icons.FlagIt width={48} height={36} className="drop-shadow-md" />
                </div>
                <div className="decoration-item absolute right-16 -top-10 opacity-90 pointer-events-none z-0">
                  <img src="/assets/big_ben_3d.png" alt="Big Ben" className="w-20 h-20 object-contain drop-shadow-xl" />
                </div>
              </>
            )}
            {unitIndex === 2 && (
              <>
                <div className="decoration-item absolute -left-16 top-0 opacity-90 pointer-events-none z-0">
                  <img src="/assets/torii_gate_3d.png" alt="Torii Gate" className="w-24 h-24 object-contain drop-shadow-xl" />
                </div>
                <div className="decoration-item absolute -right-10 top-16 opacity-80 pointer-events-none z-0">
                  <Icons.FlagJp width={48} height={36} className="drop-shadow-md" />
                </div>
                <div className="decoration-item absolute left-16 bottom-0 opacity-80 pointer-events-none z-0">
                  <Icons.FlagUk width={48} height={36} className="drop-shadow-md" />
                </div>
              </>
            )}

            {/* Unit Header */}
            <div className={`${unit.color} rounded-2xl p-4 mb-8 flex justify-between items-center shadow-lg transform transition-transform hover:scale-[1.02] z-10 relative`}>
              <div className="text-white">
                <h2 className="font-bold text-xl tracking-wide">{unit.title}</h2>
                <p className="text-sm opacity-90 font-medium">{unit.description}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <Icons.Book />
              </div>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center gap-6 relative z-10">
              {unit.nodes.map((node, idx) => {
                // Calculate zigzag offset
                const offset = idx % 2 === 0 ? 'translate-x-0' : (idx % 4 === 1 ? '-translate-x-12' : 'translate-x-12');

                const isLocked = node.status === 'locked';
                const bgColor = isLocked ? 'bg-gray-200' : node.color; // Use node specific color
                const borderColor = isLocked ? 'border-gray-300' : node.borderColor; // Use node specific border

                return (
                  <div key={node.id} className={`relative ${offset} group`}>
                    {/* Decorative dots */}
                    {!isLocked && (
                      <>
                        <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
                        <div className="absolute top-0 -right-6 w-2 h-2 bg-green-400 rounded-full opacity-60 delay-100"></div>
                        <div className="absolute -bottom-2 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60 delay-300"></div>
                      </>
                    )}

                    <button
                      onClick={() => !isLocked && router.push(node.href)}
                      disabled={isLocked}
                      className={`
                        path-node-button
                        w-16 h-16 rounded-full flex items-center justify-center 
                        ${bgColor} ${borderColor} border-b-[6px] active:border-b-0 active:translate-y-[6px]
                        transition-all duration-150 z-10 relative
                        ${isLocked ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer shadow-xl hover:brightness-110'}
                      `}
                    >
                      {/* Inner white bar */}
                      <div className="w-6 h-3 bg-white/20 rounded-full"></div>

                      {!isLocked && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </button>

                    {/* Descriptive Bubble (Permanent if bubbleText exists) */}
                    {/* @ts-ignore */}
                    {node.bubbleText && (
                      <div className="absolute top-1/2 left-20 -translate-y-1/2 bg-white border-2 border-gray-200 px-4 py-3 rounded-2xl shadow-md w-48 z-20">
                        {/* @ts-ignore */}
                        <p className="text-gray-700 text-sm font-medium leading-tight">{node.bubbleText}</p>
                        {/* Triangle pointer */}
                        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 rotate-45"></div>
                      </div>
                    )}

                    {/* Hover Label (Only if no bubbleText, to avoid clutter) */}
                    {/* @ts-ignore */}
                    {!isLocked && !node.bubbleText && (
                      <div className="absolute top-2 left-20 bg-white border-2 border-gray-200 px-3 py-2 rounded-xl shadow-sm whitespace-nowrap z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <span className={`font-bold text-sm ${node.textColor}`}>{node.label}</span>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-gray-200 rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}