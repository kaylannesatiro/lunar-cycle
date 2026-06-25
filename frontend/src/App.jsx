import './App.css'
import Background from './components/common/Base/Background'
import CardConta from './components/common/Cards/CardConta'

const App = () => {
  return (
    <Background>
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >

        <CardConta/>
      </main>
    </Background>
  )
}

export default App