import "./TextArea.css";

const TextArea = ({
    placeholder = "",
    value = "",
    onChange,
    error = ""
}) => {
    return (
        <div className="textarea-container">
            <div className={`textarea-wrapper ${error ? "textarea-wrapper--erro" : ""}`}>
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="textarea-campo"
                />
            </div>

            {error && <span className="textarea-erro">{error}</span>}
        </div>
    );
};

export default TextArea;