import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './TelaPrincipal.module.css'

const ENDPOINT_IDOSO = 'http://127.0.0.1:8000/idoso'
const ENDPOINT_PARENTES = 'http://127.0.0.1:8000/parente'
const ENDPOINT_REMEDIOS = 'http://127.0.0.1:8000/remedio'
const ENDPOINT_CONSULTAS = 'http://127.0.0.1:8000/consulta'
const ENDPOINT_BUSCAR_NOME = 'http://127.0.0.1:8000/idoso/buscarnome'

const idosoInicial = {
  id: '',
  nome: '',
  idade: '',
  altura: '',
  peso: '',
  senha: ''
} 

const membroInicial = {
  nome: '',
  idade: '',
  parentesco: '',
  telefone: ''
}

const remedioInicial = {
  nome: '',
  dosagem: '',
  instrucoes: ''
}

const parentesExemplo = [
  {
    nome: 'Maria Oliveira',
    idade: 42,
    parentesco: 'filho',
    telefone: '(11) 98888-1234'
  },
  {
    nome: 'Pedro Santos',
    idade: 38,
    parentesco: 'outro',
    telefone: '(11) 97777-5678'
  }
]

const remediosExemplo = [
  {
    nome: 'Losartana',
    dosagem: '50mg',
    instrucoes: 'Tomar 1 comprimido pela manhã.'
  },
  {
    nome: 'Metformina',
    dosagem: '850mg',
    instrucoes: 'Tomar após o almoço.'
  }
]

const consultaInicial = {
  medico: '',
  local: '',
  horario: '',
  responsavel: '',
  observacao: ''
}

const agendaRemedioInicial = {
  nomeRemedio: '',
  horario: '',
  responsavel: '',
  observacao: ''
}

function lerCookie(nome) {
  const valor = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${nome}=`))

  return valor ? decodeURIComponent(valor.split('=')[1]) : ''
}

function obterIdosoIdDoCookie() {
  const chavesPossiveis = ['idosoId', 'id_idoso', 'idIdoso', 'id']
  for (const chave of chavesPossiveis) {
    const valor = lerCookie(chave)
    if (valor) {
      return valor
    }
  }
  return ''
}

async function requisitarJSON(url, options = {}) {
  let response

  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Não foi possível conectar com a API. Verifique se o backend está rodando e tente novamente.')
  }

  const contentType = response.headers.get('content-type') || ''
  let dados = null

  if (contentType.includes('application/json')) {
    try {
      dados = await response.json()
    } catch {
      dados = null
    }
  } else {
    const texto = await response.text()
    dados = texto ? texto : null
  }

  if (!response.ok) {
    const mensagem =
      dados?.detail ||
      dados?.message ||
      dados?.error ||
      'Não foi possível concluir a operação.'

    throw new Error(mensagem)
  }

  return dados
}

function avisarErroApi(error, setErroGlobal) {
  const mensagem = error.message || 'Não foi possível concluir a operação.'
  setErroGlobal(mensagem)
  alert(mensagem)
}

function normalizarLista(dados) {
  if (Array.isArray(dados)) {
    return dados
  }

  return dados?.items || dados?.data || []
}

function normalizarParente(item) {
  return item
}

function normalizarRemedio(item) {
  return {
    ...item,
    nome: item.nome || item.nome_remedio || '',
    instrucoes: item.instrucoes || item.horario || ''
  }
}

function montarDataConsulta(dia, horario) {
  const [hora = '00', minuto = '00'] = horario.split(':')
  return new Date(2026, 5, Number(dia), Number(hora), Number(minuto)).toISOString()
}

async function criarExemplosSeListaVazia(lista, url, exemplos, montarPayload, normalizar = (item) => item) {
  if (lista.length > 0) {
    return lista
  }

  const criados = await Promise.all(
    exemplos.map((exemplo) =>
      requisitarJSON(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(montarPayload(exemplo))
      })
    )
  )

  return criados.map((criado, index) => normalizar(criado || exemplos[index]))
}

function TelaPrincipal() {
  const location = useLocation()
  const nomeIdosoLogin = location.state?.nomeIdoso || ''

  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [seccaoMenu, setSeccaoMenu] = useState('calendario')
  const [modalAtiva, setModalAtiva] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erroGlobal, setErroGlobal] = useState('')

  const [idosoId, setIdosoId] = useState('')
  const [nomeIdoso, setNomeIdoso] = useState('')
  const [idosoIdPeloNome, setIdosoIdPeloNome] = useState('')
  const [idoso, setIdoso] = useState(idosoInicial)

  const [membrosFamilia, setMembrosFamilia] = useState([])
  const [membroForm, setMembroForm] = useState(membroInicial)
  const [membroEditandoIndex, setMembroEditandoIndex] = useState(null)

  const [remedios, setRemedios] = useState([])
  const [remedioForm, setRemedioForm] = useState(remedioInicial)
  const [remedioEditandoIndex, setRemedioEditandoIndex] = useState(null)

  const [consultaForm, setConsultaForm] = useState(consultaInicial)
  const [consultaEditandoIndex, setConsultaEditandoIndex] = useState(null)

  const [agendaRemedioForm, setAgendaRemedioForm] = useState(agendaRemedioInicial)
  const [agendaRemedioEditandoIndex, setAgendaRemedioEditandoIndex] = useState(null)

  const [tarefas, setTarefas] = useState({
    5: [
      {
        titulo: 'Consulta Cardiologista',
        horario: '14:00',
        tipo: 'Consulta',
        responsavel: 'Maria',
        local: 'Hospital Santa Luzia',
        observacao: 'Levar os exames de sangue passados.'
      }
    ],
    12: [
      {
        titulo: 'Losartana (50mg)',
        horario: '08:00',
        tipo: 'Remédio',
        responsavel: 'Pedro',
        observacao: 'Tomar em jejum com um copo de água.'
      }
    ]
  })

  const dias = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), [])

  useEffect(() => {
    const id = obterIdosoIdDoCookie()

    async function buscarIdPorNome() {
      if (!nomeIdosoLogin) {
        setErroGlobal('Cookie do idoso não encontrado. Faça login novamente.')
        setCarregando(false)
        return
      }

      try {
        const dadosBuscaNome = await requisitarJSON(`${ENDPOINT_BUSCAR_NOME}?nome=${encodeURIComponent(nomeIdosoLogin)}`)
        if (dadosBuscaNome?.id) {
          setIdosoId(dadosBuscaNome.id.toString())
          setNomeIdoso(dadosBuscaNome.nome || nomeIdosoLogin)
          setIdosoIdPeloNome(dadosBuscaNome.id.toString())
        } else {
          setErroGlobal('Não foi possível encontrar o idoso pelo nome.')
          setCarregando(false)
        }
      } catch (error) {
        setErroGlobal(error.message || 'Não foi possível encontrar o idoso pelo nome.')
        setCarregando(false)
      }
    }

    if (id) {
      setIdosoId(id)
      return
    }

    buscarIdPorNome()
  }, [nomeIdosoLogin])

  useEffect(() => {
    if (!idosoId) {
      return
    }

    async function carregarDados() {
      try {
        setCarregando(true)
        setErroGlobal('')

        const [dadosIdoso, dadosParentes, dadosRemedios, dadosBuscaNome] = await Promise.all([
          requisitarJSON(`${ENDPOINT_IDOSO}/listar/${idosoId}`),
          requisitarJSON(`${ENDPOINT_PARENTES}/listar`),
          requisitarJSON(`${ENDPOINT_REMEDIOS}/listar`),
          requisitarJSON(`${ENDPOINT_BUSCAR_NOME}?nome=${encodeURIComponent(nomeIdosoLogin)}`)
        ])
        const idosoIdNumerico = Number(idosoId)
        const parentesDoIdoso = normalizarLista(dadosParentes)
          .filter((parente) => Number(parente.idoso_id) === idosoIdNumerico)
          .map(normalizarParente)
        const remediosDoIdoso = normalizarLista(dadosRemedios)
          .filter((remedio) => Number(remedio.idoso_id) === idosoIdNumerico)
          .map(normalizarRemedio)

        const parentes = await criarExemplosSeListaVazia(
          parentesDoIdoso,
          `${ENDPOINT_PARENTES}/criar`,
          parentesExemplo,
          (parente) => ({ ...parente, idoso_id: idosoIdNumerico }),
          normalizarParente
        )
        const remediosCadastrados = await criarExemplosSeListaVazia(
          remediosDoIdoso,
          `${ENDPOINT_REMEDIOS}/criar`,
          remediosExemplo,
          (remedio) => ({
            idoso_id: idosoIdNumerico,
            nome_remedio: remedio.nome,
            dosagem: remedio.dosagem,
            horario: remedio.instrucoes || null
          }),
          normalizarRemedio
        )

        setNomeIdoso(dadosBuscaNome?.nome || nomeIdosoLogin || '')
        setIdosoIdPeloNome(dadosBuscaNome?.id?.toString?.() || '')
        setIdoso({
          id: dadosIdoso?.id || idosoId,
          nome: dadosIdoso?.nome || '',
          idade: dadosIdoso?.idade?.toString() || '',
          altura: dadosIdoso?.altura?.toString() || '',
          peso: dadosIdoso?.peso?.toString() || '',
          senha: ''
        })

        setMembrosFamilia(parentes)
        setRemedios(remediosCadastrados)
      } catch (error) {
        setErroGlobal(error.message || 'Não foi possível carregar os dados do idoso.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [idosoId, nomeIdosoLogin])

  function fecharModal() {
    setModalAtiva(null)
    setMembroEditandoIndex(null)
    setRemedioEditandoIndex(null)
    setConsultaEditandoIndex(null)
    setAgendaRemedioEditandoIndex(null)
  }

  function fecharDiaSelecionado() {
    setDiaSelecionado(null)
    fecharModal()
  }

  function abrirModalParenteCriar() {
    setMembroForm(membroInicial)
    setMembroEditandoIndex(null)
    setModalAtiva('parente-criar')
  }

  function abrirModalParenteEditar(index) {
    setMembroForm(membrosFamilia[index] || membroInicial)
    setMembroEditandoIndex(index)
    setModalAtiva('parente-editar')
  }

  function abrirModalRemedioCriar() {
    setRemedioForm(remedioInicial)
    setRemedioEditandoIndex(null)
    setModalAtiva('remedio-criar')
  }

  function abrirModalRemedioEditar(index) {
    setRemedioForm(remedios[index] || remedioInicial)
    setRemedioEditandoIndex(index)
    setModalAtiva('remedio-editar')
  }

  function abrirModalIdosoEditar() {
    setModalAtiva('idoso-editar')
  }

  function abrirModalConsultaCriar() {
    setConsultaForm(consultaInicial)
    setConsultaEditandoIndex(null)
    setModalAtiva('consulta-criar')
  }

  function abrirModalConsultaEditar(index) {
    const tarefa = tarefas[diaSelecionado]?.[index]
    if (!tarefa) {
      return
    }

    const medicoLimpo = tarefa.titulo.replace('Consulta: ', '')
    setConsultaForm({
      medico: medicoLimpo,
      local: tarefa.local || '',
      horario: tarefa.horario || '',
      responsavel: tarefa.responsavel === 'Não informado' ? '' : tarefa.responsavel,
      observacao: tarefa.observacao || ''
    })
    setConsultaEditandoIndex(index)
    setModalAtiva('consulta-editar')
  }

  function abrirModalAgendaRemedioCriar() {
    setAgendaRemedioForm(agendaRemedioInicial)
    setAgendaRemedioEditandoIndex(null)
    setModalAtiva('agenda-remedio-criar')
  }

  function abrirModalAgendaRemedioEditar(index) {
    const tarefa = tarefas[diaSelecionado]?.[index]
    if (!tarefa) {
      return
    }

    const match = tarefa.titulo.match(/^([^(]+)(?:\s*\(([^)]+)\))?/)
    const nomeLimpo = match ? match[1].trim() : tarefa.titulo
    const remedioEncontrado = remedios.find((item) => item.nome === nomeLimpo)

    setAgendaRemedioForm({
      nomeRemedio: remedioEncontrado?.nome || nomeLimpo,
      horario: tarefa.horario || '',
      responsavel: tarefa.responsavel === 'Não informado' ? '' : tarefa.responsavel,
      observacao: tarefa.observacao || ''
    })
    setAgendaRemedioEditandoIndex(index)
    setModalAtiva('agenda-remedio-editar')
  }

  async function salvarMembro(e) {
    e.preventDefault()

    if (!membroForm.nome || !membroForm.idade) {
      alert('Nome e idade são obrigatórios.')
      return
    }

    const payload = {
      idoso_id: Number(idosoId),
      nome: membroForm.nome.trim(),
      idade: membroForm.idade === '' ? null : Number(membroForm.idade),
      parentesco: membroForm.parentesco || null,
      telefone: membroForm.telefone || null
    }

    if (!payload.nome || Number.isNaN(payload.idade)) {
      alert('Preencha os campos corretamente.')
      return
    }

    const idosoIdParaParente = idosoIdPeloNome || idosoId

    if (!idosoIdParaParente) {
      setErroGlobal('Id do idoso não encontrado para cadastrar o parente.')
      return
    }

    try {
      setSalvando(true)
      setErroGlobal('')

      const dados = membroEditandoIndex === null
        ? await requisitarJSON(`${ENDPOINT_PARENTES}/criar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, idoso_id: Number(idosoIdParaParente) })
        })
        : await requisitarJSON(`${ENDPOINT_PARENTES}/editar/${membrosFamilia[membroEditandoIndex]?.id || membroEditandoIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

      const parenteSalvo = normalizarParente(dados || payload)
      if (membroEditandoIndex === null) {
        setMembrosFamilia((prev) => [...prev, parenteSalvo])
      } else {
        setMembrosFamilia((prev) =>
          prev.map((item, index) => (index === membroEditandoIndex ? { ...item, ...payload, ...parenteSalvo } : item))
        )
      }
      fecharModal()
    } catch (error) {
      avisarErroApi(error, setErroGlobal)
    } finally {
      setSalvando(false)
    }
  }

  async function salvarRemedio(e) {
    e.preventDefault()

    if (!remedioForm.nome || !remedioForm.dosagem) {
      alert('Nome e dosagem são obrigatórios.')
      return
    }

    const idosoIdParaOperacao = idosoIdPeloNome || idosoId
    const payload = {
      idoso_id: Number(idosoIdParaOperacao),
      nome_remedio: remedioForm.nome.trim(),
      dosagem: remedioForm.dosagem.trim(),
      horario: remedioForm.instrucoes || null
    }

    if (!idosoIdParaOperacao) {
      setErroGlobal('Id do idoso não encontrado.')
      return
    }

    try {
      setSalvando(true)
      setErroGlobal('')

      const dados = remedioEditandoIndex === null
        ? await requisitarJSON(`${ENDPOINT_REMEDIOS}/criar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        : await requisitarJSON(`${ENDPOINT_REMEDIOS}/editar/${remedios[remedioEditandoIndex]?.id || remedioEditandoIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

      const remedioSalvo = normalizarRemedio(dados || payload)
      if (remedioEditandoIndex === null) {
        setRemedios((prev) => [...prev, remedioSalvo])
      } else {
        setRemedios((prev) =>
          prev.map((item, index) => (index === remedioEditandoIndex ? { ...item, ...remedioSalvo } : item))
        )
      }
      fecharModal()
    } catch (error) {
      avisarErroApi(error, setErroGlobal)
    } finally {
      setSalvando(false)
    }
  }

  function salvarIdoso(e) {
    e.preventDefault()

    const idosoIdParaOperacao = idosoIdPeloNome || idosoId

    if (!idosoIdParaOperacao) {
      setErroGlobal('Id do idoso não encontrado.')
      return
    }

    if (!idoso.nome || !idoso.senha) {
      alert('Nome e senha são obrigatórios.')
      return
    }

    const payload = {
      nome: idoso.nome.trim(),
      altura: idoso.altura === '' ? null : Number(idoso.altura),
      idade: idoso.idade === '' ? null : Number(idoso.idade),
      peso: idoso.peso === '' ? null : Number(idoso.peso),
      senha: idoso.senha
    }

    setSalvando(true)

    requisitarJSON(`${ENDPOINT_IDOSO}/editar/${idosoIdParaOperacao}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((dados) => {
        setIdoso((prev) => ({
          ...prev,
          nome: dados?.nome || payload.nome,
          idade: dados?.idade?.toString?.() || payload.idade?.toString?.() || '',
          altura: dados?.altura?.toString?.() || payload.altura?.toString?.() || '',
          peso: dados?.peso?.toString?.() || payload.peso?.toString?.() || '',
          senha: ''
        }))
        fecharModal()
      })
      .catch((error) => avisarErroApi(error, setErroGlobal))
      .finally(() => setSalvando(false))
  }

  async function salvarConsulta(e) {
    e.preventDefault()

    const idosoIdParaOperacao = idosoIdPeloNome || idosoId

    if (!idosoIdParaOperacao) {
      setErroGlobal('Id do idoso não encontrado.')
      return
    }

    if (!consultaForm.medico || !consultaForm.horario) {
      alert('Por favor, preencha médico e horário.')
      return
    }

    const tarefaEditando = consultaEditandoIndex !== null ? tarefas[diaSelecionado]?.[consultaEditandoIndex] : null
    const payload = {
      idoso_id: Number(idosoIdParaOperacao),
      data_consulta: montarDataConsulta(diaSelecionado, consultaForm.horario),
      nome_medico: consultaForm.medico.trim(),
      observacao: consultaForm.observacao || null,
      local: consultaForm.local || null
    }
    const tarefaConsulta = {
      titulo: `Consulta: ${consultaForm.medico}`,
      horario: consultaForm.horario,
      tipo: 'Consulta',
      responsavel: consultaForm.responsavel || 'Não informado',
      local: consultaForm.local,
      observacao: consultaForm.observacao
    }

    try {
      setSalvando(true)
      setErroGlobal('')

      const dados = tarefaEditando?.id
        ? await requisitarJSON(`${ENDPOINT_CONSULTAS}/editar/${tarefaEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        : await requisitarJSON(`${ENDPOINT_CONSULTAS}/criar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

      const tarefaSalva = { ...tarefaConsulta, id: dados?.id || tarefaEditando?.id }

      setTarefas((prev) => {
        const listaDia = prev[diaSelecionado] ? [...prev[diaSelecionado]] : []

        if (consultaEditandoIndex !== null) {
          listaDia[consultaEditandoIndex] = tarefaSalva
        } else {
          listaDia.push(tarefaSalva)
        }

        return { ...prev, [diaSelecionado]: listaDia }
      })

      fecharModal()
    } catch (error) {
      avisarErroApi(error, setErroGlobal)
    } finally {
      setSalvando(false)
    }
  }

  function salvarAgendaRemedio(e) {
    e.preventDefault()

    const idosoIdParaOperacao = idosoIdPeloNome || idosoId

    if (!idosoIdParaOperacao) {
      setErroGlobal('Id do idoso não encontrado.')
      return
    }

    if (!agendaRemedioForm.nomeRemedio || !agendaRemedioForm.horario) {
      alert('Por favor, selecione um remédio e o horário.')
      return
    }

    const remedioSelecionado = remedios.find((item) => item.nome === agendaRemedioForm.nomeRemedio)
    if (!remedioSelecionado?.id) {
      alert('Este remédio precisa estar cadastrado no backend antes de entrar na agenda.')
      return
    }

    const tarefaRemedio = {
      id: remedioSelecionado.id,
      titulo: remedioSelecionado ? `${remedioSelecionado.nome} (${remedioSelecionado.dosagem})` : agendaRemedioForm.nomeRemedio,
      horario: agendaRemedioForm.horario,
      tipo: 'Remédio',
      responsavel: agendaRemedioForm.responsavel || 'Não informado',
      observacao: agendaRemedioForm.observacao || remedioSelecionado?.instrucoes || ''
    }

    setSalvando(true)

    requisitarJSON(`${ENDPOINT_REMEDIOS}/editar/${remedioSelecionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_remedio: remedioSelecionado.nome,
        dosagem: remedioSelecionado.dosagem,
        horario: agendaRemedioForm.horario
      })
    })
      .then((dados) => {
        const remedioSalvo = normalizarRemedio(dados || { ...remedioSelecionado, horario: agendaRemedioForm.horario })
        setRemedios((prev) => prev.map((item) => (item.id === remedioSelecionado.id ? remedioSalvo : item)))

        setTarefas((prev) => {
          const listaDia = prev[diaSelecionado] ? [...prev[diaSelecionado]] : []

          if (agendaRemedioEditandoIndex !== null) {
            listaDia[agendaRemedioEditandoIndex] = tarefaRemedio
          } else {
            listaDia.push(tarefaRemedio)
          }

          return { ...prev, [diaSelecionado]: listaDia }
        })

        fecharModal()
      })
      .catch((error) => avisarErroApi(error, setErroGlobal))
      .finally(() => setSalvando(false))
  }

  function excluirParente(index) {
    const parente = membrosFamilia[index]
    if (!window.confirm(`Deseja realmente remover ${parente?.nome} da lista de familiares?`)) {
      return
    }

    if (parente?.id) {
      requisitarJSON(`${ENDPOINT_PARENTES}/deletar/${parente.id}`, {
        method: 'DELETE'
      }).catch((error) => avisarErroApi(error, setErroGlobal))
    }

    setMembrosFamilia((prev) => prev.filter((_, i) => i !== index))
  }

  function excluirRemedio(index) {
    const remedio = remedios[index]
    if (!window.confirm(`Deseja realmente remover ${remedio?.nome} da lista de remédios?`)) {
      return
    }

    if (remedio?.id) {
      requisitarJSON(`${ENDPOINT_REMEDIOS}/deletar/${remedio.id}`, {
        method: 'DELETE'
      }).catch((error) => avisarErroApi(error, setErroGlobal))
    }

    setRemedios((prev) => prev.filter((_, i) => i !== index))
  }

  function editarTarefa(tarefa, index) {
    if (tarefa.tipo === 'Consulta') {
      abrirModalConsultaEditar(index)
      return
    }

    abrirModalAgendaRemedioEditar(index)
  }

  function excluirTarefa(index) {
    const tarefa = tarefas[diaSelecionado]?.[index]
    if (!window.confirm('Deseja realmente excluir esta tarefa?')) {
      return
    }

    if (tarefa?.tipo === 'Consulta' && tarefa?.id) {
      requisitarJSON(`${ENDPOINT_CONSULTAS}/deletar/${tarefa.id}`, {
        method: 'DELETE'
      }).catch((error) => avisarErroApi(error, setErroGlobal))
    }

    setTarefas((prev) => {
      const novaLista = prev[diaSelecionado].filter((_, i) => i !== index)
      const copiaPrev = { ...prev }

      if (novaLista.length === 0) {
        delete copiaPrev[diaSelecionado]
      } else {
        copiaPrev[diaSelecionado] = novaLista
      }

      return copiaPrev
    })
  }

  return (
    <div className={styles.container}>
      <aside className={styles.menuLateral}>
        <h2>Menu</h2>

        <button
          type="button"
          className={seccaoMenu === 'calendario' ? styles.menuAtivo : ''}
          onClick={() => setSeccaoMenu('calendario')}
        >
          Calendário
        </button>

        <button
          type="button"
          className={seccaoMenu === 'idoso' ? styles.menuAtivo : ''}
          onClick={() => setSeccaoMenu('idoso')}
        >
          Idoso
        </button>

        <button
          type="button"
          className={seccaoMenu === 'familia' ? styles.menuAtivo : ''}
          onClick={() => setSeccaoMenu('familia')}
        >
          Parentes
        </button>

        <button
          type="button"
          className={seccaoMenu === 'remedios' ? styles.menuAtivo : ''}
          onClick={() => setSeccaoMenu('remedios')}
        >
          Remédios
        </button>
      </aside>

      <main className={styles.conteudoPrincipal}>
        <header className={styles.header}>
          <h1>Agenda do Idoso</h1>
          <p>Junho 2026</p>
        </header>

        {erroGlobal && (
          <p className={styles.erroGlobal}>
            {erroGlobal}
          </p>
        )}

        {carregando ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            {seccaoMenu === 'calendario' && (
              <>
                <div className={styles.calendario}>
                  {dias.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      className={styles.dia}
                      onClick={() => setDiaSelecionado(dia)}
                    >
                      <span>{dia}</span>
                      {tarefas[dia] && tarefas[dia].length > 0 && <div className={styles.indicador}></div>}
                    </button>
                  ))}
                </div>

                {diaSelecionado && (
                  <>
                    <div className={styles.overlay} onClick={fecharDiaSelecionado}></div>

                    <div className={styles.modal}>
                      <div className={styles.modalHeader}>
                        <h2>Dia {diaSelecionado}</h2>
                        <button type="button" onClick={fecharDiaSelecionado}>
                          ✕
                        </button>
                      </div>

                      <div className={styles.listaTarefas}>
                        {tarefas[diaSelecionado]?.length ? (
                          tarefas[diaSelecionado].map((tarefa, index) => (
                            <div key={index} className={styles.cardTarefa}>
                              <h3>{tarefa.titulo}</h3>
                              <p className={styles.badgeTipo}>{tarefa.tipo}</p>
                              <span>Horário: {tarefa.horario}</span>
                              {tarefa.local && (
                                <p>
                                  📍 <strong>Local:</strong> {tarefa.local}
                                </p>
                              )}
                              <p>
                                👥 <strong>Responsável:</strong> {tarefa.responsavel}
                              </p>
                              {tarefa.observacao && (
                                <div className={styles.boxObservacao}>
                                  <strong>Nota:</strong> {tarefa.observacao}
                                </div>
                              )}

                              <div className={styles.acoes}>
                                <button type="button" onClick={() => editarTarefa(tarefa, index)}>
                                  Editar
                                </button>
                                <button type="button" onClick={() => excluirTarefa(index)}>
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Nenhuma tarefa cadastrada.</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.btnAdicionar}
                        onClick={() => setModalAtiva('menu-agenda')}
                      >
                        + Adicionar tarefa
                      </button>
                    </div>

                    {modalAtiva === 'menu-agenda' && (
                      <div className={styles.menuAdicionar}>
                        <h3>Nova tarefa</h3>
                        <button type="button" onClick={abrirModalConsultaCriar}>
                          🩺 Consulta
                        </button>
                        <button type="button" onClick={abrirModalAgendaRemedioCriar}>
                          💊 Remédio
                        </button>
                        <button type="button" className={styles.btnVoltar} onClick={() => setModalAtiva(null)}>
                          Cancelar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {seccaoMenu === 'familia' && (
              <section className={styles.secaoCadastro}>
                <div className={styles.tituloSecao}>
                  <h2>Parentes</h2>
                  <button type="button" onClick={abrirModalParenteCriar}>
                    Novo parente
                  </button>
                </div>

                <div className={styles.listaCadastro}>
                  {membrosFamilia.length === 0 ? (
                    <p>Nenhum parente cadastrado.</p>
                  ) : (
                    membrosFamilia.map((membro, index) => (
                      <article key={membro.id || `${membro.nome}-${index}`} className={styles.itemCadastro}>
                        <div>
                          <strong>{membro.nome}</strong>
                          <p>
                            {membro.idade} anos{membro.parentesco ? ` • ${membro.parentesco}` : ''}
                          </p>
                          {membro.telefone && <small>{membro.telefone}</small>}
                        </div>
                        <div className={styles.acoesLista}>
                          <button type="button" onClick={() => abrirModalParenteEditar(index)}>
                            Editar
                          </button>
                          <button type="button" onClick={() => excluirParente(index)}>
                            Excluir
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {seccaoMenu === 'remedios' && (
              <section className={styles.secaoCadastro}>
                <div className={styles.tituloSecao}>
                  <h2>Remédios</h2>
                  <button type="button" onClick={abrirModalRemedioCriar}>
                    Novo remédio
                  </button>
                </div>

                <div className={styles.listaCadastro}>
                  {remedios.length === 0 ? (
                    <p>Nenhum remédio cadastrado.</p>
                  ) : (
                    remedios.map((remedio, index) => (
                      <article key={remedio.id || `${remedio.nome}-${index}`} className={styles.itemCadastro}>
                        <div>
                          <strong>{remedio.nome}</strong>
                          <p>{remedio.dosagem}</p>
                          {remedio.instrucoes && <small>{remedio.instrucoes}</small>}
                        </div>
                        <div className={styles.acoesLista}>
                          <button type="button" onClick={() => abrirModalRemedioEditar(index)}>
                            Editar
                          </button>
                          <button type="button" onClick={() => excluirRemedio(index)}>
                            Excluir
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {seccaoMenu === 'idoso' && (
              <section className={styles.secaoCadastro}>
                <div className={styles.tituloSecao}>
                  <h2>Dados do idoso</h2>
                  <button type="button" onClick={abrirModalIdosoEditar}>
                    Editar dados
                  </button>
                </div>

                <article className={styles.itemCadastro}>
                  <div>
                    <strong>{idoso.nome || 'Sem nome'}</strong>
                    <p>{idoso.idade ? `${idoso.idade} anos` : 'Idade não informada'}</p>
                    <small>
                      {idoso.altura ? `Altura: ${idoso.altura}` : 'Altura não informada'}
                      {' • '}
                      {idoso.peso ? `Peso: ${idoso.peso}` : 'Peso não informado'}
                    </small>
                  </div>
                </article>
              </section>
            )}
          </>
        )}
      </main>

      {modalAtiva === 'parente-criar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarMembro}>
            <h3>Novo parente</h3>

            <label>Nome *</label>
            <input
              type="text"
              value={membroForm.nome}
              onChange={(e) => setMembroForm({ ...membroForm, nome: e.target.value })}
            />

            <label>Idade *</label>
            <input
              type="number"
              value={membroForm.idade}
              onChange={(e) => setMembroForm({ ...membroForm, idade: e.target.value })}
            />

            <label>Parentesco</label>
            <select
              value={membroForm.parentesco}
              onChange={(e) => setMembroForm({ ...membroForm, parentesco: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="filho">Filho</option>
              <option value="irmao">Irmão</option>
              <option value="outro">Outro</option>
            </select>

            <label>Telefone</label>
            <input
              type="text"
              value={membroForm.telefone}
              onChange={(e) => setMembroForm({ ...membroForm, telefone: e.target.value })}
            />

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar parente'}
            </button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'parente-editar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarMembro}>
            <h3>Editar parente</h3>

            <label>Nome *</label>
            <input
              type="text"
              value={membroForm.nome}
              onChange={(e) => setMembroForm({ ...membroForm, nome: e.target.value })}
            />

            <label>Idade *</label>
            <input
              type="number"
              value={membroForm.idade}
              onChange={(e) => setMembroForm({ ...membroForm, idade: e.target.value })}
            />

            <label>Parentesco</label>
            <select
              value={membroForm.parentesco}
              onChange={(e) => setMembroForm({ ...membroForm, parentesco: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="filho">Filho</option>
              <option value="irmao">Irmão</option>
              <option value="outro">Outro</option>
            </select>

            <label>Telefone</label>
            <input
              type="text"
              value={membroForm.telefone}
              onChange={(e) => setMembroForm({ ...membroForm, telefone: e.target.value })}
            />

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Atualizar parente'}
            </button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'remedio-criar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarRemedio}>
            <h3>Novo remédio</h3>

            <label>Nome *</label>
            <input
              type="text"
              value={remedioForm.nome}
              onChange={(e) => setRemedioForm({ ...remedioForm, nome: e.target.value })}
            />

            <label>Dosagem *</label>
            <input
              type="text"
              value={remedioForm.dosagem}
              onChange={(e) => setRemedioForm({ ...remedioForm, dosagem: e.target.value })}
            />

            <label>Instruções</label>
            <textarea
              value={remedioForm.instrucoes}
              onChange={(e) => setRemedioForm({ ...remedioForm, instrucoes: e.target.value })}
            />

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar remédio'}
            </button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'remedio-editar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarRemedio}>
            <h3>Editar remédio</h3>

            <label>Nome *</label>
            <input
              type="text"
              value={remedioForm.nome}
              onChange={(e) => setRemedioForm({ ...remedioForm, nome: e.target.value })}
            />

            <label>Dosagem *</label>
            <input
              type="text"
              value={remedioForm.dosagem}
              onChange={(e) => setRemedioForm({ ...remedioForm, dosagem: e.target.value })}
            />

            <label>Instruções</label>
            <textarea
              value={remedioForm.instrucoes}
              onChange={(e) => setRemedioForm({ ...remedioForm, instrucoes: e.target.value })}
            />

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Atualizar remédio'}
            </button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'idoso-editar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarIdoso}>
            <h3>Editar dados do idoso</h3>

            <label>Nome *</label>
            <input
              type="text"
              value={idoso.nome}
              onChange={(e) => setIdoso({ ...idoso, nome: e.target.value })}
            />

            <label>Idade</label>
            <input
              type="number"
              value={idoso.idade}
              onChange={(e) => setIdoso({ ...idoso, idade: e.target.value })}
            />

            <label>Altura</label>
            <input
              type="number"
              step="0.01"
              value={idoso.altura}
              onChange={(e) => setIdoso({ ...idoso, altura: e.target.value })}
            />

            <label>Peso</label>
            <input
              type="number"
              step="0.01"
              value={idoso.peso}
              onChange={(e) => setIdoso({ ...idoso, peso: e.target.value })}
            />

            <label>Senha *</label>
            <input
              type="password"
              value={idoso.senha}
              onChange={(e) => setIdoso({ ...idoso, senha: e.target.value })}
            />

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Atualizar idoso'}
            </button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'consulta-criar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarConsulta}>
            <h3>Nova consulta</h3>

            <label>Médico *</label>
            <input
              type="text"
              value={consultaForm.medico}
              onChange={(e) => setConsultaForm({ ...consultaForm, medico: e.target.value })}
            />

            <label>Horário *</label>
            <input
              type="time"
              value={consultaForm.horario}
              onChange={(e) => setConsultaForm({ ...consultaForm, horario: e.target.value })}
            />

            <label>Local</label>
            <input
              type="text"
              value={consultaForm.local}
              onChange={(e) => setConsultaForm({ ...consultaForm, local: e.target.value })}
            />

            <label>Responsável</label>
            <select
              value={consultaForm.responsavel}
              onChange={(e) => setConsultaForm({ ...consultaForm, responsavel: e.target.value })}
            >
              <option value="">Selecione um responsável</option>
              {membrosFamilia.map((membro) => (
                <option key={membro.id || membro.nome} value={membro.nome}>
                  {membro.nome}
                </option>
              ))}
            </select>

            <label>Observação</label>
            <textarea
              value={consultaForm.observacao}
              onChange={(e) => setConsultaForm({ ...consultaForm, observacao: e.target.value })}
            />

            <button type="submit">Cadastrar consulta</button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'consulta-editar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarConsulta}>
            <h3>Editar consulta</h3>

            <label>Médico *</label>
            <input
              type="text"
              value={consultaForm.medico}
              onChange={(e) => setConsultaForm({ ...consultaForm, medico: e.target.value })}
            />

            <label>Horário *</label>
            <input
              type="time"
              value={consultaForm.horario}
              onChange={(e) => setConsultaForm({ ...consultaForm, horario: e.target.value })}
            />

            <label>Local</label>
            <input
              type="text"
              value={consultaForm.local}
              onChange={(e) => setConsultaForm({ ...consultaForm, local: e.target.value })}
            />

            <label>Responsável</label>
            <select
              value={consultaForm.responsavel}
              onChange={(e) => setConsultaForm({ ...consultaForm, responsavel: e.target.value })}
            >
              <option value="">Selecione um responsável</option>
              {membrosFamilia.map((membro) => (
                <option key={membro.id || membro.nome} value={membro.nome}>
                  {membro.nome}
                </option>
              ))}
            </select>

            <label>Observação</label>
            <textarea
              value={consultaForm.observacao}
              onChange={(e) => setConsultaForm({ ...consultaForm, observacao: e.target.value })}
            />

            <button type="submit">Atualizar consulta</button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'agenda-remedio-criar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarAgendaRemedio}>
            <h3>Novo remédio na agenda</h3>

            <label>Remédio *</label>
            <select
              value={agendaRemedioForm.nomeRemedio}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, nomeRemedio: e.target.value })}
            >
              <option value="">Selecione um remédio</option>
              {remedios.map((remedio) => (
                <option key={remedio.id || remedio.nome} value={remedio.nome}>
                  {remedio.nome} {remedio.dosagem ? `(${remedio.dosagem})` : ''}
                </option>
              ))}
            </select>

            <label>Horário *</label>
            <input
              type="time"
              value={agendaRemedioForm.horario}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, horario: e.target.value })}
            />

            <label>Responsável</label>
            <select
              value={agendaRemedioForm.responsavel}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, responsavel: e.target.value })}
            >
              <option value="">Selecione um responsável</option>
              {membrosFamilia.map((membro) => (
                <option key={membro.id || membro.nome} value={membro.nome}>
                  {membro.nome}
                </option>
              ))}
            </select>

            <label>Observação</label>
            <textarea
              value={agendaRemedioForm.observacao}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, observacao: e.target.value })}
            />

            <button type="submit">Cadastrar remédio</button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}

      {modalAtiva === 'agenda-remedio-editar' && (
        <>
          <div className={styles.overlay} onClick={fecharModal}></div>
          <form className={styles.formularioAdicionar} onSubmit={salvarAgendaRemedio}>
            <h3>Editar remédio na agenda</h3>

            <label>Remédio *</label>
            <select
              value={agendaRemedioForm.nomeRemedio}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, nomeRemedio: e.target.value })}
            >
              <option value="">Selecione um remédio</option>
              {remedios.map((remedio) => (
                <option key={remedio.id || remedio.nome} value={remedio.nome}>
                  {remedio.nome} {remedio.dosagem ? `(${remedio.dosagem})` : ''}
                </option>
              ))}
            </select>

            <label>Horário *</label>
            <input
              type="time"
              value={agendaRemedioForm.horario}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, horario: e.target.value })}
            />

            <label>Responsável</label>
            <select
              value={agendaRemedioForm.responsavel}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, responsavel: e.target.value })}
            >
              <option value="">Selecione um responsável</option>
              {membrosFamilia.map((membro) => (
                <option key={membro.id || membro.nome} value={membro.nome}>
                  {membro.nome}
                </option>
              ))}
            </select>

            <label>Observação</label>
            <textarea
              value={agendaRemedioForm.observacao}
              onChange={(e) => setAgendaRemedioForm({ ...agendaRemedioForm, observacao: e.target.value })}
            />

            <button type="submit">Atualizar remédio</button>
            <button type="button" className={styles.btnVoltar} onClick={fecharModal}>
              Cancelar
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default TelaPrincipal
