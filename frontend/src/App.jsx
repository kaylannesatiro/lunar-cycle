import CardConta from './components/common/Cards/CardConta';
import IconeLua from './assets/Icon-Modal.svg';
import Input from './components/common/Inputs/Input';
import Button from './components/common/Buttons/Button';
import Background from './components/common/Base/Background';
import InputSenha from './components/common/Inputs/InputSenha';
import './App.css';

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
              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">EMAIL</span>
                <Input
                    placeholder="DIGITE SEU EMAIL" 
                />
              </label>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">SENHA</span>
                <InputSenha 
                    placeholder="DIGITE SUA SENHA" 
                />
              </label>

              <Button variant = 'padrao'>◈ Entrar</Button>
            </CardConta>
        </div>
      </Background>
    );
}

export default App;