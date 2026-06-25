import "./Tag.css";
const Tag = ({ texto, variante = "sonho", ativa = false, aoRemover, aoClicar }) => {
    let estilosDeSeguranca = {};
    if (variante === "sonho" || variante === "sonho-ativa") {
        estilosDeSeguranca = { height: "1.302rem" };
    } else if (variante === "visualizar") {
        estilosDeSeguranca = { height: "1.253rem" };
    } else if (variante === "filtro-periodo" || variante === "filtro-tag") {
        estilosDeSeguranca = { height: "1.302rem" };
    } else if (variante === "registro") {
        estilosDeSeguranca = { height: "1.212rem" };
    }

    return (
        <span
            className={`tag-base tag--${variante} ${ativa ? "tag--ativa" : ""}`}
            style={estilosDeSeguranca}
            onClick={aoClicar}
        >
            <span className={`tag-texto tag-texto--${variante} ${ativa ? "tag-texto--ativa" : ""}`}>
                {texto}
            </span>

            {aoRemover && (
                <button
                    type="button"
                    className="tag-remover"
                    onClick={(e) => {
                        e.stopPropagation();
                        aoRemover();
                    }}
                    aria-label={`Remover tag ${texto}`}
                >
                    ✕
                </button>
            )}
        </span>
    );
};

export default Tag;