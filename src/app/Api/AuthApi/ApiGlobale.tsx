import axios from "axios";

export async function CodeConfirmationApi(code: any, type: string) {
    try {
        console.log(code);
        if (type === 'personnel') {
            const token = localStorage.getItem('tokenPersonnel');

            const response = await axios.post('http://localhost:5000/touriste-verifier-email',code, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
            return response.data;
        } else if (type === 'chauffeur') {
            const token = localStorage.getItem('tokenTaxi');
            console.log(token);
            const response = await axios.post('http://localhost:5000/chauffeur-verifier-email',code, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } else if (type === 'partenaire') {
            const token = localStorage.getItem('tokenPartner');

            const response = await axios.post('http://localhost:5000/partenaire-verifier-email',code, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}
export async function ResendCodeApi(type: string) {
    try {
        if (type === 'personnel') { 
        const token = localStorage.getItem('tokenPersonnel');
        const response = await axios.get('http://localhost:5000/touriste-reenvoyercode', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        } else if (type === 'chauffeur') {
            const token = localStorage.getItem('tokenTaxi');
            const response = await axios.get('http://localhost:5000/chauffeur-reenvoyercode', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } else if (type === 'partenaire') {
            const token = localStorage.getItem('tokenPartner');
            const response = await axios.get('http://localhost:5000/partenaire-reenvoyercode', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
    }
}