import { useState, useEffect } from 'react'
import * as Icons from "react-icons/fa6";
import './App.css'

const API_URL = 'http://bsimc.freeddns.org:2025/api/tarefas'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  // Estados para formulário de criação
  const [novaDescricao, setNovaDescricao] = useState('')
  const [novaConcluida, setNovaConcluida] = useState(false)

  // Estados para formulário de edição
  const [descricaoEditando, setDescricaoEditando] = useState('')
  const [concluidaEditando, setConcluidaEditando] = useState(false)

  // Carrega todas as tarefas da API
  const carregarTarefas = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      if (res.ok) {
        const dados = await res.json()
        setTarefas(dados)
      } else console.error('Erro ao carregar tarefas:', res.statusText)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carrega tarefas quando o componente é montado
  useEffect(() => {
    carregarTarefas()
  }, [])

  // Cria uma nova tarefa
  const criarTarefa = async (e) => {
    e.preventDefault()
    if (!novaDescricao.trim()) return

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: novaDescricao,
          concluida: novaConcluida
        })
      })

      if (res.ok) {
        setNovaDescricao('')
        setNovaConcluida(false)
        carregarTarefas() // Recarrega a lista
      } else console.error('Erro ao criar tarefa:', res.statusText)
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
    }
  }

  // Inicia a edição de uma tarefa
  const iniciarEdicao = (tarefa) => {
    setEditandoId(tarefa.id)
    setDescricaoEditando(tarefa.descricao)
    setConcluidaEditando(tarefa.concluida)
  }

  // Cancela a edição
  const cancelarEdicao = () => {
    setEditandoId(null)
    setDescricaoEditando('')
    setConcluidaEditando(false)
  }

  // Altera uma tarefa existente
  const alterarTarefa = async (id) => {
    if (!descricaoEditando.trim()) return

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: descricaoEditando,
          concluida: concluidaEditando
        })
      })

      if (res.ok) {
        cancelarEdicao()
        carregarTarefas() // Recarrega a lista
      } else console.error('Erro ao alterar tarefa:', res.statusText)
    } catch (error) {
      console.error('Erro ao alterar tarefa:', error)
    }
  }

  // Exclui uma tarefa
  const excluirTarefa = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) carregarTarefas() // Recarrega a lista
      else console.error('Erro ao excluir tarefa:', res.statusText)
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
    }
  }

  return (
    <div className="app">
      <h1><Icons.FaCalendarDays /> API de Tarefas</h1>

      {/* Formulário de criação de tarefa */}
      <div className="formulario-criacao">
        <h2>Criar Nova Tarefa</h2>
        <form onSubmit={criarTarefa}>
          <div className="campo">
            <label htmlFor="descricao">Descrição:</label>
            <input
              type="text"
              id="descricao"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              placeholder="Digite a descrição da tarefa"
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="concluida">
              <input
                id="concluida"
                type="checkbox"
                checked={novaConcluida}
                onChange={(e) => setNovaConcluida(e.target.checked)}
              />
              Concluída
            </label>
          </div>
          <button type="submit">
            <Icons.FaCalendarPlus /> Criar Tarefa
          </button>
        </form>
      </div>

      {/* Lista de tarefas */}
      <div className="lista-tarefas">
        <h2>Lista de Tarefas</h2>
        {loading ? (
          <p>Carregando tarefas...</p>
        ) : tarefas.length === 0 ? (
          <p>Nenhuma tarefa encontrada.</p>
        ) : (
          <div className="tarefas">
            {tarefas.map((tarefa) => (
              <div key={tarefa.id} className="tarefa">
                {editandoId === tarefa.id ? (
                  // Formulário de edição
                  <div className="formulario-edicao">
                    <div className="campo">
                      <label htmlFor={`edit-desc-${tarefa.id}`}>Descrição:</label>
                      <input
                        type="text"
                        id={`edit-desc-${tarefa.id}`}
                        value={descricaoEditando}
                        onChange={(e) => setDescricaoEditando(e.target.value)}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>
                        <input
                          type="checkbox"
                          checked={concluidaEditando}
                          onChange={(e) => setConcluidaEditando(e.target.checked)}
                        />
                        Concluída
                      </label>
                    </div>
                    <div className="botoes-edicao">
                      <button onClick={() => alterarTarefa(tarefa.id)}>
                        Alterar Tarefa
                      </button>
                      <button onClick={cancelarEdicao}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  // Exibe informações da tarefa
                  <div className="tarefa-info">
                    <div className="tarefa-texto">
                      <span className="descricao">{tarefa.descricao}</span>
                      <span className={`status ${tarefa.concluida ? 'concluida' : 'em-andamento'}`}>
                        {tarefa.concluida ? <><Icons.FaCalendarCheck /> Concluída </> : <><Icons.FaCalendarMinus /> Em andamento</>}
                      </span>
                    </div>
                    <div className="tarefa-acoes">
                      <button onClick={() => iniciarEdicao(tarefa)}>
                        <Icons.FaPenToSquare /> Editar
                      </button>
                      <button
                        onClick={() => excluirTarefa(tarefa.id)}
                        className="botao-excluir"
                      >
                        <Icons.FaCalendarXmark /> Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App