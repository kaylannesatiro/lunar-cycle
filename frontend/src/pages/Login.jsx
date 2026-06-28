import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CardConta from "../../components/common/Cards/CardConta"
import Input from "../../components/common/Inputs/Input"
import InputSenha from "../../components/common/Inputs/InputSenha"
import Button from "../../components/common/Buttons/Button"
import { autenticar } from "../../services/authService"

const Autenticar = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erros, setErros] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const validar = () => {
        const novosErros = {}
        if (!email.trim()) novosErros.email = "Informe seu e-mail."
        if (!senha.trim()) novosErros.senha = "Informe sua senha."
        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    const aoAutenticar = async () => {
        if (!validar()) return
        setIsLoading(true)
        try {
            await autenticar({ email, senha })
            navigate("/home")
        } catch (erro) {
            setErros({ geral: "E-mail ou senha incorretos." })
        } finally {
            setIsLoading(false)
        }
    }

    const linksRodape = [
        { texto: "Esqueci a senha", rota: "/recuperar-senha" },
        { texto: "Criar conta",     rota: "/criar-conta"     }
    ]

    return (
        <CardConta
            titulo="Bem-vinda ao seu universo lunar"
            subtitulo="Acompanhe seus ciclos sob a luz da Lua"
            linksRodape={linksRodape}
        >
            <div className="autenticar-campo">
                <label className="autenticar-label">E-mail</label>
                <Input
                    variante="autenticacao"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (erros.email) setErros({ ...erros, email: "" })
                    }}
                    error={erros.email}
                />
            </div>

            <div className="autenticar-campo">
                <label className="autenticar-label">Senha</label>
                <InputSenha
                    variante="autenticacao"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value)
                        if (erros.senha) setErros({ ...erros, senha: "" })
                    }}
                    error={erros.senha}
                />
            </div>

            {erros.geral && <span className="autenticar-erro-geral">{erros.geral}</span>}

            <div className="autenticar-botao">
                <Button
                    variant="padrao"
                    onClick={aoAutenticar}
                    isLoading={isLoading}
                    backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                    color="rgba(224, 197, 143, 0.3)"
                    textColor="rgba(224, 197, 143, 1)"
                    width="100%"
                    maxWidth="22.417rem"
                >
                    ◈ Entrar
                </Button>
            </div>
        </CardConta>
    )
}

export default Autenticar