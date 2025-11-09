'use client';
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default async function PersonnelApi(data: any) {
    try {
        console.log(data);
        
        const response = await axios.post(`${apiUrl}/touriste/register`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}

export  async function recupererProfile() {
    const response = await axios.get(`${apiUrl}/touriste-by-token`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenpersonnel')}`
        }
    })
    return response.data
}

export async function modifierProfile(profileData: any) {
    const response = await axios.post(`${apiUrl}/completertouriste`, profileData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenpersonnel')}`
        }
    })
    return response.data
}   