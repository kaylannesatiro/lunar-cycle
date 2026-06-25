import React from "react";

const CardConfig = ({ titulo, campos = [], camposDuplos = false, botao }) => {
    return (
        <div className="card-config-wrapper">
            <h2 className="card-config-titulo">{titulo}</h2>
            <div className="card-config-form">
                <div className={`card-config-conteudo ${camposDuplos ? "card-config-conteudo--duplo" : ""}`}>
                    {campos.map((campo, index) => (
                        <div className="card-config-grupo-input" key={index}>
                            <span className="card-config-texto-label">{campo.label}</span>
                            {campo.input}
                        </div>
                    ))}
                </div>
                {botao && botao}
            </div>
        </div>
    );
};

export default CardConfig;