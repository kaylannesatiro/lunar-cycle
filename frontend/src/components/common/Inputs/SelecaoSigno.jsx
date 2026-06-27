import { 
    TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces 
} from "react-icons/tb"

import "./SelecaoSigno.css"

const signosAstrologicos = [
    { id: 'aries', icone: <TbZodiacAries />, nome: 'Áries' },
    { id: 'touro', icone: <TbZodiacTaurus />, nome: 'Touro' },
    { id: 'gemeos', icone: <TbZodiacGemini />, nome: 'Gêmeos' },
    { id: 'cancer', icone: <TbZodiacCancer />, nome: 'Câncer' },
    { id: 'leao', icone: <TbZodiacLeo />, nome: 'Leão' },
    { id: 'virgem', icone: <TbZodiacVirgo />, nome: 'Virgem' },
    { id: 'libra', icone: <TbZodiacLibra />, nome: 'Libra' },
    { id: 'escorpiao', icone: <TbZodiacScorpio />, nome: 'Escorpião' },
    { id: 'sagitario', icone: <TbZodiacSagittarius />, nome: 'Sagitário' },
    { id: 'capricornio', icone: <TbZodiacCapricorn />, nome: 'Capricórnio' },
    { id: 'aquario', icone: <TbZodiacAquarius />, nome: 'Aquário' },
    { id: 'peixes', icone: <TbZodiacPisces />, nome: 'Peixes' }
]

const SelecaoSigno = ({value, onChange}) => {

    const signoAtivo = value ? value.toLowerCase() : ""

    return (
        <div className="signo-container">
            {signosAstrologicos.map((signo) => (
                <button
                    key={signo.id}
                    type="button"
                    className={`signo-caixa ${signoAtivo === signo.id ? 'ativo' : ''}`}
                    onClick={() => onChange(signo.id)}
                    title={signo.nome} 
                >
                    <span className="signo-icone">
                        {signo.icone}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default SelecaoSigno