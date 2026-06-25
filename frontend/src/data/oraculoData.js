import imgLuaNova from '../assets/fases/lua-nova.svg'
import imgLuaCrescente from '../assets/fases/lua-crescente.svg'
import imgLuaCheia from '../assets/fases/lua-cheia.svg'
import imgLuaMinguante from '../assets/fases/lua-minguante.svg'

const obterDadosDoOraculo = (faseDaLua, estaMenstruada) => {
    const mensagens = {
        "Nova": {
            menstruada: "A lua se esconde no céu e convida ao silêncio, exatamente como o seu corpo agora. Ao sangrar sob a Lua Nova, você e a Terra compartilham o mesmo suspiro profundo de descanso e limpeza. Permita-se soltar o peso do último ciclo, recolha-se sem culpa e abrace a renovação silenciosa que acontece na escuridão.",
            naoMenstruada: "Sob o manto de veludo do céu escuro, a Lua Nova sussurra sobre recomeços. Enquanto seu corpo pulsa com a energia do despertar e da ação, o cosmos te convida a plantar as sementes de suas intenções mais profundas. É o momento de sonhar em voz alta e desenhar os novos caminhos da sua jornada. Semeie a sua magia."
        },

        "Crescente": {
            menstruada: "Enquanto o céu noturno começa a se iluminar e pedir movimento, seu corpo ainda flui em um ritmo de pausa e limpeza. Sangrar na Lua Crescente é viver o equilíbrio perfeito entre o fazer e o nutrir. Não tenha pressa em acelerar. Use a energia de crescimento lá fora para fortalecer suas raízes aqui dentro. Recolha-se para poder brotar mais forte amanhã.",
            naoMenstruada: "A luz começa a retornar ao céu, e a sua energia acompanha esse despertar brilhante. A Lua Crescente sopra vento nas velas das suas intenções. É o momento de regar as sementes que você plantou no escuro, dar os primeiros passos com firmeza e transformar os sonhos da Lua Nova em ação concreta. Movimente-se, confie e cresça."
        },

        "Quarto Crescente": {
            menstruada: "O céu dá o seu primeiro suspiro de luz, mas o seu corpo ainda pede o conforto do ninho. Enquanto a Lua Crescente Côncava acorda lentamente a natureza, permita que o seu sangramento lave as últimas resistências. Use essa luz nascente apenas para iluminar as intuições que o seu descanso está lhe revelando.",
            naoMenstruada: "A primeira curva prateada rasga a escuridão do céu. O seu corpo acompanha esse despertar sutil, ganhando energia aos poucos. Ainda não é hora de correr, mas sim de dar o primeiro e corajoso passo em direção aos sonhos que você plantou. Nutra os seus brotos iniciais com paciência e otimismo."
        },

        "Gibosa Crescente": {
            menstruada: "O mundo lá fora vibra em expansão quase total, mas o seu sagrado labirinto interno está em profundo recolhimento. Sangrar sob a Lua Gibosa Crescente é um lembrete poderoso de que a verdadeira força não é apenas fazer, mas saber quando pausar. Honre o seu ciclo, respire fundo e deixe o mundo girar enquanto você se nutre.",
            naoMenstruada: "O céu está iluminado pela esperança e pela expectativa da Lua Gibosa. Você está quase no seu ápice de vitalidade. O cosmos pede persistência: não desista agora, ajuste os últimos detalhes dos seus projetos e mantenha o foco. A expansão está logo ali, transbordando na ponta dos seus dedos."
        },

        "Cheia": {
            menstruada: "Sob o brilho intenso da Lua Cheia, o teu corpo verte o sangue sagrado, unindo a força do fogo cósmico à profundidade das tuas águas internas. Esta é a mística Sincronia da Lua Vermelha. Enquanto o mundo lá fora brilha, o teu poder vira-se para dentro, despertando uma intuição selvagem e visceral. Não forces a ação exterior; recolhe-te no teu trono de sabedoria, ouve os teus sonhos e canaliza esta imensa magia para a tua própria transformação.",
            naoMenstruada: "O céu transborda com a luz prateada da Lua Cheia, espelhando a plenitude e a vitalidade que habitam em ti neste momento. Com o corpo e o cosmos em perfeita celebração de brilho e magnetismo, a tua energia está no ápice. É hora de partilhares os teus dons com o mundo, manifestares os teus desejos com clareza e celebrares a tua própria força divina. Permite que o teu brilho ilumine tudo ao teu redor."
        },

        "Gibosa Minguante": {
            menstruada: "A luz começa a sua suave despedida, assim como o seu corpo se limpa através do sangue. A Lua Gibosa Minguante ilumina os frutos da sua jornada recente. Celebre o que foi bom e aproveite o seu fluxo menstrual para devolver à terra as sementes que não vingaram. É um momento de gratidão curativa e purificação.",
            naoMenstruada: "Gratidão flui como água cristalina entre as estrelas eternas. É hora de colher com graça os frutos preciosos da sua jornada espiritual e celebrar cada conquista."
        },

        "Quarto Minguante": {
            menstruada: "Uma fina linha de luz no céu despede-se deste ciclo, em perfeita sincronia com a sua própria limpeza. Sangrar na Lua Balsâmica é mergulhar nas águas mais profundas da intuição e da cura. O universo silencia para que você possa curar as suas raízes. Feche os olhos, deixe ir absolutamente tudo e abrace a paz do esvaziamento.",
            naoMenstruada: "Restam apenas feixes de luz prateada na Lua Balsâmica. O cosmos está sussurrando, pedindo que você baixe o volume do mundo exterior. Mesmo que o seu corpo ainda não tenha iniciado a renovação física, a sua mente precisa desse vácuo curativo. Descanse a mente, ouça a sua voz interior e prepare o terreno espiritual para o novo que virá."
        },

        "Minguante": {
            menstruada: "Vertes o teu sangue sagrado enquanto a lua míngua no céu, criando um poderoso fluxo duplo de purificação, cura e desapego. Sangrar na Lua Minguante é o ápice da limpeza física e espiritual. O cosmos e o teu corpo estão em perfeita sintonia para deixar ir as dores, as mágoas e os pesos do passado. Entrega à terra o que já não te pertence, recolhe-te sem pressa e abraça o alívio profundo desta grande libertação.",
            naoMenstruada: "A lua começa a recolher a sua luz no céu, convidando-te à introspeção e à avaliação de tudo o que viveste até aqui. Embora o teu corpo físico ainda não tenha iniciado o fluxo da renovação, a energia cósmica pede que desaceleres. É o momento perfeito para limpares os excessos da mente, desapegares-te do que já não serve e colheres com sabedoria os ensinamentos deste ciclo. Permite-te esvaziar com calma."
        }
    };

    const imagensMap = {
        "Nova": imgLuaNova,
        "Crescente": imgLuaCrescente,
        "Quarto Crescente": imgLuaCrescente,
        "Gibosa Crescente": imgLuaCrescente,
        "Cheia": imgLuaCheia,
        "Minguante": imgLuaMinguante,
        "Quarto Minguante": imgLuaMinguante,
        "Gibosa Minguante": imgLuaMinguante
    };

    return {
        nomeFase: faseDaLua,
        mensagem: mensagens[faseDaLua][estaMenstruada ? "menstruada" : "naoMenstruada"],
        imagem: imagensMap[faseDaLua]
    };
}

const obterTagsDoCiclo = (faseDaLua, estaMenstruada) => {
    const tags = {
        "Nova": {
            menstruada: ["Silêncio", "Limpeza", "Recolhimento"],
            naoMenstruada: ["Recomeço", "Intenção", "Magia"]
        },

        "Crescente": {
            menstruada: ["Pausa", "Equilíbrio", "Nutrição"],
            naoMenstruada: ["Despertar", "Firmeza", "Crescimento"]
        },

        "Quarto Crescente": {
            menstruada: ["", "", ""],
            naoMenstruada: ["", "", ""]
        },

        "Gibosa Crescente": {
            menstruada: ["", "", ""],
            naoMenstruada: ["", "", ""]
        },

        "Cheia": {
            menstruada: ["Lua Vermelha", "Intuição", "Sabedoria"],
            naoMenstruada: ["Plenitude", "Vitalidade", "Magnetismo"]
        },

        "Gibosa Minguante": {
            menstruada: ["", "", ""],
            naoMenstruada: ["", "", ""]
        },

        "Quarto Minguante": {
            menstruada: ["", "", ""],
            naoMenstruada: ["", "", ""]
        },

        "Minguante": {
            menstruada: ["Purificação", "Cura", "Libertação"],
            naoMenstruada: ["Introspecção", "Desacelerar", "Desapego"]
        }
    };

    return tags[faseDaLua][estaMenstruada ? "menstruada" : "naoMenstruada"];
}

export { obterDadosDoOraculo, obterTagsDoCiclo }