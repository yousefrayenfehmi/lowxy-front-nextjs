'use client';
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default async function Taxisignup(data: any) {
    try {
        const response = await axios.post(`${apiUrl}/chauffeur/register`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}

export async function recupererProfileTaxi() {
    const response = await axios.get(`${apiUrl}/chauffeur-by-token`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenchauffeur')}`
        }
    })
    return response.data
}

export async function modifierProfileTaxi(profileData: any) {
    const response = await axios.post(`${apiUrl}/completerchauffeur`, profileData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenchauffeur')}`
        }
    })
    return response.data
}