import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<h1>Home</h1>} />
          <Route path="diario" element={<h1>Diário</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;