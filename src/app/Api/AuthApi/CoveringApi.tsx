'use client'

import axios from 'axios'
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const createCoveringAd = async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${apiUrl}/save`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Stripe - créer une session de paiement pour une campagne de covering
export const createCoveringCheckoutSession = async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${apiUrl}/create`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Stripe - confirmer le paiement (si un flux de confirmation est nécessaire)
export const confirmCoveringPayment = async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${apiUrl}/campaigns/confirm-payment`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

export const getUserCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiUrl}/creator-campaigns`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Campagnes disponibles pour les chauffeurs
export const getAvailableCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiUrl}/available`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Assigner le taxi connecté à une campagne
export const assignTaxiToCovering = async (coveringId: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${apiUrl}/join/${coveringId}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Campagnes déjà assignées au taxi connecté
export const getAssignedCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiUrl}/my-campaigns`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}


