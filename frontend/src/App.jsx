import CardConta from './components/common/Cards/CardConta';
import Input from './components/common/Inputs/Input';
import Button from './components/common/Buttons/Button';
import Background from './components/common/Base/Background';
import './App.css';

function App() {
    return (
      <Background>
        <div style={{ padding: '50px', display: 'flex', gap: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CardConta 
                titulo="Recupere sua conexão"
                subtitulo="Informe seu email para receber o código de recuperação."
            >
              <label className="card-conta-grupo-input">
                <span className="card-conta-texto-label">Emailo</span>
                <Input
                    placeholder="Digite o e-mail da sua conta" 
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