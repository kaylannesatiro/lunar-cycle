import "./InputData.css";

const InputData = ({ value, onChange, error = "", variante = "sonho" }) => {

    let estilosDeSeguranca = {};

    if (variante === "menstruacao") {
        estilosDeSeguranca = { maxWidth: "341.875px" };
    } else if (variante === "sonho") {
        estilosDeSeguranca = { maxWidth: "448px" };
    }

    const formatarData = (e) => {
        let texto = e.target.value.replace(/\D/g, "");

        if (texto.length > 2) texto = texto.slice(0, 2) + "/" + texto.slice(2);
        if (texto.length > 5) texto = texto.slice(0, 5) + "/" + texto.slice(5);
        if (texto.length > 10) texto = texto.slice(0, 10);

        onChange({ ...e, target: { ...e.target, value: texto } });
    };

    return (
        <div className="input-data-container" style={estilosDeSeguranca}>
            <div className={`input-data-wrapper input-data-wrapper--${variante} ${error ? "input-data-wrapper--erro" : ""}`}>
                <input
                    type="text"
                    value={value}
                    onChange={formatarData}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className={`input-data-campo input-data-campo--${variante}`}
                />
            </div>

            {error && <span className="input-data-erro">{error}</span>}
        </div>
    );
};

export default InputData;