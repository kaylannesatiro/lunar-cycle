import { useEffect } from "react";
import "./ModalSuporte.css";

const conteudosDosModais = {
    sobre: {
        titulo: "LUNAR CYCLE", 
        texto: (
            <>
                <p className="modal-versao">VERSÃO 1.0.0</p> 
                
                <p>Conecte-se aos ritmos sagrados do cosmos e sincronize sua jornada com os ciclos lunares. Lunar Cycle é seu portal místico para compreender e honrar as fases da natureza, entrelaçadas com a sabedoria milenar da Lua.</p>
                
                <p>Acompanhe seus ciclos menstruais, registre seus sonhos noturnos, consulte o oráculo lunar e descubra a magia que existe em cada fase da sua jornada pessoal sob o brilho celestial da Lua.</p>

                <h3 className="modal-subtitulo">RECURSOS MÍSTICOS</h3> 
                <ul className="modal-lista">
                    <li>Calendário lunar interativo sincronizado com as fases da Lua</li> 
                    <li>Registro e acompanhamento do ciclo menstrual</li> 
                </ul>
            </>
        )
    },
    privacidade: {
        titulo: "PRIVACIDADE", //
        texto: (
            <>
                <h3 className="modal-subtitulo">O SEU SANTUARIO É SEGURO</h3> {/* */}
                
                <p>Bem-vinda ao seu espaço sagrado. No Lunar Cycle, acreditamos que sua jornada, seus ciclos e seus sonhos pertencem única e exclusivamente a você.</p>
                <p>Veja como cuidamos do seu santuário:</p>
                
                <ul className="modal-lista">
                    <li><strong>O que guardamos:</strong> Apenas o necessário para a magia acontecer. Seu e-mail (para login), as datas do seu ciclo (para calcular sua sincronia lunar) e os registros do seu Diário dos Sonhos.</li>
                    <li><strong>Onde fica guardado:</strong> Seus dados são enviados de forma segura para o nosso cofre digital (banco de dados). Não vendemos, não compartilhamos e não bisbilhotamos suas informações.</li>
                    <li><strong>A inteligência fica com você:</strong> Todo o cálculo do seu signo, arquétipo mistico e sincronia (Lua Vermelha) acontece diretamente no seu celular ou computador. Nosso servidor não processa essas magias, ele apenas guarda seus registros.com seguranca</li>
                </ul>
            </>
        )
    },
    termos: {
        titulo: "TERMOS DE USO", //
        texto: (
            <>
                <h3 className="modal-subtitulo">NOSSO ACORDO COSMICO</h3> {/* */}
                
                <p>Ao adentrar este espaço, firmamos um compromisso mútuo de respeito e cuidado. Leia atentamente como o Lunar Cycle funciona:</p>

                <ul className="modal-lista">
                    <li><strong>Propósito do Nosso Espaço:</strong> O Lunar Cycle é um projeto académico em desenvolvimento. Ele foi criado para ser o seu diário mistico e rastreador de ciclos, focado no autoconhecimento e na conexão com a Lua.</li>
                    <li><strong>A Magia não substitui a Medicina:</strong> Este aplicativo não é uma ferramenta médica. Nossas mensagens, arquétipos e previsões são para acolhimento e reflexão holística. Para questões de saúde física ou mental, consulte sempre um médico ou especialista.</li>
                    <li><strong>O Cultivo do seu Diário:</strong> Você é a única responsável pelo que escreve no "Diário dos Sonhos". Use este espaco para o bem e para o seu</li>
                </ul>
            </>
        )
    },
    contato: {
        titulo: "CONTATO", 
        texto: (
            <>
                <h3 className="modal-subtitulo">SINAIS PARA AS ESTRELAS</h3> 
                
                <p>Dúvidas, sugestões ou encontrou algum problema no nosso aplicativo? Envie uma mensagem e nossa equipe de desenvolvedoras lerá com carinho.</p>

                <ul className="modal-lista">
                    <li>kaylannesatiro@alu.ufc.br</li>
                    <li>carlacristinasousaaraujo@ufc.br</li>
                    <li>clidenorlopesmartinsfilho@ufc.br</li>
                </ul>
                
                <p className="texto-destaque-final">DESENVOLVIDO COME MAGIA LUNAR</p> 
            </>
        )
    }
};

const ModalSuporte = ({ isOpen, onClose, contentType }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const conteudoAtual = conteudosDosModais[contentType] || conteudosDosModais["sobre"];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-caixa" onClick={(evento) => evento.stopPropagation()}>
                <header className="modal-cabecalho">
                    <h2 className="modal-titulo">{conteudoAtual.titulo}</h2>
                    
                    <button className="botao-fechar-modal" onClick={onClose} aria-label="Fechar modal">
                        X 
                    </button>
                </header>

                <div className="modal-corpo">
                    {conteudoAtual.texto}
                </div>
            </div>
        </div>
    );
};

export default ModalSuporte;