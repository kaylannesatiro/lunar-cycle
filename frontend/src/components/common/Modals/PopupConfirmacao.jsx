import "./PopupConfirmacao.css";

const PopupConfirmacao = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    botaoConfirmar,
    botaoCancelar,
    variante = "confirmacao"
}) => {
    if (!isOpen) return null;

    const temIcone = variante === "confirmacao" || variante === "sonho";

    return (
        <div className="popup-confirmacao-overlay" onClick={onCancel}>
            <div
                className={`popup-confirmacao-wrapper popup-confirmacao-wrapper--${variante}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="popup-confirmacao-area">

                    <div className="popup-confirmacao-cabecalho">
                        {temIcone && (
                            <div className="popup-confirmacao-icone-area">
                                <span className="popup-confirmacao-icone">⚠</span>
                            </div>
                        )}

                        <h3 className={`popup-confirmacao-titulo popup-confirmacao-titulo--${variante}`}>
                            {title}
                        </h3>

                        <p className={`popup-confirmacao-mensagem popup-confirmacao-mensagem--${variante}`}>
                            {message}
                        </p>
                    </div>

                    <div className="popup-confirmacao-divisor" />

                    <div className="popup-confirmacao-botoes-area">
                        {botaoCancelar}
                        {botaoConfirmar}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PopupConfirmacao;