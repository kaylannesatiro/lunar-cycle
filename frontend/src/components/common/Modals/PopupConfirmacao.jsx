import "./PopupConfirmacao.css";

const PopupConfirmacao = ({
    isOpen,
    title,
    message,
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
                                <svg width="39" height="33" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-8.87513e-05 32.7271L19.2613 -0.000224113L38.5226 32.7271H-8.87513e-05ZM19.2613 29.0623C19.9904 29.0623 20.6107 28.8066 21.1221 28.2952C21.6429 27.7744 21.9033 27.1494 21.9033 26.4202C21.9033 25.6911 21.6429 25.0708 21.1221 24.5594C20.6107 24.0386 19.9904 23.7782 19.2613 23.7782C18.5321 23.7782 17.9071 24.0386 17.3863 24.5594C16.8749 25.0708 16.6192 25.6911 16.6192 26.4202C16.6192 27.1494 16.8749 27.7744 17.3863 28.2952C17.9071 28.8066 18.5321 29.0623 19.2613 29.0623ZM17.5283 20.568H20.9942L21.2499 10.9089H17.2726L17.5283 20.568Z" fill="#F5F0E9"/>
                                </svg>
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