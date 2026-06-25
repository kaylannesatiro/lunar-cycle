import { useState } from "react";
import "./InputSenha.css";

const InputSenha = ({ placeholder = "", value, onChange, error = "", variante = "cadastro" }) => {
    const [visivel, setVisivel] = useState(false);

    return (
        <div className="input-senha-container">
            <div className="input-senha-wrapper">
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
        </div>
    );
};

export default InputSenha;