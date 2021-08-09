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
const app = express() /*  Inicializa o express na const app */
const port = 3000 /* Para evitar repetição de valor, insiro a porta em uma const */

/* Rota inicial, respondendo(res) 'Hello World' */
app.get('/', (req, res) => {
  res.send('Hello World')
})

/* Porta pela qual meu app vai ser chamado, ele vai ficar 'ouvindo' quem me chamar pela porta 300 (http:localhost:3000) */
app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`)
})



