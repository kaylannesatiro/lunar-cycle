import './App.css';
import Background from './components/common/Base/Background';
import CardSonho from './components/features/Diario/CardSonho';

function App() {
    return (
      <Background>
        <CardSonho 
          faseLunar="crescente" 
          data="4"     
          titulo="O JARDIM DE CRISTAL"
          tags={["LÚCIDO", "NATUREZA", "PAZ", "LUZ"]}
        />
      </Background>
    );
}

export default App;