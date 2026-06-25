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
            </div>
        </div>
    );
};

export default InputSenha;