const prisma = require('../config/prisma');

const buscarPorEmail = async (email) => {
    return await prisma.usuaria.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
};


const buscarPorId = async (id) =>{
    return await prisma.usuaria.findUnique({
        where: {id}
    });
};

const criarUsuaria = async (dadosUsuaria) => {
    return await prisma.usuaria.create({
        data: {
            nome: dadosUsuaria.nome,
            email: dadosUsuaria.email.toLowerCase(),
            senha: dadosUsuaria.senha,
            signo: dadosUsuaria.signo,
            duracaoCiclo: dadosUsuaria.duracaoCiclo,
            duracaoMenstruacao: dadosUsuaria.duracaoMenstruacao
        }
    });
};

const atualizarDados = async (id, dadosAtualizados) => {
    return await prisma.usuaria.update({
        where: { id },
        data: dadosAtualizados
    });
};

module.exports = {
    buscarPorEmail,
    criarUsuaria,
    buscarPorId,
    atualizarDados
};