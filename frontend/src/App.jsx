import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'
import Footer from './components/common/Base/Footer'

const App = () => {

  const linksNavegacao = [
    { titulo: 'Diário dos Sonhos', rota: '/diario' },
    { titulo: 'Calendário', rota: '/calendario' },
    { titulo: 'Conta', rota: '/conta' }
  ];

  return (
    <>
      <Background>
        <Menu links={linksNavegacao}/>

        <Footer links={linksNavegacao}/>

      </Background>
    </>
  )
}

export default App