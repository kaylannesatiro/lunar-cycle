const prisma = require('../config/prisma');

const buscarPorEmail = async (email) => {
    return await prisma.usuaria.findUnique({
        where: {
            email: email.toLowerCase()
        }
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

module.exports = {
    buscarPorEmail,
    criarUsuaria
};