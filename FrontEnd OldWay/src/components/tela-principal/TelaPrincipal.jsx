import { useState } from "react";
import styles from "./TelaPrincipal.module.css";

function TelaPrincipal() {
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [mostrarMenuAdicionar, setMostrarMenuAdicionar] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState(null);
  const [mostrarFormularioMembro, setMostrarFormularioMembro] = useState(false);
  const [mostrarListaMembros, setMostrarListaMembros] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [editandoMembroIndex, setEditandoMembroIndex] = useState(null);

  // Estado dos membros da família com a estrutura de atributos solicitada
  const [membrosFamilia, setMembrosFamilia] = useState([
    { nome: "Pedro", idade: "42", parentesco: "filho", telefone: "(61) 99999-1111" },
    { nome: "Maria", idade: "38", parentesco: "outro", telefone: "(61) 99999-2222" },
    { nome: "João", idade: "45", parentesco: "irmao", telefone: "(61) 99999-3333" },
  ]);

  // Estado para as tarefas do calendário
  const [tarefas, setTarefas] = useState({
    5: [
      {
        titulo: "Tomar Losartana",
        horario: "08:00",
        tipo: "Remédio",
        responsavel: "Pedro",
        observacao: "Tomar em jejum com um copo cheio de água."
      },
      {
        titulo: "Consulta Cardiologista",
        horario: "14:00",
        tipo: "Consulta",
        responsavel: "Maria",
        local: "Hospital Santa Luzia",
        observacao: "Levar os exames de sangue passados."
      },
    ],
    12: [
      {
        titulo: "Tomar Insulina",
        horario: "20:00",
        tipo: "Remédio",
        responsavel: "João",
        observacao: ""
      },
    ],
  });

  // Estados de controle dos inputs dos formulários
  const [consultaForm, setConsultaForm] = useState({
    medico: "",
    local: "",
    responsavel: "",
    observacao: "",
    horario: ""
  });

  const [remedioForm, setRemedioForm] = useState({
    nome: "",
    dosagem: "",
    horario: "",
    responsavel: "",
    observacao: ""
  });

  const [membroForm, setMembroForm] = useState({
    nome: "",
    idade: "",
    parentesco: "",
    telefone: ""
  });

  const dias = Array.from({ length: 30 }, (_, i) => i + 1);

  const fecharTudo = () => {
    setDiaSelecionado(null);
    setMostrarMenuAdicionar(false);
    setTipoFormulario(null);
    setMostrarFormularioMembro(false);
    setMostrarListaMembros(false);
    setEditandoIndex(null);
    setEditandoMembroIndex(null);
    limparFormularios();
  };

  const limparFormularios = () => {
    setConsultaForm({ medico: "", local: "", responsavel: "", observacao: "", horario: "" });
    setRemedioForm({ nome: "", dosagem: "", horario: "", responsavel: "", observacao: "" });
    setMembroForm({ nome: "", idade: "", parentesco: "", telefone: "" });
    setEditandoIndex(null);
    setEditandoMembroIndex(null);
  };

  // Salvar ou Atualizar Consulta
  const salvarConsulta = (e) => {
    e.preventDefault();
    if (!consultaForm.medico || !consultaForm.horario) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    const dadosConsulta = {
      titulo: `Consulta: ${consultaForm.medico}`,
      horario: consultaForm.horario,
      tipo: "Consulta",
      responsavel: consultaForm.responsavel || "Não informado",
      local: consultaForm.local,
      observacao: consultaForm.observacao
    };

    setTarefas((prev) => {
      const listaDia = prev[diaSelecionado] ? [...prev[diaSelecionado]] : [];
      if (editandoIndex !== null) {
        listaDia[editandoIndex] = dadosConsulta;
      } else {
        listaDia.push(dadosConsulta);
      }
      return { ...prev, [diaSelecionado]: listaDia };
    });

    setTipoFormulario(null);
    setMostrarMenuAdicionar(false);
    limparFormularios();
  };

  // Salvar ou Atualizar Remédio
  const salvarRemedio = (e) => {
    e.preventDefault();
    if (!remedioForm.nome || !remedioForm.horario) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    const dadosRemedio = {
      titulo: `${remedioForm.nome} ${remedioForm.dosagem ? `(${remedioForm.dosagem})` : ""}`,
      horario: remedioForm.horario,
      tipo: "Remédio",
      responsavel: remedioForm.responsavel || "Não informado",
      observacao: remedioForm.observacao
    };

    setTarefas((prev) => {
      const listaDia = prev[diaSelecionado] ? [...prev[diaSelecionado]] : [];
      if (editandoIndex !== null) {
        listaDia[editandoIndex] = dadosRemedio;
      } else {
        listaDia.push(dadosRemedio);
      }
      return { ...prev, [diaSelecionado]: listaDia };
    });

    setTipoFormulario(null);
    setMostrarMenuAdicionar(false);
    limparFormularios();
  };

  // Salvar ou Atualizar Familiar cadastrado
  const salvarMembro = (e) => {
    e.preventDefault();
    if (!membroForm.nome || !membroForm.idade) {
      alert("Nome e Idade são obrigatórios.");
      return;
    }

    setMembrosFamilia((prev) => {
      const novaLista = [...prev];
      if (editandoMembroIndex !== null) {
        novaLista[editandoMembroIndex] = { ...membroForm };
        alert("Familiar atualizado com sucesso!");
      } else {
        const existe = prev.some((m) => m.nome.toLowerCase() === membroForm.nome.toLowerCase());
        if (existe) {
          alert("Este membro já está cadastrado.");
          return prev;
        }
        novaLista.push({ ...membroForm });
        alert("Familiar cadastrado com sucesso!");
      }
      return novaLista;
    });

    setMembroForm({ nome: "", idade: "", parentesco: "", telefone: "" });
    setMostrarFormularioMembro(false);
    setEditandoMembroIndex(null);
  };

  // Excluir Tarefa do Dia
  const excluirTarefa = (index) => {
    if (confirm("Deseja realmente excluir esta tarefa?")) {
      setTarefas((prev) => {
        const novaLista = prev[diaSelecionado].filter((_, i) => i !== index);
        const copiaPrev = { ...prev };
        
        if (novaLista.length === 0) {
          delete copiaPrev[diaSelecionado];
        } else {
          copiaPrev[diaSelecionado] = novaLista;
        }
        
        return copiaPrev;
      });
    }
  };

  // Carregar dados para Editar Tarefa
  const editarTarefa = (tarefa, index) => {
    setEditandoIndex(index);
    setMostrarMenuAdicionar(false);
    setMostrarFormularioMembro(false);

    if (tarefa.tipo === "Consulta") {
      const medicoLimpo = tarefa.titulo.replace("Consulta: ", "");
      setConsultaForm({
        medico: medicoLimpo,
        local: tarefa.local || "",
        responsavel: tarefa.responsavel === "Não informado" ? "" : tarefa.responsavel,
        observacao: tarefa.observacao || "",
        horario: tarefa.horario
      });
      setTipoFormulario("consulta");
    } else {
      const match = tarefa.titulo.match(/^([^(]+)(?:\s*\(([^)]+)\))?/);
      const nomeLimpo = match ? match[1].trim() : tarefa.titulo;
      const dosagemLimpa = match && match[2] ? match[2].trim() : "";

      setRemedioForm({
        nome: nomeLimpo,
        dosagem: dosagemLimpa,
        horario: tarefa.horario,
        responsavel: tarefa.responsavel === "Não informado" ? "" : tarefa.responsavel,
        observacao: tarefa.observacao || ""
      });
      setTipoFormulario("remedio");
    }
  };

  // Iniciar Edição de um Familiar da lista
  const iniciarEdicaoMembro = (index) => {
    setMembroForm(membrosFamilia[index]);
    setEditandoMembroIndex(index);
    setMostrarFormularioMembro(true);
    setMostrarMenuAdicionar(false);
    setTipoFormulario(null);
  };

  // Excluir um Familiar do sistema
  const excluirMembro = (index) => {
    const familiar = membrosFamilia[index];
    if (confirm(`Deseja realmente remover ${familiar.nome} da lista de familiares?`)) {
      setMembrosFamilia((prev) => prev.filter((_, i) => i !== index));
      if (mostrarListaMembros && membrosFamilia.length <= 1) {
        setMostrarListaMembros(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Agenda do Idoso</h1>
        <p>Junho 2026</p>
      </header>

      <div className={styles.calendario}>
        {dias.map((dia) => (
          <div
            key={dia}
            className={styles.dia}
            onClick={() => setDiaSelecionado(dia)}
          >
            <span>{dia}</span>

            {tarefas[dia] && tarefas[dia].length > 0 && (
              <div className={styles.indicador}></div>
            )}
          </div>
        ))}
      </div>

      {diaSelecionado && (
        <>
          <div className={styles.overlay} onClick={fecharTudo}></div>

          {mostrarMenuAdicionar && !tipoFormulario && (
            <div className={styles.menuAdicionar}>
              <h3>Nova tarefa</h3>
              <button onClick={() => setTipoFormulario("consulta")}>🩺 Consulta</button>
              <button onClick={() => setTipoFormulario("remedio")}>💊 Remédio</button>
            </div>
          )}

          {tipoFormulario === "consulta" && (
            <form className={styles.formularioAdicionar} onSubmit={salvarConsulta}>
              <h3>{editandoIndex !== null ? "Editar Consulta" : "Nova Consulta"}</h3>

              <label>Nome do Médico *</label>
              <input
                type="text"
                placeholder="Dr. João Silva"
                value={consultaForm.medico}
                onChange={(e) => setConsultaForm({ ...consultaForm, medico: e.target.value })}
                required
              />

              <label>Horário *</label>
              <input 
                type="time" 
                value={consultaForm.horario}
                onChange={(e) => setConsultaForm({ ...consultaForm, horario: e.target.value })}
                required
              />

              <label>Local</label>
              <input
                type="text"
                placeholder="Hospital Santa Luzia"
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
                  <option key={membro.nome} value={membro.nome}>
                    {membro.nome}
                  </option>
                ))}
              </select>

              <label>Observação</label>
              <textarea
                placeholder="Informações adicionais..."
                value={consultaForm.observacao}
                onChange={(e) => setConsultaForm({ ...consultaForm, observacao: e.target.value })}
              ></textarea>

              <button type="submit">{editandoIndex !== null ? "Atualizar" : "Salvar Consulta"}</button>
              <button type="button" className={styles.btnVoltar} onClick={limparFormularios}>
                Cancelar
              </button>
            </form>
          )}

          {tipoFormulario === "remedio" && (
            <form className={styles.formularioAdicionar} onSubmit={salvarRemedio}>
              <h3>{editandoIndex !== null ? "Editar Remédio" : "Novo Remédio"}</h3>

              <label>Nome do Remédio *</label>
              <input
                type="text"
                placeholder="Losartana"
                value={remedioForm.nome}
                onChange={(e) => setRemedioForm({ ...remedioForm, nome: e.target.value })}
                required
              />

              <label>Dosagem</label>
              <input
                type="text"
                placeholder="50mg"
                value={remedioForm.dosagem}
                onChange={(e) => setRemedioForm({ ...remedioForm, dosagem: e.target.value })}
              />

              <label>Horário *</label>
              <input 
                type="time" 
                value={remedioForm.horario}
                onChange={(e) => setRemedioForm({ ...remedioForm, horario: e.target.value })}
                required
              />

              <label>Responsável</label>
              <select
                value={remedioForm.responsavel}
                onChange={(e) => setRemedioForm({ ...remedioForm, responsavel: e.target.value })}
              >
                <option value="">Selecione um responsável</option>
                {membrosFamilia.map((membro) => (
                  <option key={membro.nome} value={membro.nome}>
                    {membro.nome}
                  </option>
                ))}
              </select>

              <label>Observação / Instruções</label>
              <textarea
                placeholder="Ex: Tomar após as refeições..."
                value={remedioForm.observacao}
                onChange={(e) => setRemedioForm({ ...remedioForm, observacao: e.target.value })}
              ></textarea>

              <button type="submit">{editandoIndex !== null ? "Atualizar" : "Salvar Remédio"}</button>
              <button type="button" className={styles.btnVoltar} onClick={limparFormularios}>
                Cancelar
              </button>
            </form>
          )}

          {mostrarFormularioMembro && (
            <form className={styles.formularioAdicionar} onSubmit={salvarMembro}>
              <h3>{editandoMembroIndex !== null ? "✏️ Editar Familiar" : "Novo Membro da Família"}</h3>

              <label>Nome *</label>
              <input
                type="text"
                placeholder="Nome do familiar"
                value={membroForm.nome}
                onChange={(e) => setMembroForm({ ...membroForm, nome: e.target.value })}
                required
              />

              <label>Idade *</label>
              <input
                type="number"
                placeholder="Ex: 40"
                value={membroForm.idade}
                onChange={(e) => setMembroForm({ ...membroForm, idade: e.target.value })}
                required
              />

              <label>Parentesco</label>
              <select
                value={membroForm.parentesco}
                onChange={(e) => setMembroForm({ ...membroForm, parentesco: e.target.value })}
              >
                <option value="">Selecione se aplicável</option>
                <option value="filho">Filho</option>
                <option value="irmao">Irmao</option>
                <option value="outro">Outro</option>
              </select>

              <label>Telefone</label>
              <input
                type="text"
                placeholder="(61) 99999-9999"
                value={membroForm.telefone}
                onChange={(e) => setMembroForm({ ...membroForm, telefone: e.target.value })}
              />

              <button type="submit">
                {editandoMembroIndex !== null ? "Atualizar Dados" : "Salvar Membro"}
              </button>

              <button
                type="button"
                className={styles.btnVoltar}
                onClick={() => {
                  setMostrarFormularioMembro(false);
                  setEditandoMembroIndex(null);
                  setMembroForm({ nome: "", idade: "", parentesco: "", telefone: "" });
                }}
              >
                Cancelar
              </button>
            </form>
          )}

          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Dia {diaSelecionado}</h2>
              <button onClick={fecharTudo}>✕</button>
            </div>

            <div className={styles.listaTarefas}>
              {tarefas[diaSelecionado]?.length ? (
                tarefas[diaSelecionado].map((tarefa, index) => (
                  <div key={index} className={styles.cardTarefa}>
                    <h3>{tarefa.titulo}</h3>
                    <p className={styles.badgeTipo}>{tarefa.tipo}</p>
                    <span>Horário: {tarefa.horario}</span>
                    {tarefa.local && <p>📍 <strong>Local:</strong> {tarefa.local}</p>}
                    <p>👥 <strong>Responsável:</strong> {tarefa.responsavel}</p>
                    
                    {tarefa.observacao && (
                      <div className={styles.boxObservacao}>
                        <strong>Nota:</strong> {tarefa.observacao}
                      </div>
                    )}

                    <div className={styles.acoes}>
                      <button type="button" onClick={() => editarTarefa(tarefa, index)}>Editar</button>
                      <button type="button" onClick={() => excluirTarefa(index)}>Excluir</button>
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
              onClick={() => {
                setMostrarMenuAdicionar(true);
                setTipoFormulario(null);
                setMostrarFormularioMembro(false);
                setEditandoIndex(null);
              }}
            >
              + Adicionar tarefa
            </button>

            <div className={styles.wrapperBotoesMembro}>
              <button
                type="button"
                className={styles.btnMembroPrincipal}
                onClick={() => {
                  setMostrarFormularioMembro(true);
                  setMostrarMenuAdicionar(false);
                  setTipoFormulario(null);
                  setEditandoMembroIndex(null);
                }}
              >
                + Adicionar membro da família
              </button>

              <button
                type="button"
                className={styles.btnMembroVisualizar}
                onClick={() => setMostrarListaMembros(!mostrarListaMembros)}
                title="Ver membros cadastrados"
              >
                {mostrarListaMembros ? "🔼" : "👥"}
              </button>
            </div>

            {mostrarListaMembros && (
              <div className={styles.listaMembrosCadastrados}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#4f46e5", fontSize: "0.9rem" }}>
                  Membros Cadastrados ({membrosFamilia.length})
                </h4>
                {membrosFamilia.length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>Nenhum familiar cadastrado.</p>
                ) : (
                  membrosFamilia.map((m, idx) => (
                    <div key={idx} className={styles.itemMembroLista}>
                      <div className={styles.infoMembro}>
                        <strong>{m.nome}</strong> ({m.idade} anos)
                        {m.parentesco && <span className={styles.labelParentesco}> - {m.parentesco}</span>}
                      </div>
                      <div className={styles.acoesMembro}>
                        <button type="button" onClick={() => iniciarEdicaoMembro(idx)} title="Editar">✏️</button>
                        <button type="button" onClick={() => excluirMembro(idx)} title="Excluir">🗑️</button>
                      </div>
                      {m.telefone && <p className={styles.telMembro}>📞 {m.telefone}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TelaPrincipal;