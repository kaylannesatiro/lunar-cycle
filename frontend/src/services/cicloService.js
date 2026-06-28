const BASE_URL = 'http://localhost:3000/api/ciclos';

export const cicloService = {
    obterDadosHome: async () => {
        const token = localStorage.getItem('token')
        const resposta = await fetch(`${BASE_URL}/home`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resposta.ok) throw new Error('Erro ao buscar dados do painel cósmico')
        return await resposta.json()
    },

    alternarMenstruacaoHoje: async () => {
        const token = localStorage.getItem('token')
        const resposta = await fetch(`${BASE_URL}/home/toggle-hoje`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resposta.ok) throw new Error('Erro ao alternar status menstrual de hoje')
        return await resposta.json()
    },

    obterCalendario: async (mes, ano) => {
        const token = localStorage.getItem('token')
        const resposta = await fetch(`${BASE_URL}/calendario?mes=${mes}&ano=${ano}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resposta.ok) throw new Error('Erro ao buscar registros do calendário')
        return await resposta.json()
    },

    alternarMenstruacaoDia: async (dataStr, mes, ano) => {
        const token = localStorage.getItem('token')
        const resposta = await fetch(`${BASE_URL}/calendario/toggle`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ data: dataStr, mes, ano })
        })
        if (!resposta.ok) throw new Error('Erro ao alternar data específica do calendário')
        return await resposta.json()
    }
}