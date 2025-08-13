import express from 'express'
import Tarefas from './repositorio.js'

const app = express()
const tarefasRepo = new Tarefas()

app.use(express.json()) // Middleware para interpretar JSON

// GET: Lista todas as tarefas
app.get('/tarefas', (req, res) => {
  try {
    const tarefas = tarefasRepo.buscarTodas()
    res.json(tarefas)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST: Cria uma nova tarefa
app.post('/tarefas', (req, res) => {
  try {
    const { descricao, concluida } = req.body
    
    if (!descricao) return res.status(400).json({ error: 'Descrição é obrigatória' })
    
    const novaTarefa = tarefasRepo.inserir(descricao, concluida)
    res.status(201).json(novaTarefa)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// PUT: Atualiza uma tarefa existente
app.put('/tarefas/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { descricao, concluida } = req.body
    
    if (!descricao) return res.status(400).json({ error: 'Descrição é obrigatória' })
    
    const tarefaAtualizada = tarefasRepo.atualizar(id, descricao, concluida)
    
    if (!tarefaAtualizada) return res.status(404).json({ error: 'Tarefa não encontrada' })
    
    res.json(tarefaAtualizada)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// DELETE: Exclui uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const sucesso = tarefasRepo.apagar(id)
    
    if (!sucesso) return res.status(404).json({ error: 'Tarefa não encontrada' })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Fecha o servidor
process.on('SIGINT', () => {
  console.log('\nFechando servidor...')
  tarefasRepo.fechar()
  process.exit(0)
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})