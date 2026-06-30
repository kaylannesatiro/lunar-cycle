import { obterDadosDoOraculo, obterTagsDoCiclo } from "../../../data/oraculoData";
import "./CardOraculo.css"
import Tag from "../../common/Tags/Tag";

const CardOraculo = ({ estaMenstruada, faseLunar }) => {
    const dadosOraculo = obterDadosDoOraculo(faseLunar, estaMenstruada)
    const tagsDoDia = obterTagsDoCiclo(faseLunar, estaMenstruada)

    return (
        <div className="oraculo-container">
            <div className="oraculo-coluna-esquerda">
                <img 
                    src={dadosOraculo.imagem} 
                    alt={`Fase da lua: ${dadosOraculo.nomeFase}`} 
                    className="oraculo-imagem"
                />
                
                <div className="oraculo-fase-grupo">
                    <span className="oraculo-legenda">FASE ATUAL</span>
                    <h3 className="oraculo-texto-fase">{dadosOraculo.nomeFase}</h3>
                </div>
                
                <div className="oraculo-tags">
                    {tagsDoDia.map((tag, index) => (
                        <Tag 
                            key={index} 
                            texto={tag} 
                            variante="oraculo" 
                        />
                    ))}
                </div>
            </div>

            <div className="oraculo-coluna-direita">
                <div className="oraculo-icone-aspas">❝</div>
                <p className="oraculo-mensagem">{dadosOraculo.mensagem}</p>
                <div className="oraculo-divisor"></div>
            </div>
        </div>
    )
}

export default CardOraculo