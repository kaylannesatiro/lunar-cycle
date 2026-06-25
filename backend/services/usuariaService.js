const bcrypt = require('bcrypt');
const usuariaRepository = require('../repositories/usuariaRepository');
const jwt = require('jsonwebtoken');
const { da } = require('zod/v4/locales');


//FUNÇÃO PARA CRIAR CONTA
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

//FUNÇÃO PARA REALIZAR LOGIN
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

    //jwt.sing pega o id da usuaria e transforma em uma string.
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


//Pra retornar o perfil completo da usuaria.

const obterPerfil = async (id) => {
    const usuaria = await usuariaRepository.buscarPorId(id);
    if(!usuaria){
        throw new Error('Usuária não encontrada.');
    }

    const {senha, ...usuariaSemSenha} = usuaria;
    return usuariaSemSenha;
}


const atualizarPerfil = async (id, dadosAtualizados) => {
    const usuariaAtual = await usuariaRepository.buscarPorId(id);
    if(!usuariaAtual) {
        throw new Error('Usuária não encontrada.');
    }

    //Verficar se o email novo (se ela estiver tentando atualizar) já está em uso por outra usuária

    if(dadosAtualizados.email !== usuariaAtual.email){
        const emailExistente = await usuariaRepository.buscarPorEmail(dadosAtualizados.email);
        if(emailExistente){
            throw new Error('O email informado já está cadastrado');
        }
    }

    //Logica para trocar de senha, só entra aqui se a usuária estiver tentando atualizar a senha. (precisa preencher a senha atual)

    if (dadosAtualizados.senhaAtual) {
        const senhaValida = await bcrypt.compare(dadosAtualizados.senhaAtual, usuariaAtual.senha);
        if (!senhaValida){
            throw new Error('A senha atual informada está incorreta.');
        }
        dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.novaSenha, 10);
    }
    //Limpar dados desnecessários antes de atualizar o perfil no bd
    
    delete dadosAtualizados.senhaAtual;
    delete dadosAtualizados.novaSenha;
    delete dadosAtualizados.confirmarNovaSenha;

    //Mandar pro repository atualizar os dados da usuária no banco de dados
    const usuariaAtualizada = await usuariaRepository.atualizarDados(id, dadosAtualizados);


    const {senha, ...usuariaSemSenha} = usuariaAtualizada;
    return usuariaSemSenha;
}



module.exports = {
    criarConta,
    realizarLogin,
    obterPerfil,
    atualizarPerfil
};
