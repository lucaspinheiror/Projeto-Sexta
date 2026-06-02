import { useNavigate } from 'react-router-dom'
import styles from './CadastroIdoso.module.css'

function CadastroIdoso() {

    const navigate = useNavigate();

    function irParaLoginIdoso() {
        navigate('/login')
    }


    function irParaTelaPrincipal() {
        navigate('/tela-principal')
    }

    return (
        <>
            <div className={styles['container-formulario']}>
                <h1>Cadastro Idoso</h1>
                <form action="" className={styles['formulario']}>
                    <div>
                        <p><label htmlFor="nome-idoso">Nome:</label></p>
                        <input type="text" id="nome-idoso" placeholder='Nome' />
                    </div>
                    <div>
                        <p><label htmlFor="idade-idoso">Idade:</label></p>
                        <input type="number" id="idade-idoso" placeholder='Idade' />
                    </div>
                    <div>
                        <p><label htmlFor="altura-idoso">Altura:</label></p>
                        <input type="number" id="altura-idoso" placeholder='Altura' />
                    </div>
                    <div>
                        <p><label htmlFor="peso-idoso">Peso:</label></p>
                        <input type="number" id="peso-idoso" placeholder='Peso' />
                    </div>
                    <div>
                        <p><label htmlFor="senha-idoso">Senha:</label></p>
                        <input type="text" id="senha-idoso" placeholder='Senha' />
                    </div>
                    <button onClick={irParaTelaPrincipal}>Cadastrar</button>
                    <span onClick={irParaLoginIdoso}>Já é cadastrado?</span>
                </form>
            </div>
        </>
    )
}

export default CadastroIdoso