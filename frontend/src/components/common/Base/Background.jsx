import './Background.css'
import estrelasImg from '../../../assets/estrelas.png';

const Background = ({ children }) => {
    return (
        <>
            <div className="background-container">
                <div className="background-mistico"></div>
                <div className="background-estrelas" style={{ backgroundImage: `url(${estrelasImg})` }}></div>
                <main className="conteudo-app">
                    {children}
                </main>
            </div>
        </>
    )
}

export default Background;