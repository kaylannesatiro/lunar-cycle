import { useState } from 'react';
import './Menu.css';

function Menu({ links }) {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <nav className="menu-container">
        
        {/* Logo e Título */}
        <div className="menu-logo">
            <span className="logo-icone">🌙</span>
            <span className="logo-texto">LUNAR CYCLE</span>
        </div>

        {/* Botão Hambúrguer visível apenas no Mobile */}
        <div className="menu-hamburger" onClick={alternarMenu}>
            <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
            <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
            <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
        </div>

        {/* Lista de Links */}
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
    );
}

export default Menu;