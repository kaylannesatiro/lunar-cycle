import './App.css'
import Menu from './components/common/Base/Menu'
import Background from './components/common/Base/Background'
import Footer from './components/common/Base/Footer'
import ModalSuporte from './components/common/Modals/ModalSuporte'
import arquivoDeModais from "./data/dadosModais.json";
import { useState } from 'react';

const App = () => {

  const [modalAberto, setModalAberto] = useState(false);
    
  const [tipoConteudo, setTipoConteudo] = useState("sobre");

  const abrirModal = (tipo) => {
      setTipoConteudo(tipo);
      setModalAberto(true);
  };

  const fecharModal = () => {
      setModalAberto(false);
  };

  const dadosSelecionadosParaOModal = arquivoDeModais[tipoConteudo];

  const linksNavegacao = [
    { titulo: 'Diário dos Sonhos', rota: '/diario' },
    { titulo: 'Calendário', rota: '/calendario' },
    { titulo: 'Conta', rota: '/conta' }
  ];

  return (
    <>
      <Background>
        <Menu links={linksNavegacao}/>

        <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={() => abrirModal("sobre")}>Sobre</button>
                <button onClick={() => abrirModal("privacidade")}>Privacidade</button>
                <button onClick={() => abrirModal("termos")}>Termos</button>
                <button onClick={() => abrirModal("contato")}>Contato</button>
            </div>

            <ModalSuporte 
                isOpen={modalAberto} 
                onClose={fecharModal} 
                dados={dadosSelecionadosParaOModal} 
            />
        </div>

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
