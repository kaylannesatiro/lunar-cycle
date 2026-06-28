import { 
    TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces 
} from "react-icons/tb"

import "./SelecaoSigno.css"

const signosAstrologicos = [
    { id: 'Áries',      icone: <TbZodiacAries />,       nome: 'Áries'      },
    { id: 'Touro',      icone: <TbZodiacTaurus />,      nome: 'Touro'      },
    { id: 'Gêmeos',     icone: <TbZodiacGemini />,      nome: 'Gêmeos'     },
    { id: 'Câncer',     icone: <TbZodiacCancer />,      nome: 'Câncer'     },
    { id: 'Leão',       icone: <TbZodiacLeo />,         nome: 'Leão'       },
    { id: 'Virgem',     icone: <TbZodiacVirgo />,       nome: 'Virgem'     },
    { id: 'Libra',      icone: <TbZodiacLibra />,       nome: 'Libra'      },
    { id: 'Escorpião',  icone: <TbZodiacScorpio />,     nome: 'Escorpião'  },
    { id: 'Sagitário',  icone: <TbZodiacSagittarius />, nome: 'Sagitário'  },
    { id: 'Capricórnio',icone: <TbZodiacCapricorn />,   nome: 'Capricórnio'},
    { id: 'Aquário',    icone: <TbZodiacAquarius />,    nome: 'Aquário'    },
    { id: 'Peixes',     icone: <TbZodiacPisces />,      nome: 'Peixes'     }
]

const SelecaoSigno = ({ value, onChange }) => {
    return (
        <div className="signo-container">
            {signosAstrologicos.map((signo) => (
                <button
                    key={signo.id}
                    type="button"
                    className={`signo-caixa ${value === signo.id ? 'ativo' : ''}`}
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