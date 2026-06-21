import { useState } from 'react';
import './Menu.css';

function Menu({ links }) {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <header className="menu-wrapper">
            <nav className="menu-container">
                
                <div className="menu-logo">
                {/* Substitua o emoji pelo seu SVG exportado do Figma, se tiver. Por enquanto, usamos a classe */}
                <span className="logo-icone">🌙</span>
                <span className="logo-texto">LUNAR CYCLE</span>
                </div>

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