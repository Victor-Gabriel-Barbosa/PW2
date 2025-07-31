import express from 'express'
const app = express()
app.use(express.json()) // middleware para interpretar JSON
// Usando um array como "banco de dados" em mem´oria
let tarefas = [{ id: 1, descricao: "Estudar Express", concluida: false }]
let proximoId = 2
// GET: Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas)
})

// POST: Criar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const novaTarefa = {
    id: proximoId++,
    descricao: req.body.descricao,
    concluida: req.body.concluida
  }
  tarefas.push(novaTarefa)
  res.status(201).json(novaTarefa)
})

// PUT: Atualizar uma tarefa existente
app.put('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const tarefa = tarefas.find(t => t.id === id)
  if (!tarefa) return res.status(404).send('Tarefa não encontrada')
  tarefa.descricao = req.body.descricao ?? tarefa.descricao
  tarefa.concluida = req.body.concluida ?? tarefa.concluida
  res.json(tarefa)
})

// DELETE: Excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id)
  tarefas = tarefas.filter(t => t.id !== id)
  res.status(204).send() // 204 No Content
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})