import './App.css'
import Menu from './components/common/Base/Menu'

const App = () => {
  return (
    <>
      <Menu links={[
        { titulo: 'Diário dos Sonhos', rota: '/' },
        { titulo: 'Calendário', rota: '/sobre' },
        { titulo: 'Conta', rota: '/contato' }
      ]} />
    </>
  )
}

export default App
