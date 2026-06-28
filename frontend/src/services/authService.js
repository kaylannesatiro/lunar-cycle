const BASE_URL = 'http://localhost:3000/api/auth'

export const authService = {
    obterPerfil: async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${BASE_URL}/perfil`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error('Erro ao buscar perfil');
        return await resposta.json();
    },

    atualizarPerfil: async (dados) => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${BASE_URL}/perfil`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dados)
        });
        const data = await resposta.json();
        if (!resposta.ok) throw new Error(data.mensagem || 'Erro ao atualizar');
        return data;
    },

    excluirConta: async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${BASE_URL}/perfil`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error('Erro ao excluir conta');
    }
};