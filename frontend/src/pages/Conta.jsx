import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/common/Buttons/Button'
import Input from '../components/common/Inputs/Input'
import InputSenha from '../components/common/Inputs/InputSenha'
import SelecaoSigno from '../components/common/Inputs/SelecaoSigno'
import CardConfig from '../components/common/Cards/CardConfig'
import './Conta.css';

const Conta = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    
    const [isSavingPerfil, setIsSavingPerfil] = useState(false)
    const [isSavingSeguranca, setIsSavingSeguranca] = useState(false)
    const [isSavingCiclo, setIsSavingCiclo] = useState(false)

    const [dados, setDados] = useState({
        nome: '',
        signo: '',
        email: '',
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: '',
        duracaoCiclo: 28,
        duracaoMenstruacao: 5
    });

    useEffect(() => {
        const carregarPerfil = async () => {
            try {
                const perfil = await authService.obterPerfil()
                setDados(prev => ({ ...prev, ...perfil }))
            } catch (error) {
                console.error("Erro ao carregar perfil:", error)
            } finally {
                setIsLoading(false)
            }
        }

        carregarPerfil()
    }, [])

    const atualizarDado = (campo, valor) => {
        setDados(prev => ({ ...prev, [campo]: valor }))
    }

    const handleSalvarPerfil = async () => {
        try {
            setIsSavingPerfil(true)
            await authService.atualizarPerfil({ nome: dados.nome, signo: dados.signo })
            alert("Perfil atualizado com sucesso!")
        } catch (error) {
            alert(error.message)
        } finally {
            setIsSavingPerfil(false)
        }
    }

    const handleSalvarSeguranca = async () => {
        if (dados.novaSenha && dados.novaSenha !== dados.confirmarNovaSenha) {
            return alert("A nova senha e a confirmação não coincidem.")
        }
        if (dados.novaSenha && !dados.senhaAtual) {
            return alert("Digite sua senha atual para alterar a senha.")
        }

        try {
            setIsSavingSeguranca(true) 
            const payload = { email: dados.email }

            if (dados.novaSenha) {
                payload.senhaAtual = dados.senhaAtual
                payload.novaSenha = dados.novaSenha
            }
            await authService.atualizarPerfil(payload)
            alert("Segurança atualizada com sucesso!")
            setDados(prev => ({ ...prev, senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' }));
        } catch (error) {
            alert(error.message)
        } finally {
            setIsSavingSeguranca(false) 
        }
    }

    const handleSalvarCiclo = async () => {
        try {
            setIsSavingCiclo(true) 
            await authService.atualizarPerfil({ 
                duracaoCiclo: Number(dados.duracaoCiclo), 
                duracaoMenstruacao: Number(dados.duracaoMenstruacao) 
            });
            alert("Ciclo atualizado com sucesso!")
        } catch (error) {
            alert(error.message)
        } finally {
            setIsSavingCiclo(false) 
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleExcluirConta = async () => {
        const confirmar = window.confirm("Tem certeza que deseja apagar sua conta? Todos os seus sonhos serão perdidos para sempre.")
        if (!confirmar) return

        try {
            await authService.excluirConta()
            localStorage.removeItem('token')
            navigate('/cadastro')
        } catch (error) {
            alert(`Erro ao excluir conta. Verifique com o suporte. + ${error.message}`)
        }
    }

    const camposPerfil = [
        {
            label: "NOME DE EXIBIÇÃO",
            input: (
                <Input 
                    type="text" 
                    variante="configuracao" 
                    value={dados.nome} 
                    onChange={(e) => atualizarDado('nome', e.target.value)} 
                />
            )
        },
        {
            label: "SIGNO",
            input: (
                <SelecaoSigno 
                    value={dados.signo} 
                    onChange={(valor) => atualizarDado('signo', valor)} 
                />
            )
        }
    ]

    const camposSeguranca = [
        {
            label: "EMAIL",
            input: (
                <Input 
                    type="email" 
                    variante="configuracao" 
                    value={dados.email} 
                    onChange={(e) => atualizarDado('email', e.target.value)} 
                />
            )
        },
        {
            label: "SENHA ATUAL",
            input: (
                <InputSenha 
                    variante="configuracao" 
                    placeholder="Digite a senha atual" 
                    value={dados.senhaAtual} 
                    onChange={(e) => atualizarDado('senhaAtual', e.target.value)} 
                />
            )
        },
        {
            label: "NOVA SENHA",
            input: (
                <InputSenha 
                    variante="configuracao" 
                    placeholder="Digite sua nova senha" 
                    value={dados.novaSenha} 
                    onChange={(e) => atualizarDado('novaSenha', e.target.value)} 
                />
            )
        },
        {
            label: "CONFIRMAR SENHA",
            input: (
                <InputSenha 
                    variante="configuracao" 
                    placeholder="Confirme sua nova senha" 
                    value={dados.confirmarNovaSenha} 
                    onChange={(e) => atualizarDado('confirmarNovaSenha', e.target.value)} 
                />
            )
        }
    ]

    const camposCiclo = [
        {
            label: "DIAS DO CICLO",
            input: (
                <Input 
                    type="number" 
                    variante="configuracao-numero" 
                    value={dados.duracaoCiclo} 
                    onChange={(e) => atualizarDado('duracaoCiclo', e.target.value)} 
                />
            )
        },
        {
            label: "DIAS DA MENSTRUAÇÃO",
            input: (
                <Input 
                    type="number" 
                    variante="configuracao-numero" 
                    value={dados.duracaoMenstruacao} 
                    onChange={(e) => atualizarDado('duracaoMenstruacao', e.target.value)} 
                />
            )
        }
    ]

    if (isLoading) return <div className="conta-loading">Acessando os registros...</div>;

    return (
        <div className="conta-page-container">
            <header className="conta-header">
                <div className="conta-badge-container">
                    <p className="conta-badge">✦ CONFIGURAÇÕES LUNARES ✦</p>
                </div>
                
                <div className="conta-titulo-container">
                    <h1 className="conta-titulo">PERSONALIZE SUA JORNADA<br/>CÓSMICA</h1>
                </div>
            </header>

            <div className="conta-conteudo">
                <CardConfig 
                    titulo="PERFIL" 
                    campos={camposPerfil} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarPerfil} 
                            isLoading={isSavingPerfil}
                            maxWidth="100%"
                        >
                            ◈ SALVAR PERFIL
                        </Button>
                    }
                />

                <CardConfig 
                    titulo="SEGURANÇA" 
                    campos={camposSeguranca} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarSeguranca} 
                            isLoading={isSavingSeguranca}
                            maxWidth="100%"
                        >
                            ◈ Atualizar credenciais
                        </Button>
                    }
                />

                <CardConfig 
                    titulo="CICLO" 
                    campos={camposCiclo} 
                    camposDuplos={true} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarCiclo} 
                            isLoading={isSavingCiclo}
                            maxWidth="100%"
                        >
                            ◈ Salvar ciclo
                        </Button>
                    }
                />

                <div className="conta-actions-footer">
                    <Button 
                        variant="redondo" 
                        backgroundColor="rgba(88, 8, 16, 0.22)" 
                        color="rgba(245, 240, 233, 0.50)" 
                        textColor="#F5F0E9"
                        onClick={handleExcluirConta}
                    >
                        ◈ APAGAR CONTA
                    </Button>
                    
                    <Button 
                        variant="redondo" 
                        color="#E0C58F" 
                        textColor="#F5F0E9"
                        onClick={handleLogout}
                    >
                        ◈ SAIR DA CONTA
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Conta