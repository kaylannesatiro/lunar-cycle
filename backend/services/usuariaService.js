const bcrypt = require('bcrypt');
const usuariaRepository = require('../repositories/usuariaRepository');
const jwt = require('jsonwebtoken');

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


const realizarLogin = async (email, senha) => {

    //verificações de segurança e autenticação.

    const usuaria = await usuariaRepository.buscarPorEmail(email);
    if(!usuaria) {
        throw new Error('Usuário ou senha inválidos. Verifique suas informações e tente novamente.');
    }

    const senhaValida = await bcrypt.compare(senha, usuaria.senha);

    if(!senhaValida){
        throw new Error('Usuário ou senha inválidos. Verifique suas informações e tente novamente.');
    }

    //Caso não haja erro, proxima etapa: Gerar token JWT para autenticação


    const token = jwt.sign(
        { id: usuaria.id},
        'secretKey_provisoria_do_lunar_cycle',
        {expiresIn: '7d'}
    );


    return{
        token,
        usuaria: {
            id: usuaria.id,
            nome: usuaria.nome,
            email: usuaria.email,
        }
    };



}

module.exports = {
    criarConta,
    realizarLogin
};