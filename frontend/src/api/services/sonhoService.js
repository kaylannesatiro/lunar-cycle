const BASE_URL = `${import.meta.env.VITE_API_URL}/api/sonhos`

export const sonhosServiceFrontend = {
    listarTodos: async (filtros = {}) => {
        try {
            const queryParams = new URLSearchParams()
            if (filtros.tag) queryParams.append('tag', filtros.tag)
            if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio)
            if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim)

            const queryString = queryParams.toString()
            const urlCompleta = queryString 
                ? `${BASE_URL}/sonhos?${queryString}` 
                : `${BASE_URL}/sonhos`

            const token = localStorage.getItem('token');
            const resposta = await fetch(urlCompleta, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                }
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json()
                throw new Error(dadosErro.erro || 'Erro ao carregar a listagem de sonhos.')
            }

            return await resposta.json();
        } catch (error) {
            console.error("Erro no serviço de sonhos (Fetch):", error)
            throw error;
        }
    },

    criar: async (dadosSonho) => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`${BASE_URL}/sonhos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                },
                body: JSON.stringify(dadosSonho)
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.erro || 'Erro ao criar o sonho.');
            }
            return await resposta.json();
        } catch (error) {
            console.error("Erro ao criar sonho (Fetch):", error);
            throw error;
        }
    },

    atualizar: async (id, dadosSonho) => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`${BASE_URL}/sonhos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                },
                body: JSON.stringify(dadosSonho)
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.erro || 'Erro ao atualizar o sonho.');
            }
            return await resposta.json();
        } catch (error) {
            console.error("Erro ao atualizar sonho (Fetch):", error);
            throw error;
        }
    },

    excluir: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`${BASE_URL}/sonhos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                }
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.erro || 'Erro ao excluir o sonho.');
            }
            
            return true; 
        } catch (error) {
            console.error("Erro ao excluir sonho (Fetch):", error);
            throw error;
        }
    }
}