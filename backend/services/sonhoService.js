const sonhoRepository = require('../repositories/sonhoRepository');
const usuariaRepository = require('../repositories/usuariaRepository');
const {obterFaseLunar} = require('../utils/fasesLunares');

const criarSonho = async (usuariaId, dados) => {
    const { titulo, descricao, dataSonho, tags } = dados;
    // 1. Validações da Usuária
    const usuaria = await usuariaRepository.buscarPorId(usuariaId);
    if (!usuaria) throw new Error('Usuária não encontrada');

    // 2. Validações Básicas
    if (!titulo || titulo.trim().length < 3) {
        throw new Error('O título deve ter pelo menos 3 caracteres.');
    }
    if (titulo.length > 80) {
        throw new Error('O título pode ter no máximo 80 caracteres.');
    }
    
    if (!descricao || descricao.trim().length < 10) {
        throw new Error('A descrição deve ter pelo menos 10 caracteres.');
    }
    if (descricao.length > 5000) {
        throw new Error('A descrição pode ter no máximo 5.000 caracteres.');
    }
    if (!dataSonho) {
        throw new Error('Informe a data do sonho.');
    }
    // 3. Validação de Data (formato e futuro)
    const dataObj = new Date(dataSonho);
    if (isNaN(dataObj.getTime())) {
        throw new Error('Informe uma data válida.');
    }
    
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    if (dataObj > hoje) {
        throw new Error('A data do sonho não pode ser no futuro.');
    }
    // 4. Normalização das Tags (minúsculas, limite, tamanho)
    let tagsNormalizadas = [];
    if (Array.isArray(tags)) {
        // Converte para minúsculas e filtra vazios e tamanhos incorretos
        const tagsValidas = tags
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length >= 2 && t.length <= 25);
            
        // Remove duplicatas (usando Set) e limita a 10 tags
        tagsNormalizadas = [...new Set(tagsValidas)].slice(0, 10);
    }
    // 5. Cálculo da Fase Lunar
    // A data chega como YYYY-MM-DD
    const dataParaFase = new Date(dataSonho + 'T12:00:00Z'); // Adiciona horário fixo para evitar fuso
    const faseLunarObj = obterFaseLunar(dataParaFase);
    const faseLunarString = `${faseLunarObj.icone} ${faseLunarObj.nome}`;
    // 6. Chamada ao Repositório
    return await sonhoRepository.criarSonho(
        usuariaId, 
        titulo.trim(), 
        descricao.trim(), 
        dataObj, 
        faseLunarString, 
        tagsNormalizadas
    );
};
module.exports = {
    criarSonho
};