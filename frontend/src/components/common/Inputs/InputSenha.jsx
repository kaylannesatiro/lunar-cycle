import { useState } from "react";
import "./InputSenha.css";

const InputSenha = ({ placeholder = "", value, onChange, error = "", variante = "cadastro" }) => {
    const [visivel, setVisivel] = useState(false);

    let estilosDeSeguranca = {};

    if (variante === "cadastro") {
        estilosDeSeguranca = { maxWidth: "436px" };
    } else if (variante === "autenticacao") {
        estilosDeSeguranca = { maxWidth: "359px" };
    } else if (variante === "configuracao") {
        estilosDeSeguranca = { maxWidth: "715px" };
    }

    return (
        <div className="input-senha-container" style={estilosDeSeguranca}>
            <div className={`input-senha-wrapper input-senha-wrapper--${variante} ${error ? "input-senha-wrapper--erro" : ""}`}>
                <input
                    type={visivel ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="input-senha-campo"
                />

                <button
                    type="button"
                    className="input-senha-olho"
                    onClick={() => setVisivel(!visivel)}
                    aria-label={visivel ? "Ocultar senha" : "Exibir senha"}
                >
                    <span className="material-symbols-outlined">
                        {visivel ? "visibility" : "visibility_off"}
                    </span>
                </button>
            </div>

            {error && <span className="input-senha-erro">{error}</span>}
        </div>
    );
};

export default InputSenha;