import axios from "axios";


export async function ajouterBlog(data: any)     {
    const response = await axios.post('http://localhost:5000/admins/villeArticle', data);
    return response.data;
}

export async function getBlog() {
    const response = await axios.get('http://localhost:5000/admin/villeArticle');
    return response.data;
}
export async function deletBlog(id: string, data: any) {
    const response = await axios.delete(`http://localhost:5000/admin/villeArticle/${id}`, data);
    return response.data;
}
export async function updateBlog(id: string, data: any) {
    console.log('d5al kena hhhh');
    
    const response = await axios.put(`http://localhost:5000/admine/villeArticle/${id}`, data);
    return response.data;
}
export async function getBlogByVille(ville: string) {
    const response = await axios.get(`http://localhost:5000/admin/villeArticle/${ville}`);
    return response.data;
}