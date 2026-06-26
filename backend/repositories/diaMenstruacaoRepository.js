const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


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
    return dia !== null;
};