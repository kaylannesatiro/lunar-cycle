const bcrypt = require('bcrypt');
const usuariaRepository = require('../repositories/usuariaRepository');

const criarConta = async (dadosusuaria) => {
    //RN- 001: Verificar se o email já está cadastrado
    const usuariaExistente = await usuariaRepository.buscarPorEmail(dadosusuaria.email);
    if (usuariaExistente) {
        throw new Error('Email já cadastrado, tente fazer login ou use outro email.');
    }

    //RNF-004: Criptografar a senha antes de salvar

    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(dadosusuaria.senha, saltRounds);

    //objeto final

    const novaUsuariaDados = {
        nome: dadosusuaria.nome,
        email: dadosusuaria.email,
        senha: senhaCriptografada,
        signo: dadosusuaria.signo,
        duracaoCiclo: dadosusuaria.duracaoCiclo,
        duracaoMenstruacao: dadosusuaria.duracaoMenstruacao
    }


    const usuariaCriada = await usuariaRepository.criarUsuaria(novaUsuariaDados);


    //removendo a senha do objeto antes de retornar

    const {senha, ...usuariaSemSenha} = usuariaCriada;
    return usuariaSemSenha;

};

module.exports = {
    criarConta
};