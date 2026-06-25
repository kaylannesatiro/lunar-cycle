import "./PopupAlert.css";

const PopupAlert = ({ isOpen, title, message, onClose, botao }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-alert-wrapper" onClick={e => e.stopPropagation()}>
                <div className="popup-alert-area">

                    <div className="popup-alert-cabecalho">
                        <h3 className="popup-alert-titulo">{title}</h3>
                        <p className="popup-alert-mensagem">{message}</p>
                    </div>

                    <div className="popup-alert-divisor" />

                    {botao && (
                        <div className="popup-alert-botao-area">
                            {botao}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupAlert;