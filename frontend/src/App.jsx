import './App.css';
import Background from './components/common/Base/Background';
import LinhaDoTempo from './components/features/Diario/LinhaTempo';

function App() {
  const dadosMockDoBackend = [
    {
      mes: "JUNHO",
      ano: "2026",
      itens: [
        {
          id: 1,
          diaFormatado: "4",
          faseLunar: "Minguante",
          titulo: "O JARDIM DE CRISTAL",
          tags: ["LÚCIDO", "NATUREZA", "PAZ", "LUZ"]
        },
        {
          id: 2,
          diaFormatado: "2",
          faseLunar: "Quarto Minguante",
          titulo: "A Biblioteca Infinita",
          tags: ["misterioso", "infinito", "sabedoria", "profético"]
        }
      ]
    },
    {
      mes: "MAIO",
      ano: "2026",
      itens: [
        {
          id: 3,
          diaFormatado: "29",
          faseLunar: "Cheia",
          titulo: "Dança com a Lua",
          tags: ["Espiritual", "Dança", "Lua Cheia", "Êxtase"]
        },
        {
          id: 4,
          diaFormatado: "24",
          faseLunar: "Quarto Crescente",
          titulo: "As Portas do Amanhecer",
          tags: ["ranson", "meu", "amor"]
        }
      ]
    }
  ];

  return (
    <Background> 
      <div style={{ paddingTop: '4rem' }}>
        <LinhaDoTempo 
          sonhosAgrupados={dadosMockDoBackend} 
          isLoading={false} 
          onCardClick={(id) => console.log(`Clicou no sonho de ID: ${id}`)}
        />
      </div>
    </Background>
  );
}

export default App;