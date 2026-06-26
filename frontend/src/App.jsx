import './App.css';
import Background from './components/common/Base/Background';
import OraculoLunar from './components/features/Ciclo/CardOraculo';

function App() {
    return (
      <Background>
        <div style={{ 
          width: '100%', 
          padding: '1rem', 
          boxSizing: 'border-box', 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <OraculoLunar diaDoCiclo={14} estaMenstruada={false} />
        </div>
      </Background>
    );
}

export default App;