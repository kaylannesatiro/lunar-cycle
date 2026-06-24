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

/*
Teste de muito conteúdo na página:
<main className="main-content">
          <h1 style={{color: 'white'}}>Bem-vindo ao Lunar Cycle</h1>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
          <img src="https://inovaveterinaria.com.br/wp-content/uploads/2015/04/gato-sem-raca-INOVA-scaled.jpg" alt="" style={{width:'600px'}}/>
        </main>
*/