import { Outlet } from "react-router-dom"
import Menu from "../components/common/Base/Menu"
import Footer from "../components/common/Base/Footer"
import Background from "../components/common/Base/Background"
import "./MainLayout.css"

const MainLayout = () => {
    const linksMenu = [
        { titulo: "Diário dos Sonhos", rota: "/app/diario" },
        { titulo: "Calendário", rota: "/app/calendario" },
        { titulo: "Conta", rota: "/app/conta" }
    ]

    const linkFooter = [
        { titulo: "Início", rota: "/app/home" },
        { titulo: "Diário dos Sonhos", rota: "/app/diario" },
        { titulo: "Calendário", rota: "/app/calendario" },
        { titulo: "Conta", rota: "/app/conta" }
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