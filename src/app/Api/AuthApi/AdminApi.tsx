import axios from "axios";


export async function ajouterBlog(data: any)     {
    const response = await axios.post('/api/admins/villeArticle', data);
    return response.data;
}

export async function getBlog() {
    const response = await axios.get('/api/admin/villeArticle');
    return response.data;
}
export async function deletBlog(id: string, data: any) {
    const response = await axios.delete(`/api/admin/villeArticle/${id}`, data);
    return response.data;
}
export async function updateBlog(id: string, data: any) {
    console.log('d5al kena hhhh');
    
    const response = await axios.put(`/api/admine/villeArticle/${id}`, data);
    return response.data;
}
export async function getBlogByVille(ville: string) {
    const response = await axios.get(`/api/admin/villeArticle/${ville}`);
    return response.data;
}