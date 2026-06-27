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

module.exports = {
    criarSonho,
    buscarPorId
}