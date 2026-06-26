import './App.css';
import Background from './components/common/Base/Background';
import CardSonho from './components/features/Diario/CardSonho';

function App() {
    return (
      <Background> 
        <CardSonho 
          faseLunar="Minguante" 
          data="4"     
          titulo="O JARDIM DE CRISTAL"
          tags={["LÚCIDO", "NATUREZA", "PAZ", "LUZ"]}
        />

        <CardSonho 
          faseLunar="Quarto Minguante" 
          data="2"     
          titulo="A Biblioteca Infinita"
          tags={["misterioso", "infinito", "sabedoria", "profético"]}
        />

        <CardSonho 
          faseLunar="Cheia" 
          data="29"     
          titulo="Dança com a Lua"
          tags={["Espiritual", "Dança", "Lua Cheia", "Êxtase"]}
        />

        <CardSonho 
          faseLunar="Quarto Crescente" 
          data="24"     
          titulo="As Portas do Amanhecer"
          tags={["ranson", "meu", "amor"]}
        />
      </Background>
    );
}

export default App;