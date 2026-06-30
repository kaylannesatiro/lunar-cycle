const jwt = require('jsonwebtoken');

const verificarToken =  (req, res, next) =>{
    //buscar cabeçalho de autorização na requisição

    const authHeader = req.headers.authorization;

    //verificar se o cabeçalho existe
    //startsWith verifica se a string começa com 'Bearer ', que é o padrão para tokens JWT no cabeçalho de autorização.
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            mensagem: 'Acesso negada. faça login para continuar.'
        });
    }

    //Extrar apenas o token da string do cabeçalho
    //função split para separar a string em duas partes, usando o espaço como delimitador. O token é a segunda parte (índice 1) da string.
    const token = authHeader.split(' ')[1];

    try{
        //Tentar decodigicar token usando a chave secreta do login

        const decodificado = jwt.verify(token, 'secretKey_provisoria_do_lunar_cycle');

        //adicionar o id da usuaria no objeto de requisição para ser usado nas próximas rotas
        req.usuariaId = decodificado.id;

        //liberar pro controller
        next();
    } catch (error) {
        return res.status(401).json({
            mensagem: 'Sessão inválida ou expirada. Faça login novamente.'
        });
    }


}

module.exports = verificarToken;