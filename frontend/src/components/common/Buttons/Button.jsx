import "./Button.css"
import { motion } from "framer-motion";

const Button = ({variant = 'padrao', color, isLoading = false, onClick, disabled = false, children, icone}) => {

    const classVariante = `btn-${variant}`;
    const interativo = !disabled && !isLoading;

    return (
        <motion.button
            className={`btn-base ${classVariante} ${!interativo ? 'btn-disabled' : ''}`}
            onClick={interativo ? onClick : undefined}
            disabled={!interativo}
            
            style={color ? { borderColor: color, color: color } : {}}

            whileHover={interativo ? { scale: 1.02, boxShadow: "0px 0px 12px rgba(224, 197, 143, 0.3)" } : {}}
            whileTap={interativo ? { scale: 0.95 } : {}}>

            {isLoading ? (
                <span className="btn-loading">Processando...</span>
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