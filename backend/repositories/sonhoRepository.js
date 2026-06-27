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

module.exports = {
    criarSonho
}