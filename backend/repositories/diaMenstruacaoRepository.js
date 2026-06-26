const prisma = require('../config/prisma');


// Buscar a data mais recente de menstruação de uma usuária
const buscarUltimaMenstruacao = async (usuariaId) => {
    return await prisma.diaMenstruacao.findFirst({
        where: {usuariaId},
        orderBy: {data: 'desc'}
    })
}

// Verifica se um dia especifico está marcado (para a Home saber o status do botao)
const verificarDiaMarcado = async (usuariaId, data) => {
    const dia = await prisma.diaMenstruacao.findUnique({
        where:{
            usuariaId_data:{
                usuariaId,
                data
            }
        }
    });

    // Retorna true se o dia estiver marcado, caso contrário retorna false
    return dia !== null;
};


// Marcar um dia de menstruação
const registrarDia = async (usuariaId, data) => {
    return await prisma.diaMenstruacao.create({
        data: {
            usuariaId,
            data
        }
    });
};

// desmarcar um dia de menstruação
const desmarcarDia = async (usuariaId, data) => {
    return await prisma.diaMenstruacao.delete({
        where:{
            usuariaId_data:{
                usuariaId,
                data
            }
        }
    });
};
//buscar todos os dias de menstruação de uma usuária dentro de um intervalo de datas
const buscarDiasPorIntervalo = async (usuariaId, dataInicio, dataFim) =>{
    return await prisma.diaMenstruacao.findMany({
        where:{
            usuariaId,
            data: {
                //maior ou igual que
                gte: dataInicio,
                //menor ou igual que
                lte: dataFim
            }
        },
        orderBy: {data: 'asc'}
    });
};

module.exports = {
    buscarUltimaMenstruacao,
    verificarDiaMarcado,
    registrarDia,
    desmarcarDia,
    buscarDiasPorIntervalo
}