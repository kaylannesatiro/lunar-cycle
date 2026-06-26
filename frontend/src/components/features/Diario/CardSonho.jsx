import "./CardSonho.css"
import Tag from "../../common/Tags/Tag"

const obterIconeLua = (faseLunar) => {
    try {
        return require(`../../../assets/fases/lua-${faseLunar}.svg`).default
    } catch (error) {
        return 'https://api.iconify.design/lucide:moon-star.svg'; 
    }
}

const CardSonho = ({faseLunar, titulo, data, tags = [], onClick}) => {
    return (
        <div className="card-sonho-pai" onClick={onClick} role="button" tabIndex={0}>
            <div className="card-sonho-icon-container">
                <img 
                    src={obterIconeLua(faseLunar)} 
                    alt={`Fase lunar: ${faseLunar}`} 
                    className="card-sonho-icon"
                />
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
                                ativa={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardSonho