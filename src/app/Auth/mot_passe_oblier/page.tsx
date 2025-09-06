'use client';
import EnvoyerEmail from "./envoyer_email";
import { Suspense } from "react";

export default function MotPasseOublierPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <EnvoyerEmail />
        </Suspense>
    );
}
