import { formatarDataObjParaBR } from "./dateHelper";

export const agruparSonhosPorMesEAno = (sonhos, pagina, limite) => {
    const limiteExibicao = pagina * limite
    const sonhosFatiados = sonhos.slice(0, limiteExibicao)
    
    const nomesMeses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"]
    const grupos = []

    sonhosFatiados.forEach((sonho) => {
        const dataObj = new Date(sonho.dataSonho)
        
        const mesNome = nomesMeses[dataObj.getUTCMonth()]
        const anoNum = dataObj.getUTCFullYear().toString()
        const diaNum = dataObj.getUTCDate().toString()

        const faseLimpa = sonho.faseLunar.substring(sonho.faseLunar.indexOf(' ') + 1)

        let grupo = grupos.find(g => g.mes === mesNome && g.ano === anoNum)

        if (!grupo) {
            grupo = { mes: mesNome, ano: anoNum, itens: [] }
            grupos.push(grupo)
        }

        const dataInput = formatarDataObjParaBR(dataObj)
        const tagsDoBanco = sonho.tags.map(t => t.nomeTag.toUpperCase())

        grupo.itens.push({
            id: sonho.id,
            diaFormatado: diaNum,
            titulo: sonho.titulo,
            descricao: sonho.descricao,
            data: dataInput,
            faseLunar: faseLimpa,
            tags: tagsDoBanco, 
            tagsSelecionadas: tagsDoBanco 
        })
    })

    return grupos
}