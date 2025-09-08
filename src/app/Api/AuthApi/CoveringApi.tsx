'use client'

import axios from 'axios'


export const createCoveringAd = async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await axios.post('/api/save', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

export const getUserCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/creator-campaigns', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Campagnes disponibles pour les chauffeurs
export const getAvailableCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/available', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Assigner le taxi connecté à une campagne
export const assignTaxiToCovering = async (coveringId: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`/api/join/${coveringId}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// Campagnes déjà assignées au taxi connecté
export const getAssignedCoverings = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/my-campaigns', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}


