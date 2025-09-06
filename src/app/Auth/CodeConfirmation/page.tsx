'use client'
import CodeConfirmation from "./CodeConfirmation";
import { Suspense } from "react";

export default function CodeConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <CodeConfirmation />
        </Suspense>
    )
}