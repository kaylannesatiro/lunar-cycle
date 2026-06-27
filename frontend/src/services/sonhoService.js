const API_URL = "http://localhost:3000/api/sonhos"

export const sonhosServiceFrontend = {
    listarTodos: async () => {
        const token = localStorage.getItem("token") || ""; 

        const resposta = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os sonhos")
        }

        return await resposta.json()
    }
}