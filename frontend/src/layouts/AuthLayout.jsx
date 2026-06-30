import { useState } from "react"
import { Outlet } from "react-router-dom"
import Background from "../components/common/Base/Background"
import CardConta from "../components/common/Cards/CardConta"
import "./AuthLayout.css"

const AuthLayout = () => {
    const [cardProps, setCardProps] = useState({
        titulo: "",
        subtitulo: "",
        linksRodape: [],
        variante: "auth"
    })

    return (
        <Background>
            <div className="auth-layout">
                <CardConta
                    titulo={cardProps.titulo}
                    subtitulo={cardProps.subtitulo}
                    linksRodape={cardProps.linksRodape}
                    variante={cardProps.variante}
                >
                    <Outlet context={{ setCardProps }} />
                </CardConta>
            </div>
        </Background>
    )
}

export default AuthLayout