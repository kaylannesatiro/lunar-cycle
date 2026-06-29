const BASE_URL = 'http://localhost:3000/api/usuarias'

export const usuariaService = {
    obterPerfil: async () => {
        const token = localStorage.getItem('token')
        const resposta = await fetch(`${BASE_URL}/perfil`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resposta.ok) throw new Error('Erro ao buscar perfil da usuária')
        return await resposta.json()
    }
}