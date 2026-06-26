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

