const prisma = require('../config/prisma');

// Cria um registro de sonho e suas respectivas tags no banco de dados
const criarSonho = async (usuariaId, titulo, descricao, dataSonho, faseLunar, tags) => {
    return await prisma.sonho.create({
        data: {
            usuariaId,
            titulo,
            descricao,
            dataSonho,
            faseLunar,
            //insere as tags na tabela tagSonho vinculadas a este sonho
            tags:{
                create: tags.map(tag =>({
                    nomeTag: tag
                }))
            }
        },
        //inclui as tags no resultado da criação do sonho
        include: {
            tags: true
        }
    });

};

//Buscar sonho especifco por ID
const buscarPorId = async(id, idUsuaria) => {
    return await prisma.sonho.findFirst({
        where:{
            id: id,
            usuariaId: idUsuaria
        },
        include:{
            tags: true // ja traz as tags associadas ao sonho
        }
    });
}

//Atualizar um sonho e substitui suas tags, garantindo isolamento da usuaria

const atualizarSonho = async(id, usuariaId, titulo, descricao, dataSonho, faseLunar, tags) => {
    //Retorna o resultado da segunda operacao (o update) ignorando o resultado do deleteMany
    //const usa _ para ignorar o primeiro resultado do array retornado pelo prisma.$transaction (destucturing)
    const [_, sonhoAtualizado] = await prisma.$transaction([
        //deletar as tags antigas associadas ao sonho
        prisma.tagSonho.deleteMany({
            where:{
                sonhoId: id
            }
        }),
        //atualizar o sonho com os novos dados e criar as novas tags
        prisma.sonho.update({
            where:{
                id: id,
                //garante que a usuaria so possa atualizar seus proprios sonhos
                usuariaId: usuariaId
            },
            data:{
                titulo,
                descricao,
                dataSonho,
                faseLunar,
                tags:{
                    create: tags.map(tag => ({
                        nomeTag: tag
                    }))
                }
            },
            include:{
                tags: true
            }
        })
    ]);

    return sonhoAtualizado;

}

module.exports = {
    criarSonho,
    buscarPorId,
    atualizarSonho
}