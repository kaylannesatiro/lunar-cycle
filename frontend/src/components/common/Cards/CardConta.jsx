import React from "react"
import "./CardConta.css"
import icone from "../../../assets/Icon-Modal.svg"

const CardConta = ({ titulo, subtitulo, children, linksRodape, variante = "auth" }) => {
    return (
        <div className={`card-conta-wrapper card-conta-wrapper--${variante}`}>
            <div className="card-conta-cabecalho">
                <img src={icone} alt="Ícone Lunar" className="card-conta-icone" />
                <h2 className="card-conta-titulo">{titulo}</h2>
                <p className="card-conta-subtitulo">{subtitulo}</p>
            </div>

            <div className="card-conta-conteudo">
                {children}
            </div>

            {linksRodape && linksRodape.length > 0 && (
                <div className="card-conta-links">
                    {linksRodape.map((link, index) => (
                        <React.Fragment key={index}>
                            <a href={link.rota} className="card-conta-link">
                                {link.texto}
                            </a>
                            {index < linksRodape.length - 1 && (
                                <span className="card-conta-separador">•</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CardConta