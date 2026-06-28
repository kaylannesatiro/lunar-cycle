import imgLuaNova from '../assets/fases/lua-nova.svg'
import imgLuaCrescente from '../assets/fases/lua-crescente.svg'
import imgLuaCheia from '../assets/fases/lua-cheia.svg'
import imgLuaMinguante from '../assets/fases/lua-minguante.svg'
import imgLuaQuartoCrescente from '../assets/fases/lua-quarto-crescente.svg'
import imgLuaQuartoMinguante from '../assets/fases/lua-quarto-minguante.svg'
import imgLuaGibosaCrescente from '../assets/fases/lua-gibosa-crescente.svg'
import imgLuaGibosaMinguante from '../assets/fases/lua-gibosa-minguante.svg'

const obterIconFaseDaLua = (faseDaLua) => {
    const imagensMap = {
            "nova": imgLuaNova,
            "crescente": imgLuaCrescente,
            "quarto Crescente": imgLuaQuartoCrescente,
            "gibosa Crescente": imgLuaGibosaCrescente,
            "cheia": imgLuaCheia,
            "minguante": imgLuaMinguante,
            "quarto Minguante": imgLuaQuartoMinguante,
            "gibosa Minguante": imgLuaGibosaMinguante
    }

    return imagensMap[faseDaLua];
}

export {obterIconFaseDaLua}