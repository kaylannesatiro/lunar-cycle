import './Background.css'
import estrelasImg from '../../../assets/estrelas.png';

const Background = ({ children }) => {
    return (
        <>
            <div className="background-container">
                <div className="background-mistico"></div>
                <div className="background-estrelas" style={{ backgroundImage: `url(${estrelasImg})` }}></div>
                {children}
            </div>
        </>
    )
}

export default Background;