import './App.css';
import Background from './components/common/Base/Background';
import FiltroSonhos from './components/features/Diario/FiltroSonhos';

function App() {

  const [tagsCustomizadas, setTagsCustomizadas] = useState(["PESADELO", "LUCIDEZ EXTRA"]);

  const lidarComMudancaDeFiltro = (filtros) => {
    console.log("Filtros ativos no momento:", filtros);
  };

  return (
    <Background>
      <div style={{ padding: '2rem' }}>
        <FiltroSonhos 
          tagsDoUsuario={tagsCustomizadas} 
          onFilterChange={lidarComMudancaDeFiltro} 
        />
      </div>
    </Background>
  );
}

export default App;