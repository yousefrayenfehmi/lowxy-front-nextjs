"use client";
import InscriptionPartenair from "@/app/Form/InscriptionPartenair";
import InscriptionPersonnel from "@/app/Form/InscriptionPersonnel";
import InscriptionTaxi from "@/app/Form/InscriptionTaxi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Inscription() {
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [roleType, setRoleType] = useState<'driver' | 'partner'>('driver');
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  useEffect(() => {
    if (type === 'personnel') {
      setAccountType('personal');
    } else if (type === 'chauffeur') {
      setAccountType('business');
      setRoleType('driver');
    } else if (type === 'partenaire') {
      setAccountType('business');
      setRoleType('partner');
    }
  }, [type]);
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        
       

        {/* Account Type Selection */}
        <div className="space-y-4 mt-12">
          <div className="grid grid-cols-2 gap-4">
            {/* Personal Button */}
            <button
              onClick={() => setAccountType('personal')}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                accountType === 'personal'
                  ? 'bg-purple-50 border-purple-500'
                  : 'bg-white border-gray-300 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    accountType === 'personal'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}
                >
                  {accountType === 'personal' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`font-semibold text-lg ${
                    accountType === 'personal' ? 'text-purple-700' : 'text-gray-700'
                  }`}
                >
                  Personal
                </span>
              </div>
            </button>

            {/* Business Button */}
            <button
              onClick={() => setAccountType('business')}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                accountType === 'business'
                  ? 'bg-purple-50 border-purple-500'
                  : 'bg-white border-gray-300 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    accountType === 'business'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}
                >
                  {accountType === 'business' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`font-semibold text-lg ${
                    accountType === 'business' ? 'text-purple-700' : 'text-gray-700'
                  }`}
                >
                  Business
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Affichage conditionnel selon le type de compte */}
        {accountType === 'business' && (
          <div className="grid grid-cols-2 gap-4 mt-6">
                         {/* Driver Button */}
             <button
               onClick={() => setRoleType('driver')}
               className={`relative p-3 rounded-lg border transition-all duration-200 ${
                 roleType === 'driver'
                   ? 'bg-gray-50 border-gray-500'
                   : 'bg-white border-gray-300 hover:border-gray-400'
               }`}
             >
              <span
                className={`font-semibold text-lg ${
                  roleType === 'driver' ? 'text-gray-700' : 'text-gray-500'
                }`}
              >
                Driver
              </span>
            </button>

                         {/* Partner Button */}
             <button
               onClick={() => setRoleType('partner')}
               className={`relative p-3 rounded-lg border transition-all duration-200 ${
                 roleType === 'partner'
                   ? 'bg-purple-600 border-purple-600'
                   : 'bg-white border-gray-300 hover:border-purple-400'
               }`}
             >
              <span
                className={`font-semibold text-lg ${
                  roleType === 'partner' ? 'text-white' : 'text-gray-500'
                }`}
              >
                Partner
              </span>
            </button>
          </div>
        )}

        {/* Affichage des formulaires selon la sélection */}
        {accountType === 'personal' && <InscriptionPersonnel />}
        {accountType === 'business' && roleType === 'driver' && <InscriptionTaxi />}
        {accountType === 'business' && roleType === 'partner' && <InscriptionPartenair />}
      </div>
    </main>
  );
}