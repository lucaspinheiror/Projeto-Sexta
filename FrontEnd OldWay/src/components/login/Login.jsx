import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

const LOGIN_ENDPOINT = 'http://127.0.0.1:8000/idoso/login'

function Login() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function irParaCadastroIdoso() {
    navigate('/')
  }

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !senha.trim()) {
      setErro('Informe nome e senha para continuar.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome.trim(),
          senha
        })
      })

      if (!response.ok) {
        setErro('Nome ou senha inválidos.')
        return
      }

      const dadosLogin = await response.json()
      const nomeIdoso = dadosLogin?.nome || nome.trim()

      navigate('/tela-principal', { state: { nomeIdoso } })
    } catch {
      setErro('Não foi possível conectar ao backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['container-formulario']}>
      <h1>Login Idoso</h1>

      <form
        className={styles.formulario}
        onSubmit={handleLogin}
      >
        <div>
          <label htmlFor="Nome">Nome</label>
          <input
            type="text"
            id="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="Senha">Senha</label>
          <input
            type="password"
            id="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={8}
            maxLength={100}
            required
          />
        </div>

        {erro && (
          <p className={styles.erro}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <span onClick={irParaCadastroIdoso}>
          Não é cadastrado?
        </span>
      </form>
    </div>
  )
}

export default Login
