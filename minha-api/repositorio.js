import better_sqlite3 from 'better-sqlite3'

class Tarefas {
  constructor() {
    // Define arquivo onde será armazenado o banco de dados
    this.db = new better_sqlite3('tarefas.db')
    // Cria tabela se ela não existir
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        concluida BOOLEAN NOT NULL
      );`)
  }

  // Busca todas as tarefas
  buscarTodas() {
    const stmt = this.db.prepare('SELECT * FROM tarefas')
    return stmt.all()
  }

  // Insere nova tarefa
  inserir(descricao, concluida) {
    const stmt = this.db.prepare('INSERT INTO tarefas (descricao, concluida) VALUES (?, ?)')
    const result = stmt.run(descricao, concluida ? 1 : 0)
    return this.buscarPorId(result.lastInsertRowid)
  }

  // Busca tarefa por ID
  buscarPorId(id) {
    const stmt = this.db.prepare('SELECT * FROM tarefas WHERE id = ?')
    return stmt.get(id)
  }

  // Atualiza tarefa
  atualizar(id, descricao, concluida) {
    const stmt = this.db.prepare('UPDATE tarefas SET descricao = ?, concluida = ? WHERE id = ?')
    const result = stmt.run(descricao, concluida ? 1 : 0, id)
    if (result.changes > 0) return this.buscarPorId(id)
    return null
  }

  // Apaga tarefa
  apagar(id) {
    const stmt = this.db.prepare('DELETE FROM tarefas WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // Fecha conexão com o banco
  fechar() {
    this.db.close()
  }
}

export default Tarefas