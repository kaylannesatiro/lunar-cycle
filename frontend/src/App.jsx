import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'

const App = () => {
  return (
    <>
      <Background>
        <Menu links={[
          { titulo: 'Diário dos Sonhos', rota: '/diario' },
          { titulo: 'Calendário', rota: '/calendario' },
          { titulo: 'Conta', rota: '/conta' }
        ]} />
      </Background>
    </>
  )
}

export default App