import { Routes, Route } from 'react-router-dom'
import Login from './components/login/Login.jsx'
import CadastroParente from './components/cadastro/CadastroParente.jsx'
import CadastroIdoso from './components/cadastro-idoso/CadastroIdoso.jsx'
import Calendario from './components/tela-principal/TelaPrincipal.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CadastroIdoso />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro-parente" element={<CadastroParente />} />
      <Route path="/tela-principal" element={<Calendario />} />
    </Routes>
  )
}

export default App