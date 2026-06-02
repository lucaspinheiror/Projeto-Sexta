import { useNavigate } from 'react-router-dom'
import styles from './CadastroParente.module.css'

function CadastroParente() {

  return (
    <>
      <div className={styles['container-formulario']}>
        <h1>Cadastro Familiar</h1>
        <form action="" className={styles['formulario']}>
            <div>
                <p><label htmlFor="Nome">Nome:</label></p>
                <input type="text" id="Nome" placeholder='Nome'/>
            </div>
            <div>
                <p><label htmlFor="Idade">Idade:</label></p>
                <input type="number" id="Idade" placeholder='Idade'/>
            </div>
            <div>
                <p><label htmlFor="Parentesco">Parentesco:</label></p>
                <input type="text" id="Parentesco" placeholder='Parentesco'/>
            </div>
            <div>
                <p><label htmlFor="Telefone">Telefone:</label></p>
                <input type="number" id="Telefone" placeholder='Telefone'/>
            </div>
            <div>
                <p><label htmlFor="Senha">Senha:</label></p>
                <input type="text" id="Senha" placeholder='Senha'/>
            </div>
            <button>Cadastrar</button>
            {/* <span onClick={irParaLogin}>Já é cadastrado?</span> */}
        </form>
      </div>
    </>
  )
}

export default CadastroParente