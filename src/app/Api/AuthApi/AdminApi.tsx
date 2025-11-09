import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function ajouterBlog(data: any)     {
    const response = await axios.post(`${apiUrl}/admins/villeArticle`, data);
    return response.data;
}

export async function getBlog() {
    const response = await axios.get(`${apiUrl}/admin/villeArticle`);
    return response.data;
}
export async function deletBlog(id: string, data: any) {
    const response = await axios.delete(`${apiUrl}/admin/villeArticle/${id}`, data);
    return response.data;
}
export async function updateBlog(id: string, data: any) {
    console.log('d5al kena hhhh');
    
    const response = await axios.put(`${apiUrl}/admine/villeArticle/${id}`, data);
    return response.data;
}
export async function getBlogByVille(ville: string) {
    const response = await axios.get(`${apiUrl}/admin/villeArticle/${ville}`);
    return response.data;
}