const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`

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
    },

    login: async ({ email, senha }) => {
        const resposta = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao realizar login.');
        localStorage.setItem('token', dados.token);
        return dados;
    },

    criarConta: async (dadosCadastro) => {
        const resposta = await fetch(`${BASE_URL}/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCadastro)
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao criar conta.');
        return dados;
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        localStorage.removeItem('token');
    }
};