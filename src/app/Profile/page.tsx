'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonnelProfile from "./PersonnelProfile";
import PartenaireProfile from "./PartenaireProfile";
import TaxiProfile from "./TaxiProfile";

export default function ProfilePage() {
    const router = useRouter();
    const [userType, setUserType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Récupérer le type d'utilisateur depuis localStorage
        const type = localStorage.getItem('type');
        setUserType(type);
        setIsLoading(false);

        // Rediriger vers la connexion si pas connecté
        if (!type) {
            router.push('/Auth/Connection');
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    // Router vers le bon composant selon le type d'utilisateur
    switch (userType) {
        case 'personnel':
            return <PersonnelProfile />;
        case 'partenaire':
            return <PartenaireProfile />;
        case 'chauffeur':
            return <TaxiProfile />;
        default:
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Type d'utilisateur non reconnu</h1>
                        <button
                            onClick={() => router.push('/Auth/Connection')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Se reconnecter
                        </button>
                    </div>
                </div>
            );
    }
}
