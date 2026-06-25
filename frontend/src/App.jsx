import './App.css';
import Background from './components/common/Base/Background';
import OraculoLunar from './components/features/Ciclo/CardOraculo';

function App() {

  const diaDoCicloDaUsuaria = 14; 
  const estaSangrando = false; 

    return (
      <Background>
        <OraculoLunar 
          diaDoCiclo={diaDoCicloDaUsuaria} 
          estaMenstruada={estaSangrando} 
        />
      </Background>
    );
}

export default App;