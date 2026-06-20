
const validaRequisicao = (schema) => {
    return (req, res, next) =>{
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            const errosFormatados = error.issues.map((e) => ({
                campo: e.path[0],
                mensagem: e.message
            }));
            return res.status(400).json({ erros: errosFormatados });
        }
    };
};

module.exports = validaRequisicao;
