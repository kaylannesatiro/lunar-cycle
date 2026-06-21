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

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px', 
          paddingTop: '60px',
          width: '100%'
        }}>
          
          <Button 
            variant="redondo" 
            icone={"◈"}
            onClick={() => console.log("Registrando...")}
            backgroundColor="rgba(110, 76, 163, 0.28)"
            color="#A58CFF">
            Registrar Menstruação
          </Button>

          <Button variant="padrao" icone={"◈"}>
            Salvar
          </Button>

          <Button variant="fechar" />

          <Button variant="padrao" isLoading={true}>
            Enviar
          </Button>

          <Button variant="padrao" color="#eadee2">
            Excluir Sonho
          </Button>

        </div>
      </Background>
    </>
  )
}

export default App
