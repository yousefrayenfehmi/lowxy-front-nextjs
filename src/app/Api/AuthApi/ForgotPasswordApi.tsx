'use client';
import axios from "axios";

export default async function ForgotPasswordApi(email: string, type: string) {
    let response;
    try {
        console.log('Envoi demande de réinitialisation pour:', email);
        if(type === 'personnel'){
             response = await axios.post('/api/touriste/forgetpassword', {email});
        }else if(type === 'chauffeur'){
             response = await axios.post('/api/chauffeur/forgetpassword', {email});
        }else if(type === 'partenaire'){
             response = await axios.post('/api/partenaire/forgetpassword', {email});
        }
        return response?.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        throw error;
    }
}

// API pour réinitialiser le mot de passe avec le token
export async function ResetPasswordApi(token: string, newPassword: string, type: string) {
    let response;
    try {
        console.log('Réinitialisation du mot de passe avec token');
        
        if(type === 'personnel'){
            response = await axios.post(`/api/touriste/resetpassword/${token}`, {
                newPassword: newPassword
            });
        }else if(type === 'chauffeur'){
            response = await axios.post(`/api/chauffeur/resetpassword/${token}`, {
                newPassword: newPassword
            });
        }else if(type === 'partenaire'){
            response = await axios.post(`/api/partenaire/resetpassword/${token}`, {
                newPassword: newPassword
            });
        }
        return response?.data;
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
    }
}
