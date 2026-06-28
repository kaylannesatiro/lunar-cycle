import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout' 
import Diario from './pages/Diario'
import Conta from './pages/Conta'
import Home from './pages/Home'
import Entrar from './pages/Entrar'

import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/entrar" element={<Entrar />} />
          </Route>

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home/>} />
            <Route path="diario" element={<Diario/>} />
            <Route path="conta" element={<Conta/>} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App;