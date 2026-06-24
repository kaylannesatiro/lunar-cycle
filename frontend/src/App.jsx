import { useState } from 'react'
import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'
import SelecaoSigno from './components/common/Inputs/SelecaoSigno'

const App = () => {

  const [signoEscolhido, setSignoEscolhido] = useState('');

  return (
    <>
      <Background>
        <Menu links={[
          { titulo: 'Diário dos Sonhos', rota: '/diario' },
          { titulo: 'Calendário', rota: '/calendario' },
          { titulo: 'Conta', rota: '/conta' }
        ]} />

        <div style={{ padding: '50px', backgroundColor: '#040612', minHeight: '100vh' }}>
            <SelecaoSigno 
                value={signoEscolhido} 
                onChange={setSignoEscolhido} 
            />
        </div>

      </Background>
    </>
  )
}

export default App