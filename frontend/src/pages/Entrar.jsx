import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import Input from "../components/common/Inputs/Input"
import InputSenha from "../components/common/Inputs/InputSenha"
import Button from "../components/common/Buttons/Button"
import { authService } from "../services/authService"
import "./Entrar.css"

const Entrar = () => {
    const navigate = useNavigate()
    const { setCardProps } = useOutletContext()

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erros, setErros] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setCardProps({
            titulo: "Bem-vinda ao seu universo lunar",
            subtitulo: "Acompanhe seus ciclos sob a luz da Lua",
            linksRodape: [
                { texto: "Esqueci a senha", rota: "/recuperar-senha" },
                { texto: "Criar conta",     rota: "/criar-conta"     }
            ]
        })
    }, [])

    const validar = () => {
        const novosErros = {}

        if (!email.trim())
            novosErros.email = "Informe seu e-mail."

        if (!senha.trim())
            novosErros.senha = "Informe sua senha."

        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    const aoEntrar = async () => {
        if (!validar()) return
        setIsLoading(true)
        setErros(prev => ({ ...prev, geral: "" }))
        try {
            await authService.login({ email: email.toLowerCase(), senha })
            navigate("/home")
        } catch (erro) {
            const mensagem = erro.message || ""

            if (
                erro.status === 401 ||
                mensagem === "CREDENCIAIS_INVALIDAS" ||
                mensagem.includes("credenciais") ||
                mensagem.includes("inválid") ||
                mensagem.includes("incorrect")
            ) {
                setErros(prev => ({
                    ...prev,
                    geral: "E-mail ou senha incorretos."
                }))
            } else {
                setErros(prev => ({
                    ...prev,
                    geral: "Ocorreu um erro ao tentar entrar. Tente novamente."
                }))
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="entrar-conteudo">

            <div className="entrar-campo">
                <label className="entrar-label">E-mail</label>
                <Input
                    variante="autenticacao"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (erros.email) setErros(prev => ({ ...prev, email: "" }))
                    }}
                    error={erros.email}
                />
            </div>

            <div className="entrar-campo">
                <label className="entrar-label">Senha</label>
                <InputSenha
                    variante="autenticacao"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value)
                        if (erros.senha) setErros(prev => ({ ...prev, senha: "" }))
                    }}
                    error={erros.senha}
                />
            </div>

            {erros.geral && (
                <span className="entrar-erro-geral">{erros.geral}</span>
            )}

            <div className="entrar-botao">
                <Button
                    variant="padrao"
                    onClick={aoEntrar}
                    isLoading={isLoading}
                    backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                    color="rgba(224, 197, 143, 0.3)"
                    textColor="rgba(224, 197, 143, 1)"
                    width="100%"
                    maxWidth="100%"
                >
                    ◈ Entrar
                </Button>
            </div>

        </div>
    )
}

export default Entrar