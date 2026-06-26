import "./Button.css"
import { motion } from "framer-motion";

const Button = ({variant = 'padrao', backgroundColor, color, textColor, isLoading = false, onClick, disabled = false, children, icone, width, maxWidth}) => {
    const interativo = !disabled && !isLoading;
    let estilosDeSeguranca = {};
    
    if (variant === 'padrao') {
        estilosDeSeguranca = { width: '100%', maxWidth: '342px', height: '48px', minHeight: '48px' };
    } else if (variant === 'redondo') {
        estilosDeSeguranca = { width: '100%', maxWidth: '268px', height: '48px', minHeight: '48px' };
    } else if (variant === 'fechar') {
        estilosDeSeguranca = { width: '34px', height: '34px', minWidth: '34px', minHeight: '34px' };
    }

    if (width) {
        estilosDeSeguranca.width = width;
    }
    
    if (maxWidth) {
        estilosDeSeguranca.maxWidth = maxWidth;
    }

    if (color) {
        estilosDeSeguranca.borderColor = color;
        estilosDeSeguranca.color = color;
    }

    if (backgroundColor) {
        estilosDeSeguranca.background = backgroundColor;
    }

    if (textColor) {
        estilosDeSeguranca.color = textColor;
    }

    return (
        <motion.button
            className={`btn-base btn-${variant} ${!interativo ? 'btn-disabled' : ''}`}
            onClick={interativo ? onClick : undefined}
            disabled={!interativo}
            style={estilosDeSeguranca}

            whileHover={interativo ? { scale: 1.02, boxShadow: "0px 0px 12px rgba(224, 197, 143, 0.3)" } : {}}
            whileTap={interativo ? { scale: 0.95 } : {}}>

            {isLoading ? (
                <span className="btn-loading">Carregando...</span>
            ) : (
                <>
                {variant === 'fechar' ? ('✕') : (
                    <div className="btn-conteudo">
                        {icone && <span className="btn-icone">{icone}</span>}
                        {children}
                    </div>
                )}
                </>
            )}
        </motion.button>
    )
}

export default Button