const usuariaService = require('../services/usuariaService');

const criarConta = async (req, res) => {
    try {
        //pegar os dados do frontend
        const dadosRequisicao = req.body;

        //enviar os dados para o service
        const novaUsuaria = await usuariaService.criarConta(dadosRequisicao);

        //201 - Created
        return res.status(201).json({
            mensagem: 'Usuária criada com sucesso!',
            usuaria: novaUsuaria
        });
    } catch (error) {
        //erro 409
        if (error.message === 'Email já cadastrado, tente fazer login ou use outro email.') {
            return res.status(409).json({ mensagem: error.message });
        }
        //erro 500
        console.error('erro no servidor ao criar conta:', error);
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao criar a conta. Por favor, tente novamente mais tarde.' });
    }
};

const realizarLogin = async (req, res) => {
    try{
        const {email, senha} = req.body;

        const resultado = await usuariaService.realizarLogin(email, senha);

        //200 OK:
        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            ...resultado
        })
    } catch (error){
        if (error.message === 'Usuário ou senha inválidos. Verifique suas informações e tente novamente.') {
            return res.status(401).json({ mensagem: error.message });
        }

        return res.status(500).json({ mensagem: 'Ocorreu um erro ao realizar o login. Por favor, tente novamente mais tarde.' });
    }
};

const obterDadosPerfil = async(req, res) =>{
    try{
        //middleware de autenticação adiciona o id da usuaria no objeto de requisição. Por isso posso acessar o id da usuaria através de req.usuariaId
        const id = req.usuariaId;

        const perfil = await usuariaService.obterPerfil(id);
        //o service retorna o perfil da usuaria sem a senha, então posso retornar diretamente para o frontend.
        return res.status(200).json(perfil)
    } catch (erro){
        return res.status(400).json({
            mensagem: erro.message
        })
    }
}


const atualizarPerfil = async(req, res) =>{
    try{
        //id garantido na req pelo middleware.
        const id = req.usuariaId;
        //dados chegam aqui limpos e validados pelo schema zod. Então já envio pro service.
        const dadosAtualizados = req.body;
        const perfilAtualizado =  await usuariaService.atualizarPerfil(id, dadosAtualizados);

        const mensagemSucesso = dadosAtualizados.novaSenha ? 'Senha atualizada com sucesso!' : 'Perfil atualizado com sucesso!';
        return res.status(200).json({
            mensagem: mensagemSucesso,
            perfil: perfilAtualizado
        })

    } catch (erro){
        if(erro.message == 'Usuária não encontrada.'){
            return res.status(404).json({
                mensagem: erro.message
            })
        }
        if(erro.message == 'A senha atual informada incorreta.'){
            return res.status(400).json({
                mensagem: erro.message
            })
        }
        if(erro.message == 'O email informado já está cadastrado'){
            return res.status(409).json({
                mensagem: erro.message
            })
        }

        return res.status(500).json({
            mensagem: 'Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.'
        })
    }
}

module.exports = {
    criarConta,
    realizarLogin,
    obterDadosPerfil,
    atualizarPerfil
};