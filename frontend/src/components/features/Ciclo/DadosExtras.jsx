import {useState} from "react"
import {obterMetricasLunares} from "../../../utils/calculosLunares"
import "./DadosExtras.css"

const DadosExtras = () => {
    const [metricas] = useState(() => obterMetricasLunares());

    return (
        <div className="dados-extras-lista">
            {/* Dia do Ciclo Lunar */}
            <div className="dados-extras-card">
                <div className="dados-extras-dado">
                    <span className="dados-extras-valor">{metricas.diaDoCicloLunar}dia</span>
                </div>
                <span className="dados-extras-legenda">CICLO LUNAR</span>
            </div>

            {/* Próxima Lua Cheia */}
            <div className="dados-extras-card">
                <div className="dados-extras-dado">
                    <span className="dados-extras-valor">{metricas.faltamParaCheia}dias</span>
                </div>
                <span className="dados-extras-legenda">PRÓXIMA LUA CHEIA</span>
            </div>

            {/* Energia Lunar */}
            <div className="dados-extras-card">
                <div className="dados-extras-dado">
                    <span className="dados-extras-valor">{metricas.energia}%</span>
                </div>
                <span className="dados-extras-legenda">ENERGIA LUNAR</span>
            </div>
        </div>
    )
}

export default DadosExtras