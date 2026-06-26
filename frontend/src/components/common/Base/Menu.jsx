import { useState } from 'react';
import './Menu.css';
import Icone from '../../../assets/Icon.svg';

const Menu = ({ links }) => {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <header className="menu-wrapper">
            <nav className="menu-container">
                
                <a href="/" className="menu-logo">
                    <img src={Icone} alt="Lunar Cycle Logo" className="logo-icone"/>
                    <span className="logo-texto">LUNAR CYCLE</span>
                </a>

                <div className="menu-hamburger" onClick={alternarMenu}>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                </div>

                <ul className={`menu-links ${menuAberto ? 'ativo' : ''}`}>
                    {links.map((link, index) => (
                        <li key={index} className="menu-item">
                            <a href={link.rota} className="menu-link">
                                {link.titulo}
                            </a>
                        </li>
                    ))}
                </ul>
                
            </nav>
        </header>
    );
}

export default Menu;