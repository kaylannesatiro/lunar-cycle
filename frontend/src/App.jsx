import { useState } from 'react'
import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'
import Footer from './components/common/Base/Footer'
import TextArea from './components/common/Inputs/TextArea'

const App = () => {
  const [texto, setTexto] = useState('')

  const linksNavegacao = [
    { titulo: 'Diário dos Sonhos', rota: '/diario' },
    { titulo: 'Calendário', rota: '/calendario' },
    { titulo: 'Conta', rota: '/conta' }
  ]

  return (
    <Background>
      <Menu links={linksNavegacao} />

      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <TextArea
          placeholder="Digite seu sonho..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          limiteCaracteres={200}
        />
      </main>

      <Footer links={linksNavegacao} />
    </Background>
  )
}

export default App