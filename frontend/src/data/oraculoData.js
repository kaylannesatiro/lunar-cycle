export function obterDadosDoOraculo(faseDaLua, estaMenstruada) {
    const mensagens = {
        "Nova": {
            menstruada: "A lua se esconde no céu e convida ao silêncio, exatamente como o seu corpo agora. Ao sangrar sob a Lua Nova, você e a Terra compartilham o mesmo suspiro profundo de descanso e limpeza. Permita-se soltar o peso do último ciclo, recolha-se sem culpa e abrace a renovação silenciosa que acontece na escuridão.",
            naoMenstruada: "Sob o manto de veludo do céu escuro, a Lua Nova sussurra sobre recomeços. Enquanto seu corpo pulsa com a energia do despertar e da ação, o cosmos te convida a plantar as sementes de suas intenções mais profundas. É o momento de sonhar em voz alta e desenhar os novos caminhos da sua jornada. Semeie a sua magia."
        },

        "Crescente": {
            menstruada: "Enquanto o céu noturno começa a se iluminar e pedir movimento, seu corpo ainda flui em um ritmo de pausa e limpeza. Sangrar na Lua Crescente é viver o equilíbrio perfeito entre o fazer e o nutrir. Não tenha pressa em acelerar. Use a energia de crescimento lá fora para fortalecer suas raízes aqui dentro. Recolha-se para poder brotar mais forte amanhã.",
            naoMenstruada: "A luz começa a retornar ao céu, e a sua energia acompanha esse despertar brilhante. A Lua Crescente sopra vento nas velas das suas intenções. É o momento de regar as sementes que você plantou no escuro, dar os primeiros passos com firmeza e transformar os sonhos da Lua Nova em ação concreta. Movimente-se, confie e cresça."
        },

        "Cheia": {
            menstruada: "Sob o brilho intenso da Lua Cheia, o teu corpo verte o sangue sagrado, unindo a força do fogo cósmico à profundidade das tuas águas internas. Esta é a mística Sincronia da Lua Vermelha. Enquanto o mundo lá fora brilha, o teu poder vira-se para dentro, despertando uma intuição selvagem e visceral. Não forces a ação exterior; recolhe-te no teu trono de sabedoria, ouve os teus sonhos e canaliza esta imensa magia para a tua própria transformação.",
            naoMenstruada: "O céu transborda com a luz prateada da Lua Cheia, espelhando a plenitude e a vitalidade que habitam em ti neste momento. Com o corpo e o cosmos em perfeita celebração de brilho e magnetismo, a tua energia está no ápice. É hora de partilhares os teus dons com o mundo, manifestares os teus desejos com clareza e celebrares a tua própria força divina. Permite que o teu brilho ilumine tudo ao teu redor."
        },

        "Minguante": {
            menstruada: "Vertes o teu sangue sagrado enquanto a lua míngua no céu, criando um poderoso fluxo duplo de purificação, cura e desapego. Sangrar na Lua Minguante é o ápice da limpeza física e espiritual. O cosmos e o teu corpo estão em perfeita sintonia para deixar ir as dores, as mágoas e os pesos do passado. Entrega à terra o que já não te pertence, recolhe-te sem pressa e abraça o alívio profundo desta grande libertação.",
            naoMenstruada: "A lua começa a recolher a sua luz no céu, convidando-te à introspeção e à avaliação de tudo o que viveste até aqui. Embora o teu corpo físico ainda não tenha iniciado o fluxo da renovação, a energia cósmica pede que desaceleres. É o momento perfeito para limpares os excessos da mente, desapegares-te do que já não serve e colheres com sabedoria os ensinamentos deste ciclo. Permite-te esvaziar com calma."
        }
    };

    return {
        nomeFase: faseDaLua,
        mensagem: mensagens[faseDaLua][estaMenstruada ? "menstruada" : "naoMenstruada"],
        imagem: `/assets/fases-lua/lua-${faseDaLua.toLowerCase()}.png` 
    };
}

export function obterTagsDoCiclo(diaDoCiclo) {
    if (diaDoCiclo >= 1 && diaDoCiclo <= 5) return [""];
    if (diaDoCiclo >= 6 && diaDoCiclo <= 12) return [""];
    if (diaDoCiclo >= 13 && diaDoCiclo <= 16) return [""];
    return [""];
}