import {useState, useEffect} from "react"
import { obterDadosDoOraculo, obterTagsDoCiclo } from "../../../data/oraculoData";
import "./CardOraculo.css"
import Tag from "../../common/Tags/Tag";

const CardOraculo = ({ estaMenstruada}) => {
    const [faseAtual, setFaseAtual] = useState("Nova");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function buscarFaseDaLua() {
            try {
                const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Quixada?key=SUA_CHAVE_AQUI&include=days&elements=moonphase';
                
                const resposta = await fetch(url);
                
                if (!resposta.ok) {
                    throw new Error("Erro na comunicação com a API");
                }

                const dados = await resposta.json();
                
                const valorFase = dados.days[0].moonphase; 
                
                let faseConvertida = "Nova";

                if (valorFase === 0 || valorFase === 1) {
                    faseConvertida = "Nova";
                } else if (valorFase > 0 && valorFase < 0.25) {
                    faseConvertida = "Crescente"; 
                } else if (valorFase === 0.25) {
                    faseConvertida = "Quarto Crescente"; 
                } else if (valorFase > 0.25 && valorFase < 0.5) {
                    faseConvertida = "Gibosa Crescente"; 
                } else if (valorFase === 0.5) {
                    faseConvertida = "Cheia"; 
                } else if (valorFase > 0.5 && valorFase < 0.75) {
                    faseConvertida = "Gibosa Minguante";
                } else if (valorFase === 0.75) {
                    faseConvertida = "Quarto Minguante"; 
                } else if (valorFase > 0.75 && valorFase < 1) {
                    faseConvertida = "Minguante"; 
                }

                setFaseAtual(faseConvertida);
            } catch (erro) {
                console.error("Não foi possível buscar a lua. Usando fase padrão.", erro);
            } finally {
                setCarregando(false);
            }
        }
        buscarFaseDaLua();
    }, []);

    const dadosOraculo = obterDadosDoOraculo(faseAtual, estaMenstruada);
    const tagsDoDia = obterTagsDoCiclo(faseAtual, estaMenstruada)

    if (carregando) {
        return <div className="oraculo-container">Consultando os astros...</div>;
    }

    return (
        <div className="oraculo-container">
            <div className="oraculo-coluna-esquerda">
                <img 
                    src={dadosOraculo.imagem} 
                    alt={`Fase da lua: ${dadosOraculo.nomeFase}`} 
                    className="oraculo-imagem"
                />
                <span className="oraculo-legenda">FASE ATUAL</span>
                <h3 className="oraculo-texto-fase">{dadosOraculo.nomeFase}</h3>
                
                <div className="oraculo-tags">
                    {tagsDoDia.map((tag, index) => (
                        <Tag 
                            key={index} 
                            texto={tag} 
                            variante="oraculo" 
                        />
                    ))}
                </div>
            </div>

            <div className="oraculo-coluna-direita">
                <div className="oraculo-icone-aspas">❝</div>
                <p className="oraculo-mensagem">{dadosOraculo.mensagem}</p>
                <div className="oraculo-divisor"></div>
            </div>
        </div>
    )
}

export default CardOraculo