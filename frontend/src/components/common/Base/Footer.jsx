import "./Footer.css"
import Icone from '../../../assets/Icon.svg'

const Footer = ({links}) => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-container">
                <div className="footer-conteudo">

                    <div className="footer-marca">
                        <div className="footer-logo">
                            <img src={Icone} alt="Lunar Cycle Logo" className="logo-icone-footer"/>
                            <span className="logo-texto-footer">LUNAR CYCLE</span>
                        </div>
                        <p className="footer-descricao">
                            Conectando você aos ritmos sagrados do cosmos e aos ciclos lunares da natureza feminina.
                        </p>

                        <div className="footer-sociais">
                            <a href="#" className="icone-social">○</a>
                            <a href="#" className="icone-social">◈</a>
                            <a href="#" className="icone-social">✦</a>
                        </div>
                    </div>

                    <div className="footer-coluna-links">
                        <h4 className="footer-titulo-links">NAVEGAÇÃO</h4>
                        <ul className="footer-lista-links">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <a href={link.rota}>{link.titulo}</a>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="footer-coluna-links">
                        <h4 className="footer-titulo-links">SUPORTE</h4>
                        <ul className="footer-lista-links">
                            <li><a href="/sobre">Sobre</a></li>
                            <li><a href="/privacidade">Privacidade</a></li>
                            <li><a href="/termos">Termos</a></li>
                            <li><a href="/contato">Contato</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-rodape-final">
                    <p className="frase-mistica">
                        ✦ COMO A LUA, VOCÊ TAMBÉM TEM FASES. CADA UMA DELAS É SAGRADA. ✦
                    </p>
                    <p className="copyright">
                        © 2026 Lunar Cycle · Todos os direitos reservados
                    </p>
                </div>
            </div>
        </footer>
    ) 
}

export default Footer