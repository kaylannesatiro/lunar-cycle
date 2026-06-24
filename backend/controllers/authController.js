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
        if (error.mensage === 'Email já cadastrado, tente fazer login ou use outro email.') {
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

module.exports = {
    criarConta,
    realizarLogin
};