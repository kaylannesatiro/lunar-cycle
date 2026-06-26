import { Outlet } from "react-router-dom"
import Menu from "../components/common/Base/Menu"
import Footer from "../components/common/Base/Footer"
import Background from "../components/common/Base/Background"
import "./MainLayout.css"

const MainLayout = () => {
    const linksMenu = [
        { titulo: "Diário dos Sonhos", rota: "/diario" },
        { titulo: "Calendário", rota: "/calendario" },
        { titulo: "Conta", rota: "/conta" }
    ]

    const linkFooter = [
        { titulo: "Início", rota: "/home" },
        { titulo: "Diário dos Sonhos", rota: "/diario" },
        { titulo: "Calendário", rota: "/calendario" },
        { titulo: "Conta", rota: "/conta" }
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

export default MainLayout