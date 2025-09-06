'use client'
import React from "react";
import Connection from "./Connection";
import { Suspense } from "react";

export default function ConnectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <Connection />
    </Suspense>
  );
}