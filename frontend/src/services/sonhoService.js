const BASE_URL = 'http://localhost:3000/api'

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
    }
}