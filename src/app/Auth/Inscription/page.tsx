"use client";
import React from "react";
import Inscription from "./Inscription";
import { Suspense } from "react";

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <Inscription />
    </Suspense>
  );
}