'use client';
import ChangerMotPasse from "../changer_mot_passe";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <ChangerMotPasse />
        </Suspense>
    );
}
