import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Menu.css'
import Icone from '../../../assets/Icon.svg'

const Menu = ({ links }) => {
    const [menuAberto, setMenuAberto] = useState(false)

    const alternarMenu = () => {
        setMenuAberto(!menuAberto)
    };

    return (
        <header className="menu-wrapper">
            <nav className="menu-container">
                
                <NavLink to="/home" className="menu-logo">
                    <img src={Icone} alt="Lunar Cycle Logo" className="logo-icone"/>
                    <span className="logo-texto">LUNAR CYCLE</span>
                </NavLink>

                <div className="menu-hamburger" onClick={alternarMenu}>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                    <div className={`barra ${menuAberto ? 'aberta' : ''}`}></div>
                </div>

                <ul className={`menu-links ${menuAberto ? 'ativo' : ''}`}>
                    {links.map((link, index) => (
                        <li key={index} className="menu-item">
                            <NavLink 
                                to={link.rota} 
                                className={({ isActive }) => isActive ? "menu-link ativo" : "menu-link"}
                                onClick={() => setMenuAberto(false)}
                            >
                                {link.titulo}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                
            </nav>
        </header>
    )
}

export default Menu