'use client';
import axios from "axios";

export default async function Taxisignup(data: any) {
    try {
        const response = await axios.post('/api/chauffeur/register', data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}

export async function recupererProfileTaxi() {
    const response = await axios.get('/api/chauffeur-by-token', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenchauffeur')}`
        }
    })
    return response.data
}

export async function modifierProfileTaxi(profileData: any) {
    const response = await axios.post('/api/completerchauffeur', profileData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenchauffeur')}`
        }
    })
    return response.data
}