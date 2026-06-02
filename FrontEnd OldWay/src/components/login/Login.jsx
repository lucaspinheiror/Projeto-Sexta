import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

function Login() {

  const navigate = useNavigate();

  function irParaCadastroIdoso() {
    navigate('/')
  }

  function irParaTelaPrincipal() {
    navigate('/tela-principal')
  }
  
  return (
    <>
      <div className={styles['container-formulario']}>
        <h1>Login Idoso</h1>
        <form action="" className={styles['formulario']}>
          <div>
            <p><label htmlFor="Nome">Nome:</label></p>
            <input type="text" id="Nome" placeholder='Nome' />
          </div>
          <div>
            <p><label htmlFor="Senha">Senha:</label></p>
            <input type="text" id="Senha" placeholder='Senha' />
          </div>
          <button onClick={irParaTelaPrincipal}>Login</button>
          <span onClick={irParaCadastroIdoso}>Não é cadastrado?</span>
        </form>
      </div>
    </>
  )
}

export default Login