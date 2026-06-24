import { useState } from 'react';
import "./Footer.css"
import ModalSuporte from "../Modals/ModalSuporte";
import arquivoDeModais from "../../../data/dadosModais.json";
import Icone from '../../../assets/Icon.svg'

const Footer = ({links}) => {
    const [modalAberto, setModalAberto] = useState(false);
    
    const [tipoConteudo, setTipoConteudo] = useState("sobre");

    const abrirModal = (tipo) => {
        setTipoConteudo(tipo);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
    };

    const dadosSelecionadosParaOModal = arquivoDeModais[tipoConteudo];

    return (
        <>
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
                                <li>
                                    <a onClick={() => abrirModal("sobre")} style={{ cursor: "pointer" }}>Sobre</a>
                                </li>
                                <li>
                                    <a onClick={() => abrirModal("privacidade")} style={{ cursor: "pointer" }}>Privacidade</a>
                                </li>
                                <li>
                                    <a onClick={() => abrirModal("termos")} style={{ cursor: "pointer" }}>Termos</a>
                                </li>
                                <li>
                                    <a onClick={() => abrirModal("contato")} style={{ cursor: "pointer" }}>Contato</a>
                                </li>
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

            <ModalSuporte 
                    isOpen={modalAberto} 
                    onClose={fecharModal} 
                    dados={dadosSelecionadosParaOModal} 
            />
        </>
    ) 
}

export default Footer