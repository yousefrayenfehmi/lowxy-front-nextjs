'use client';
import axios from "axios";

export  async function PartnerApi(data: any) {
    try {
        console.log(data);
        
        const response = await axios.post('/api/partenaire/register', data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription partenaire:', error);
        throw error;
    }
}

export async function modifierProfilePartenaire(profileData: any) {
    const response = await axios.post('/api/completerpartenaire', profileData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenpartenaire')}`
        }
    })
    return response.data
}   
export async function recupererProfilePartenaire() {
    const response = await axios.get('/api/partenaire-by-token', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenpartenaire')}`
        }
    })
    return response.data
}