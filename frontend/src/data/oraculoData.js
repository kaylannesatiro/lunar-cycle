export function obterDadosDoOraculo(faseDaLua, estaMenstruada) {
    const mensagens = {
        "Nova": {
            menstruada: "",
            naoMenstruada: ""
        },

        "Crescente": {
            menstruada: "",
            naoMenstruada: ""
        },

        "Cheia": {
            menstruada: "",
            naoMenstruada: ""
        },

        "Minguante": {
            menstruada: "",
            naoMenstruada: ""
        }
    };

    return {
        nomeFase: faseDaLua,
        mensagem: mensagens[faseDaLua][estaMenstruada ? "menstruada" : "naoMenstruada"],
        imagem: `/assets/lua-${faseDaLua.toLowerCase()}.png` 
    };
}

export function obterTagsDoCiclo(diaDoCiclo) {
    if (diaDoCiclo >= 1 && diaDoCiclo <= 5) return [""];
    if (diaDoCiclo >= 6 && diaDoCiclo <= 12) return [""];
    if (diaDoCiclo >= 13 && diaDoCiclo <= 16) return [""];
    return [""];
}