import "./Diario.css"

const DiarioPublic = () => {
    return (
        <div className="diario-pub-container">
            <div className="diario-pub-glow-externo"></div>
            <div className="diario-pub-glow-interno"></div>

            <div className="diario-pub-conteudo">
                <div className="diario-pub-badge">
                    <span className="diario-pub-estrelas">✦</span>
                    <span className="diario-pub-badge-texto">DIÁRIO DOS SONHOS</span>
                    <span className="diario-pub-estrelas">✦</span>
                </div>

                <h1 className="diario-pub-titulo">MEUS<br/>SONHOS</h1>

                <p className="diario-pub-chamada">
                    Cada sonho é uma mensagem do seu inconsciente.<br/>
                    Registre, explore e descubra o que sua alma revela enquanto você dorme.<br/>
                </p>

                <div className="diario-pub-divisor"></div>

                <div className="diario-pub-acoes">
                    <a href="/criar-conta" className="diario-pub-btn-primario">
                        Criar minha conta
                    </a>
                    <a href="/entrar" className="diario-pub-btn-secundario">
                        Já tenho conta
                    </a>
                </div>
            </div>
        </div>
    )
}

export default DiarioPublic