import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import Input from "../../components/common/Inputs/Input"
import InputSenha from "../../components/common/Inputs/InputSenha"
import SelecaoSigno from "../../components/common/Inputs/SelecaoSigno"
import Button from "../../components/common/Buttons/Button"
import { authService } from "../../api/services/authService"
import "./CriarConta.css"

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validarSenha = (senha) => {
    if (!senha.trim())
        return "Informe sua senha."
    if (senha.length < 8)
        return "A senha deve ter pelo menos 8 caracteres."
    if (!/[A-Z]/.test(senha))
        return "A senha deve conter pelo menos uma letra maiúscula."
    if (!/[0-9]/.test(senha))
        return "A senha deve conter pelo menos um número."
    if (!/[^A-Za-z0-9]/.test(senha))
        return "A senha deve conter pelo menos um caractere especial."
    return null
}

const CriarConta = () => {
    const navigate = useNavigate()
    const { setCardProps } = useOutletContext()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [duracaoCiclo, setDuracaoCiclo] = useState("")
    const [duracaoMenstruacao, setDuracaoMenstruacao] = useState("")
    const [signo, setSigno] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [erros, setErros] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setCardProps({
            titulo: "Comece sua jornada entre as fases da Lua",
            subtitulo: "",
            linksRodape: [],
            variante: "cadastro"
        })
    }, [])

    const validar = () => {
        const novosErros = {}

        const nomeTrim = nome.trim()
        if (!nomeTrim)
            novosErros.nome = "Informe seu nome de exibição."
        else if (nomeTrim.length < 3)
            novosErros.nome = "O nome deve ter pelo menos 3 caracteres."
        else if (nomeTrim.length > 60)
            novosErros.nome = "O nome pode ter no máximo 60 caracteres."
        if (!email.trim())
            novosErros.email = "Informe seu e-mail."
        else if (!REGEX_EMAIL.test(email.trim()))
            novosErros.email = "Informe um e-mail válido."

        const ciclo = parseInt(duracaoCiclo)
        const menstruacao = parseInt(duracaoMenstruacao)

        if (!duracaoCiclo || isNaN(ciclo) || ciclo < 1)
            novosErros.duracaoCiclo = "Informe os dias do ciclo."

        if (!duracaoMenstruacao || isNaN(menstruacao) || menstruacao < 1)
            novosErros.duracaoMenstruacao = "Informe os dias de menstruação."

        if (duracaoCiclo && duracaoMenstruacao && !isNaN(ciclo) && !isNaN(menstruacao) && menstruacao >= ciclo)
            novosErros.duracaoMenstruacao = "A duração da menstruação deve ser menor que a duração do ciclo."

        if (!signo)
            novosErros.signo = "Selecione o seu signo."

        const erroSenha = validarSenha(senha)
        if (erroSenha)
            novosErros.senha = erroSenha

        if (!confirmarSenha.trim())
            novosErros.confirmarSenha = "Confirme sua senha."
        else if (senha && confirmarSenha && senha !== confirmarSenha)
            novosErros.confirmarSenha = "As senhas não coincidem."

        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    const aoCriarConta = async () => {
        if (!validar()) return
        setIsLoading(true)
        setErros(prev => ({ ...prev, geral: "" }))
        try {
            const resposta = await authService.criarConta({
                nome,
                email: email.toLowerCase(),
                duracaoCiclo: parseInt(duracaoCiclo),
                duracaoMenstruacao: parseInt(duracaoMenstruacao),
                signo,
                senha
            })

            if (resposta?.token) {
                localStorage.setItem("token", resposta.token)
                navigate("/home")
                return
            }

            await authService.login({ email: email.toLowerCase(), senha })
            navigate("/home")

        } catch (erro) {
            const mensagem = erro.message || ""

            if (
                erro.status === 409 ||
                mensagem.includes("e-mail já está em uso") ||
                mensagem.includes("email already") ||
                mensagem.includes("EMAIL_JA_CADASTRADO")
            ) {
                setErros(prev => ({
                    ...prev,
                    email: "Este e-mail já está em uso. Tente fazer login."
                }))
            } else {
                setErros(prev => ({
                    ...prev,
                    geral: "Ocorreu um erro ao criar a conta. Tente novamente."
                }))
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="criar-conta-conteudo">

            <div className="criar-conta-campo">
                <label className="criar-conta-label">Nome de exibição</label>
                <Input
                    variante="cadastro"
                    type="text"
                    placeholder="Digite como deseja ser chamada(o)"
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros(prev => ({ ...prev, nome: "" }))
                    }}
                    error={erros.nome}
                />
            </div>

            <div className="criar-conta-campo">
                <label className="criar-conta-label">E-mail</label>
                <Input
                    variante="cadastro"
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

            <div className="criar-conta-linha-dupla">
                <div className="criar-conta-campo">
                    <label className="criar-conta-label">Dias do ciclo</label>
                    <Input
                        variante="cadastro-numero"
                        type="number"
                        placeholder="ex: 28"
                        value={duracaoCiclo}
                        onChange={(e) => {
                            setDuracaoCiclo(e.target.value)
                            if (erros.duracaoCiclo) setErros(prev => ({ ...prev, duracaoCiclo: "" }))
                            if (erros.duracaoMenstruacao) setErros(prev => ({ ...prev, duracaoMenstruacao: "" }))
                        }}
                        error={erros.duracaoCiclo}
                    />
                </div>

                <div className="criar-conta-campo">
                    <label className="criar-conta-label">Dias menstruação</label>
                    <Input
                        variante="cadastro-numero"
                        type="number"
                        placeholder="ex: 5"
                        value={duracaoMenstruacao}
                        onChange={(e) => {
                            setDuracaoMenstruacao(e.target.value)
                            if (erros.duracaoMenstruacao) setErros(prev => ({ ...prev, duracaoMenstruacao: "" }))
                        }}
                        error={erros.duracaoMenstruacao}
                    />
                </div>
            </div>

            <div className="criar-conta-campo">
                <label className="criar-conta-label">Signo</label>
                <SelecaoSigno
                    value={signo}
                    onChange={(id) => {
                        setSigno(id)
                        if (erros.signo) setErros(prev => ({ ...prev, signo: "" }))
                    }}
                />
                {erros.signo && <span className="criar-conta-erro-signo">{erros.signo}</span>}
            </div>

            <div className="criar-conta-campo">
                <label className="criar-conta-label">Senha</label>
                <InputSenha
                    variante="cadastro"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value)
                        if (erros.senha) setErros(prev => ({ ...prev, senha: "" }))
                        if (erros.confirmarSenha) setErros(prev => ({ ...prev, confirmarSenha: "" }))
                    }}
                    error={erros.senha}
                />
            </div>

            <div className="criar-conta-campo">
                <label className="criar-conta-label">Confirmar senha</label>
                <InputSenha
                    variante="cadastro"
                    placeholder="Confirme a sua senha"
                    value={confirmarSenha}
                    onChange={(e) => {
                        setConfirmarSenha(e.target.value)
                        if (erros.confirmarSenha) setErros(prev => ({ ...prev, confirmarSenha: "" }))
                    }}
                    error={erros.confirmarSenha}
                />
            </div>

            {erros.geral && (
                <span className="criar-conta-erro-geral">{erros.geral}</span>
            )}

            <div className="criar-conta-botoes">
                <Button
                    variant="padrao"
                    onClick={() => navigate("/entrar")}
                    backgroundColor="linear-gradient(135deg, rgba(60, 80, 125, 0.18) 0%, rgba(17, 34, 80, 0.12) 100%)"
                    color="rgba(60, 80, 125, 0.4)"
                    textColor="rgba(245, 240, 233, 1)"
                    width="100%"
                    maxWidth="100%"
                >
                    ◇ Voltar
                </Button>

                <Button
                    variant="padrao"
                    onClick={aoCriarConta}
                    isLoading={isLoading}
                    backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                    color="rgba(224, 197, 143, 0.3)"
                    textColor="rgba(224, 197, 143, 1)"
                    width="100%"
                    maxWidth="100%"
                >
                    ◈ Criar conta
                </Button>
            </div>

        </div>
    )
}

export default CriarConta