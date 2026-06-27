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

//bsucar sonho por ID e usuária
const buscarSonhoPorId = async (id, usuariaId) => {
    const sonho = await sonhoRepository.buscarPorId(id, usuariaId);
    if (!sonho) {
        // Criamos um erro customizado para o Controller poder responder com 404
        const erro = new Error('Sonho não encontrado.');
        erro.status = 404;
        throw erro;
    }
    return sonho;
}


//Atualizar um sonho existente
const atualizarSonho = async (id, usuariaId, dados) => {
    const { titulo, descricao, dataSonho, tags } = dados;
    // 1. Verifica se o sonho existe e pertence à usuária (RN-003)
    // Se não existir, essa função já lança o erro 404 automaticamente
    await buscarSonhoPorId(id, usuariaId);
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
        const tagsValidas = tags
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length >= 2 && t.length <= 25);
            
        tagsNormalizadas = [...new Set(tagsValidas)].slice(0, 10);
    }
    // 5. Cálculo da Fase Lunar (RN-007)
    const dataParaFase = new Date(dataSonho + 'T12:00:00Z');
    const faseLunarObj = obterFaseLunar(dataParaFase);
    const faseLunarString = `${faseLunarObj.icone} ${faseLunarObj.nome}`;
    // 6. Chamada ao Repositório
    return await sonhoRepository.atualizarSonho(
        id,
        usuariaId, 
        titulo.trim(), 
        descricao.trim(), 
        dataObj, 
        faseLunarString, 
        tagsNormalizadas
    );

    //praticamente reaproveitei a função de criar sonho, mas com a diferença de que aqui chamamos o método de atualizar do repositório, que já cuida de deletar as tags antigas e criar as novas, garantindo o isolamento da usuária.
};

const deletarSonho = async (id, usuariaId) =>{
    await buscarSonhoPorId(id, usuariaId); //verifica se o sonho existe e pertence à usuária, se falhar, lança erro 404 automaticamente
    return await sonhoRepository.deletarSonho(id, usuariaId);
}


const listarSonhos = async (usuariaId, filtros = {}) => {
    const { tag, dataInicio, dataFim } = filtros;
    let filtrosFormatadados = {};

    //Trata a tag, se existir
    if(tag){
        filtrosFormatadados.tag = tag.trim().toLowerCase();
    }

    //validar as datas cruzadas
    if(dataInicio && dataFim){
        const inicio = new Date(dataInicio+'T00:00:00Z');
        const fim = new Date(dataFim+'T23:59:59Z');
        if(inicio > fim){
            throw new Error('A data de início não pode ser maior que a data de fim.');
        }
    }

    //Formata as datas oara abranger o dia inteiro (Inclusivo)

    if(dataInicio){
        filtrosFormatadados.dataInicio = new Date(dataInicio+'T00:00:00Z');
    }

    if(dataFim){
        filtrosFormatadados.dataFim = new Date(dataFim+'T23:59:59Z');
    }
    return await sonhoRepository.listarSonhos(usuariaId, filtrosFormatadados);
}

module.exports = {
    criarSonho,
    buscarSonhoPorId,
    atualizarSonho,
    deletarSonho,
    listarSonhos
};