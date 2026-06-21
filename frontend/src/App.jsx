import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'
import Button from './components/common/Buttons/Button'

const App = () => {
  return (
    <>
      <Background>
        <Menu links={[
          { titulo: 'Diário dos Sonhos', rota: '/diario' },
          { titulo: 'Calendário', rota: '/calendario' },
          { titulo: 'Conta', rota: '/conta' }
        ]} />

        <Button 
          variant="redondo" 
          icone={<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 0L10 5L5 10L0 5L5 0Z" fill="#E0C58F"/></svg>}
          onClick={() => console.log("Registrando...")}
        >
          Registrar Menstruação
        </Button>

        <Button variant="padrao">
          Salvar
        </Button>

        <Button variant="fechar" />

        <Button variant="padrao" isLoading={true}>
          Enviar
        </Button>

        <Button variant="padrao" color="#FF6B6B">
          Excluir Sonho
        </Button>
      </Background>
    </>
  )
}

export default App
