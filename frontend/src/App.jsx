import './App.css'
import Menu from './components/common/Base/Menu'

const App = () => {
  return (
    <>
      <Menu links={[
        { titulo: 'Diário dos Sonhos', rota: '/diario' },
        { titulo: 'Calendário', rota: '/calendario' },
        { titulo: 'Conta', rota: '/conta' }
      ]} />
    </>
  )
}

export default App
