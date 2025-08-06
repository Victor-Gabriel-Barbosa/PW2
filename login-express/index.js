import express from 'express'
import express_session from 'express-session'
const app = express()
app.use(express.static('public'))
app.use(express.urlencoded());

// Utiliza o express-session
app.use(express_session({
  secret: '1V5UWlxcKVHX6b9vxb4zq5vFKfWocRST',
  resave: false,
  saveUninitialized: false,
}))

// Processa formulário de login
app.post('/processa_login', (req, res) => {
  if (req.body?.usuario == 'leo' && req.body?.senha == '123') {
    req.session.usuarioLogado = { nome: req.body?.usuario }
    res.send(`Login feito com sucesso<br><a href='/admin'>Acessar pagina restrita</a>`)
  } else res.send(`Login incorreto<br><a href='/'>Tentar novamente</a>`)
})

// Rota protegida: Só permite acesso se houver sessão válida
app.get('/admin', (req, res) => {
  if (req.session.usuarioLogado) res.send(`Bem-vindo ${req.session.usuarioLogado.nome}!<br><a href='/logout'>Fazer logout</a>`)
  else res.status(401).send('Acesso negado. <a href="/">Fazer login</a>')
})

// Destrói sessão no servidor e instrui cliente a apagar cookie
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout falhou:", err)
      return res.status(500).send("Logout falhou")
    } else {
      res.clearCookie('connect.sid', { path: '/' })
      res.send(`Logout feito com sucesso<br><a href='/'>Voltar a fazer login</a>`)
    }
  })
})
app.listen(3000)