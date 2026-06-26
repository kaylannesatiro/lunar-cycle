import {useState} from "react"
import {obterMetricasLunares} from "../../../utils/calculosLunares"
import "./DadosExtras.css"

const DadosExtras = () => {
    const [metricas, setMetricas] = useState(() => obterMetricasLunares());

    return (
        <div className="dados-extras-container">
            <div className="dados-extras-lista">
                <div className="dados-extras-item">
                    <span className="dados-extras-valor">{metricas.diaDoCicloLunar}</span>
                    <span className="dados-extras-legenda">CICLO LUNAR</span>
                </div>

                <div className="dados-extras-item">
                    <span className="dados-extras-valor">{metricas.faltamParaCheia} dias</span>
                    <span className="dados-extras-legenda">PRÓXIMA LUA CHEIA</span>
                </div>

                <div className="dados-extras-item">
                    <span className="dados-extras-valor">{metricas.energia}%</span>
                    <span className="dados-extras-legenda">ENERGIA LUNAR</span>
                </div>
            </div>
        </div>
    )
}

export default DadosExtras