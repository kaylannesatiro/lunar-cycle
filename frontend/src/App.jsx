import CardConta from './components/common/Cards/CardConta';
import IconeLua from './assets/Icon-Modal.svg';
import Input from './components/common/Inputs/Input';
import Button from './components/common/Buttons/Button';
import Background from './components/common/Base/Background';
import InputSenha from './components/common/Inputs/InputSenha';
import SelecaoSigno from './components/common/Inputs/SelecaoSigno';
import './App.css';

function App() {
    return (
      <Background>
        <div style={{ padding: '50px', display: 'flex', gap: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CardConta 
                icone={IconeLua}
                titulo="Comece sua jornada entre as fases da Lua"
            >
              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Nome de exibição</span>
                <Input
                    placeholder="Digite como deseja ser chamada(o)" 
                />
              </label>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Email</span>
                <Input 
                    placeholder="Digite seu email" 
                />
              </label>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Dias do ciclo</span>
                <Input 
                    placeholder="ex: 28"
                    variante="cadastro-numero" 
                />
              </label>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Dias menstruação</span>
                <Input 
                    placeholder="ex: 5" 
                    variante="cadastro-numero"
                />
              </label>

              <SelecaoSigno/>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Senha</span>
                <InputSenha 
                    placeholder="Digite sua senha" 
                />
              </label>

              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Confirmar senha</span>
                <InputSenha 
                    placeholder="Confirme a sua senha" 
                />
              </label>

              <Button variant = 'padrao'>◇ Voltar</Button>
              <Button variant = 'padrao'>◈ Entrar</Button>
            </CardConta>
        </div>
      </Background>
    );
}

export default App;