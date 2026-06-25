import "./TextArea.css";

const TextArea = ({ placeholder = "", value = "", onChange, error = "", limiteCaracteres = 5000 }) => {
    return (
        <div className="textarea-container">
            <div className={`textarea-wrapper ${error ? "textarea-wrapper--erro" : ""}`}>
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={limiteCaracteres}
                    className="textarea-campo"
                />
            </div>

            <span className="textarea-contador">{value.length} / {limiteCaracteres}</span>

            {error && <span className="textarea-erro">{error}</span>}
        </div>
    );
};

export default TextArea;