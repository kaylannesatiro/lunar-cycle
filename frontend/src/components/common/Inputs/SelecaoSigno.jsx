import "./SelecaoSigno.css"

const signosAstrologicos = [
    { id: 'aries', icone: '♈', nome: 'Áries' },
    { id: 'touro', icone: '♉', nome: 'Touro' },
    { id: 'gemeos', icone: '♊', nome: 'Gêmeos' },
    { id: 'cancer', icone: '♋', nome: 'Câncer' },
    { id: 'leao', icone: '♌', nome: 'Leão' },
    { id: 'virgem', icone: '♍', nome: 'Virgem' },
    { id: 'libra', icone: '♎', nome: 'Libra' },
    { id: 'escorpiao', icone: '♏', nome: 'Escorpião' },
    { id: 'sagitario', icone: '♐', nome: 'Sagitário' },
    { id: 'capricornio', icone: '♑', nome: 'Capricórnio' },
    { id: 'aquario', icone: '♒', nome: 'Aquário' },
    { id: 'peixes', icone: '♓', nome: 'Peixes' }
];

const SelecaoSigno = ({value, onChange}) => {
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