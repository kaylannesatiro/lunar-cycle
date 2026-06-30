import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout' 
import PublicLayout from './layouts/PublicLayout'

import RotaProtegida from './components/common/Security/RotaProtegida'

import Diario from './pages/private/Diario'
import CalendarioPage from './pages/private/Calendario'
import Conta from './pages/private/Conta'
import Home from './pages/private/Home'

import Entrar from './pages/public/Entrar'
import CriarConta from './pages/public/CriarConta'
import HomePublic from './pages/public/Home'

import './App.css'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Rotas de login */}
          <Route element={<AuthLayout />}>
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/criar-conta" element={<CriarConta />} />
          </Route>

          {/* Rotas públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/public" element={<HomePublic />} /> 
          </Route>

          {/* Rotas privadas */}
          <Route element={<RotaProtegida />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home/>} />
              <Route path="diario" element={<Diario/>} />
              <Route path="conta" element={<Conta/>} />
              <Route path="calendario" element={<CalendarioPage/>} />
            </Route>
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App