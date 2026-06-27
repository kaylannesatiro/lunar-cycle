import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/common/Buttons/Button';
import CardConfig from '../../components/features/Conta/CardConfig';
import './Conta.css';

const Conta = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    const signos = [
        { id: 'Aries', icone: '♈' }, { id: 'Touro', icone: '♉' }, { id: 'Gemeos', icone: '♊' },
        { id: 'Cancer', icone: '♋' }, { id: 'Leao', icone: '♌' }, { id: 'Virgem', icone: '♍' },
        { id: 'Libra', icone: '♎' }, { id: 'Escorpiao', icone: '♏' }, { id: 'Sagitario', icone: '♐' },
        { id: 'Capricornio', icone: '♑' }, { id: 'Aquario', icone: '♒' }, { id: 'Peixes', icone: '♓' }
    ];

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setIsLoading(true);
            const perfil = await authService.obterPerfil();
            setDados(prev => ({ ...prev, ...perfil }));
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDados(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvarPerfil = async () => {
        try {
            setIsSaving(true);
            await authService.atualizarPerfil({ nome: dados.nome, signo: dados.signo });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSalvarSeguranca = async () => {
        if (dados.novaSenha && dados.novaSenha !== dados.confirmarNovaSenha) {
            return alert("A nova senha e a confirmação não coincidem.");
        }
        if (dados.novaSenha && !dados.senhaAtual) {
            return alert("Digite sua senha atual para alterar a senha.");
        }

        try {
            setIsSaving(true);
            const payload = { email: dados.email };
            if (dados.novaSenha) {
                payload.senhaAtual = dados.senhaAtual;
                payload.novaSenha = dados.novaSenha;
            }
            await authService.atualizarPerfil(payload);
            alert("Segurança atualizada com sucesso!");
            setDados(prev => ({ ...prev, senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' }));
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSalvarCiclo = async () => {
        try {
            setIsSaving(true);
            await authService.atualizarPerfil({ 
                duracaoCiclo: Number(dados.duracaoCiclo), 
                duracaoMenstruacao: Number(dados.duracaoMenstruacao) 
            });
            alert("Ciclo atualizado com sucesso!");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleExcluirConta = async () => {
        const confirmar = window.confirm("Tem certeza que deseja apagar sua conta? Todos os seus sonhos serão perdidos para sempre.");
        if (!confirmar) return;

        try {
            await authService.excluirConta();
            localStorage.removeItem('token');
            navigate('/cadastro');
        } catch (error) {
            alert("Erro ao excluir conta. Verifique com o suporte.");
        }
    };

    // ─── CONFIGURAÇÃO DOS ARRAYS DE CAMPOS PARA O SEU COMPONENTE ───

    const camposPerfil = [
        {
            label: "NOME DE EXIBIÇÃO",
            input: <input className="conta-input-estilizado" type="text" name="nome" value={dados.nome} onChange={handleChange} />
        },
        {
            label: "SIGNO",
            input: (
                <div className="signos-grid">
                    {signos.map(s => (
                        <button 
                            key={s.id} 
                            className={`signo-btn ${dados.signo === s.id ? 'ativo' : ''}`}
                            onClick={() => setDados({ ...dados, signo: s.id })}
                            title={s.id}
                        >
                            {s.icone}
                        </button>
                    ))}
                </div>
            )
        }
    ];

    const camposSeguranca = [
        {
            label: "EMAIL",
            input: <input className="conta-input-estilizado" type="email" name="email" value={dados.email} onChange={handleChange} />
        },
        {
            label: "SENHA ATUAL (Obrigatória para alterar senha)",
            input: <input className="conta-input-estilizado" type="password" name="senhaAtual" placeholder="Digite a senha atual" value={dados.senhaAtual} onChange={handleChange} />
        },
        {
            label: "NOVA SENHA",
            input: <input className="conta-input-estilizado" type="password" name="novaSenha" placeholder="Digite sua nova senha" value={dados.novaSenha} onChange={handleChange} />
        },
        {
            label: "CONFIRMAR SENHA",
            input: <input className="conta-input-estilizado" type="password" name="confirmarNovaSenha" placeholder="Confirme sua nova senha" value={dados.confirmarNovaSenha} onChange={handleChange} />
        }
    ];

    const camposCiclo = [
        {
            label: "DIAS DO CICLO",
            input: <input className="conta-input-estilizado" type="number" name="duracaoCiclo" value={dados.duracaoCiclo} onChange={handleChange} />
        },
        {
            label: "DIAS DA MENSTRUAÇÃO",
            input: <input className="conta-input-estilizado" type="number" name="duracaoMenstruacao" value={dados.duracaoMenstruacao} onChange={handleChange} />
        }
    ];

    if (isLoading) return <div className="conta-loading">Acessando os registros akáshicos...</div>;

    return (
        <div className="conta-page-container">
            <header className="conta-header">
                <p className="conta-badge">✦ CONFIGURAÇÕES LUNARES ✦</p>
                <h1 className="conta-titulo">PERSONALIZE SUA JORNADA<br/>CÓSMICA</h1>
            </header>

            <div className="conta-conteudo">
                
                {/* 1. PERFIL */}
                <CardConfig 
                    titulo="PERFIL" 
                    campos={camposPerfil} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarPerfil} 
                            isLoading={isSaving}
                            backgroundColor="rgba(165, 140, 255, 0.05)"
                            color="rgba(165, 140, 255, 0.4)"
                            textColor="#D7CCFF"
                        >
                            ✦ SALVAR PERFIL
                        </Button>
                    }
                />

                {/* 2. SEGURANÇA */}
                <CardConfig 
                    titulo="SEGURANÇA" 
                    campos={camposSeguranca} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarSeguranca} 
                            isLoading={isSaving}
                            backgroundColor="rgba(165, 140, 255, 0.05)"
                            color="rgba(165, 140, 255, 0.4)"
                            textColor="#D7CCFF"
                        >
                            ✦ ATUALIZAR CREDENCIAIS
                        </Button>
                    }
                />

                {/* 3. CICLO (Aproveitando a prop camposDuplos para dividir as colunas!) */}
                <CardConfig 
                    titulo="CICLO" 
                    campos={camposCiclo} 
                    camposDuplos={true} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarCiclo} 
                            isLoading={isSaving}
                            backgroundColor="rgba(165, 140, 255, 0.05)"
                            color="rgba(165, 140, 255, 0.4)"
                            textColor="#D7CCFF"
                        >
                            ✦ SALVAR CICLO
                        </Button>
                    }
                />

                {/* BOTÕES DE PERIGO/SAÍDA */}
                <div className="conta-actions-footer">
                    <Button 
                        variant="padrao" 
                        backgroundColor="rgba(255, 68, 68, 0.1)" 
                        color="rgba(255, 68, 68, 0.4)" 
                        textColor="#FF8888"
                        onClick={handleExcluirConta}
                    >
                        ⊗ APAGAR CONTA
                    </Button>
                    <Button 
                        variant="padrao" 
                        backgroundColor="transparent" 
                        color="rgba(165, 140, 255, 0.3)" 
                        textColor="#D7CCFF"
                        onClick={handleLogout}
                    >
                        ⊗ SAIR DA CONTA
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Conta;