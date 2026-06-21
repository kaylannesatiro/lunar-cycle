import './App.css'
import Menu from './components/common/Base/Menu.jsx'

const links = [
  { titulo: 'Diário dos Sonhos', rota: '#diario' },
  { titulo: 'Calendário', rota: '#calendario' },
  { titulo: 'Conta', rota: '#conta' },
]

const App = () => {
  return (
    <main className="app-shell">
      <Menu links={links} />

      <section className="app-shell__content">
        <h1>Lunar Cycle</h1>
        <p>Menu conectado para teste visual.</p>
      </section>
    </main>
  )
}

export default App
