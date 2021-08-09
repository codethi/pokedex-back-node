/* Instalar o node: https://nodejs.org/en/ */
/* Iniciar um projeto node no terminal: npm init (Gera um package.json) */
/* Instalar o express: https://www.npmjs.com/package/express */
/* Para não precisarmos ficar parando nossa aplicação a cada modificação, podemos adicionar uma dependencia chamada nodemon, que vai atualizar nossa aplicação a cada mudança, abra o terminal e digite: npm i -D nodemon | Se der erro de comando não encontrado, instale ele goblamente também: npm i -g nodemon */

/* Para não ficar digitando toda hora nodemon e o nome do app pra rodar a aplicação, basta substituir as linhas do script no package.json para essas:

"scripts": {
  "start": "node index",
  "dev": "nodemon index"
},
  
Agora basta digitar no terminal: npm start (roda sem o nodemon) ou npm run dev (roda o nodemon)  
*/


// Template inicial de uma aplicação com express
const express = require('express') /* Importa o express para a const express */
var bodyParser = require('body-parser')
const app = express() /*  Inicializa o express na const app */

const port = 3000 /* Para evitar repetição de valor, insiro a porta em uma const */

app.use(bodyParser.json())

const pokedex = [
  /* {
    "id": 1,
    "nome": "Bulbasaur",
    "tipo": "Grass"
  } */
]

// [GET] - /pokedex
app.get('/pokedex', (req, res) => {
  res.send(pokedex.filter(Boolean)) // filter(Boolean) mostra apenas o que tiver valor.
})

// [GET] - /pokedex/{id}
app.get('/pokedex/:id', (req, res) => {
  const id = req.params.id - 1 // Pega o parametro enviado na requisição da rota
  const pokemon = pokedex[id]

  /* Se não existir um pokemon, retorne essa mensagem.*/
  if(!pokemon){
    res.send("Pokemon não encontrado")
    return
  }

  res.send(pokemon)
  
})

// [POST] - /pokedex
app.post('/pokedex', (req, res) => {
  const pokemon = req.body

  if (!pokemon || !pokemon.nome || !pokemon.tipo){
    res.send('Pokemon inválido')
    return
  }

  pokemon.id = pokedex.length + 1 /* Cria id's diferentes a cada post */
  pokedex.push(pokemon)
  res.send(`Pokemon inserido com sucesso: ${pokemon}`)
})

// [PUT] - /pokedex/id
app.put('/pokedex/:id', (req, res) => {
  const id = req.params.id - 1 // Pega o parametro enviado na requisição da rota
  const pokemon = pokedex[id]
  const nome = req.body.nome
  const tipo = req.body.tipo

  if (!nome || !tipo){
    res.send('Pokemon inválido.')
    return
  }

  pokemon.nome = nome
  pokemon.tipo = tipo

  res.send(`Pokemon atualizado com sucesso: ${pokemon}`)
})

// [DELETE] - /pokedex/id
app.delete('/pokedex/:id', (req, res) => {
  const id = req.params.id - 1  // Pega o parametro enviado na requisição da rota
  delete pokedex[id]
  res.send(`Pokemon removido com sucesso: ${pokedex}`)
})

/* Porta pela qual meu app vai ser chamado, ele vai ficar 'ouvindo' quem me chamar pela porta 300 (http:localhost:3000) */
app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`)
})



