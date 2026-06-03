import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CadastroIdoso.module.css'

const CADASTRO_ENDPOINT = 'http://127.0.0.1:8000/idoso/criar'

function CadastroIdoso() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function irParaLoginIdoso() {
    navigate('/login')
  }

  function montarPayloadIdoso() {
    return {
      nome: nome.trim(),
      altura: altura === '' ? null : Number(altura),
      idade: idade === '' ? null : Number(idade),
      peso: peso === '' ? null : Number(peso),
      senha
    }
  }

  function validarPayloadIdoso(payload) {
    if (!payload.nome) {
      return 'Informe o nome.'
    }

    if (payload.nome.length > 200) {
      return 'O nome deve ter no máximo 200 caracteres.'
    }

    if (payload.altura !== null && (Number.isNaN(payload.altura) || payload.altura <= 0 || payload.altura > 3)) {
      return 'A altura deve estar entre 0 e 3.'
    }

    if (payload.idade !== null && (Number.isNaN(payload.idade) || payload.idade < 60 || payload.idade > 130)) {
      return 'A idade deve estar entre 60 e 130.'
    }

    if (payload.peso !== null && (Number.isNaN(payload.peso) || payload.peso <= 0 || payload.peso > 300)) {
      return 'O peso deve estar entre 0 e 300.'
    }

    if (!payload.senha) {
      return 'Informe a senha.'
    }

    if (payload.senha.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres.'
    }

    if (payload.senha.length > 100) {
      return 'A senha deve ter no máximo 100 caracteres.'
    }

    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const payloadIdoso = montarPayloadIdoso()
    const erroValidacao = validarPayloadIdoso(payloadIdoso)

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    try {
      setLoading(true)

      const response = await fetch(CADASTRO_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadIdoso)
      })

      if (!response.ok) {
        setErro('Não foi possível cadastrar o idoso.')
        return
      }

      navigate('/login')
    } catch {
      setErro('Não foi possível conectar ao backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['container-formulario']}>
      <h1>Cadastro Idoso</h1>

      <form className={styles.formulario} onSubmit={handleSubmit}>
        <div>
          <p><label htmlFor="nome-idoso">Nome:</label></p>
          <input
            type="text"
            id="nome-idoso"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div>
          <p><label htmlFor="idade-idoso">Idade:</label></p>
          <input
            type="number"
            id="idade-idoso"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            min={60}
            max={130}
          />
        </div>

        <div>
          <p><label htmlFor="altura-idoso">Altura:</label></p>
          <input
            type="number"
            id="altura-idoso"
            placeholder="Altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            min={0}
            max={3}
            step="0.01"
          />
        </div>

        <div>
          <p><label htmlFor="peso-idoso">Peso:</label></p>
          <input
            type="number"
            id="peso-idoso"
            placeholder="Peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            min={0}
            max={300}
            step="0.01"
          />
        </div>

        <div>
          <p><label htmlFor="senha-idoso">Senha:</label></p>
          <input
            type="password"
            id="senha-idoso"
            placeholder="Senha"
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

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <span onClick={irParaLoginIdoso}>
          Já é cadastrado?
        </span>
      </form>
    </div>
  )
}

export default CadastroIdoso
