import { Outlet } from "react-router-dom"
import Menu from "../components/common/Base/Menu"
import Footer from "../components/common/Base/Footer"
import Background from "../components/common/Base/Background"
import "./MainLayout.css"

const PublicLayout = () => { 
    const linksMenu = [
        { titulo: "Diário dos Sonhos", rota: "/diario" },
        { titulo: "Calendário", rota: "/calendario" },
        { titulo: "Entrar", rota: "/entrar", destaque: true } 
    ]

    const linkFooter = [
        { titulo: "Início", rota: "/home" },
        { titulo: "Diário dos Sonhos", rota: "/diario" },
        { titulo: "Calendário", rota: "/calendario" }
    ]

    return (
        <Background>
            <div className="main-layout-shell">
                <Menu links={linksMenu} />

                <main className="main-layout-paint-window">
                    <Outlet />
                </main>

                <Footer links={linkFooter} />
            </div>
        </Background>
    )
}

export default PublicLayout