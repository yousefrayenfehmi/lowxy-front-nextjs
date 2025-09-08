'use client';

import axios from "axios";

export default async function ConnectionApi(email: string, password: string, type: string) {
    let response;
    try {
        if(type === 'personnel'){
            response = await axios.post('/api/touriste/login', {email, password});
            localStorage.setItem('tokenpersonnel', response.data.token);
            localStorage.setItem('type', 'personnel');
        }else if(type === 'chauffeur'){
            response = await axios.post('/api/chauffeur/login', {email, password});
            localStorage.setItem('tokenchauffeur', response.data.token);
            localStorage.setItem('type', 'chauffeur');
        }else if(type === 'partenaire'){
            response = await axios.post('/api/partenaire/login', {email, password});
            localStorage.setItem('tokenpartenaire', response.data.token);
            localStorage.setItem('type', 'partenaire');
        }
        return response?.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}