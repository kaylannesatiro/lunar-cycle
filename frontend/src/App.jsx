import CardConta from './components/common/Cards/CardConta';
import IconeLua from './assets/Icon-Modal.svg';
import Input from './components/common/Inputs/Input';
import Button from './components/common/Buttons/Button';
import Background from './components/common/Base/Background';


function App() {
    return (
      <Background>
        <div style={{ padding: '50px', display: 'flex', gap: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CardConta 
                icone={IconeLua}
                titulo="BEM-VINDA AO SEU UNIVERSO LUNAR"
                subtitulo="Acompanhe seus ciclos sob a luz da Lua"
                linksRodape={[
                    { texto: "Esqueci a senha", rota: "/recuperar" },
                    { texto: "Criar conta", rota: "/cadastro" }
                ]}
            >
                <Input label="EMAIL" placeholder="DIGITE SEU EMAIL" />
                <Input label="SENHA" placeholder="DIGITE SUA SENHA" type="password" />
                <Button/>
            </CardConta>


            {/* TELA DE RECUPERAR SENHA (Usa o MESMO CardConta) */}
            <CardConta 
                icone={IconeLua}
                titulo="RECUPERE SUA CONEXÃO"
                subtitulo="Informe seu e-mail para receber o código de recuperação."
                // Repare que aqui não mandamos links de rodapé!
            >
                {/* Aqui o "children" é diferente */}
                <Input label="EMAIL" placeholder="DIGITE O E-MAIL DA SUA CONTA" />
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <Button variant="secundario">VOLTAR</Button>
                    <Button>ENVIAR</Button>
                </div>
            </CardConta>
        </div>
      </Background>
    );
}

export default App;