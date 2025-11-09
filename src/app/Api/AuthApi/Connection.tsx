'use client';

import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default async function ConnectionApi(email: string, password: string, type: string) {
    let response;
    try {
        if(type === 'personnel'){
            response = await axios.post(`${apiUrl}/touriste/login`, {email, password});
            console.log(response);
            localStorage.setItem('tokenpersonnel', response.data.token);
            localStorage.setItem('type', 'personnel');
        }else if(type === 'chauffeur'){
            response = await axios.post(`${apiUrl}/chauffeur/login`, {email, password});
            localStorage.setItem('tokenchauffeur', response.data.token);
            localStorage.setItem('type', 'chauffeur');
        }else if(type === 'partenaire'){
            response = await axios.post(`${apiUrl}/partenaire/login`, {email, password});
            localStorage.setItem('tokenpartenaire', response.data.token);
            localStorage.setItem('type', 'partenaire');
        }
        return response?.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}