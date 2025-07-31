import express from 'express'
const app = express()
app.set('view engine', 'ejs')
app.get('/perfil', (req, res) => {
  const usuario1 = {
    nome: 'Beatriz Silva',
    prefs: ['Node', 'SQL', 'Cloud']
  }
  // Renderiza views/perfil.ejs
  res.render('perfil.ejs', { user: usuario1 })
})
app.listen(3000)

// middleware para interpretar o corpo da requisição http
// gerado pelo envio de formulários POST
app.use(express.urlencoded());
app.post('/processa_formulario1', (req, res) => {
  // Os dados do formulário ficam disponíveis em req.body
  console.log('req.body (gerado com express.urlencoded): ', req.body)
  res.send('Formulário recebido (veja log no console do Express)')
})

// Para uma URL como /busca?termo=livros
app.get('/busca', (req, res) => {
  // Os dados da query string ficam em req.query
  const termo = req.query.termo;
  res.send(`Você buscou por: ${termo}`);
});
