import "./CardSonho.css"
import Tag from "../../common/Tags/Tag"
import {obterIconFaseDaLua} from "../../../data/fasesLua"

const CardSonho = ({faseLunar, titulo, data, tags = [], onClick}) => {
    return (
        <div className="card-sonho-pai" onClick={onClick} role="button" tabIndex={0}>
            <div className="card-sonho-icon-wrapper">
                <div className="card-sonho-icon-container">
                    <img 
                        src={obterIconFaseDaLua(faseLunar)} 
                        alt={`Fase lunar: ${faseLunar}`} 
                        className="card-sonho-icon"
                    />
                </div>
            </div>

            <div className="card-sonho-conteudo">
                <h3 className="card-sonho-titulo">
                    DIA {data} — {titulo}
                </h3>

                <div className="card-sonho-tags-container">
                    <div className="card-sonho-tags-lista">
                        {tags.map((tag, index) => (
                            <Tag 
                                key={`${tag}-${index}`} 
                                texto={tag} 
                                variante="sonho"
                                ativa={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardSonho