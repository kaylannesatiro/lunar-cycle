import './App.css';
import Background from './components/common/Base/Background';
import CardSonho from './components/features/Diario/CardSonho';

function App() {
    return (
      <Background> 
        <CardSonho 
          faseLunar="Crescente" 
          data="4"     
          titulo="O JARDIM DE CRISTAL"
          tags={["LÚCIDO", "NATUREZA", "PAZ", "LUZ"]}
        />

        <CardSonho 
          faseLunar="Minguante" 
          data="8"     
          titulo="as bolas roxas"
          tags={["cebola", "luz", "jesus"]}
        />

        <CardSonho 
          faseLunar="Cheia" 
          data="28"     
          titulo="grandes amigos"
          tags={["vacas gordas", "anjos"]}
        />

        <CardSonho 
          faseLunar="Nova" 
          data="31"     
          titulo="limao com sal"
          tags={["ranson", "meu", "amor"]}
        />
      </Background>
    );
}

export default App;