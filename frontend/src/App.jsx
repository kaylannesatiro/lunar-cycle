import './App.css';
import Background from './components/common/Base/Background';
import CardSonho from './components/features/Diario/CardSonho';
import CardOraculo from './components/features/Ciclo/CardOraculo';

function App() {
    return (
      <Background>
        <CardOraculo 
          diaDoCiclo={10}
          estaMenstruada={true}
        />
        
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