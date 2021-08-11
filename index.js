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

/* Coloque sempre o ; se não da problema para functions async */

// Template inicial de uma aplicação com express
const express = require('express'); /* Importa o express para a const express */
const bodyParser = require('body-parser'); /* instalar via terminal: npm i body-parser */
const mongodb = require('mongodb'); /* instalar via terminal: npm i mongodb */

/* Para utilizar o await, eu preciso envolver todo o meu código dentro dessa função assincrona. */
(async () => {

  const connectionString = 'mongodb://localhost:27017/pokedex'; /* Conexão com o banco de dados local */
  console.info('Conectando ao banco de dados MongoDB...'); /* Informando que está conectando ao banco */

  /* Configuração do Mongo que evita problemas na conexão com o banco. Para mais detalhes segue doc que explica o porque essa config é necessária em versões mais novas do MongoDB: https://github.com/mongodb/node-mongodb-native/releases/tag/v3.2.1 */
  const options = { useUnifiedTopology: true };

  /* Para construção efetiva da conexão no mongo precisamos criar um client, essa conexão demora alguns ms para acontecer, porém o JS não espera a conexão ser feita, ele já pula pra próxima linha, por isso precisamos colocar o await antes da operação para o JS esperar essa linha ser concluida, para ai sim seguir com o código. */
  const client = await mongodb.MongoClient.connect(connectionString, options);
  //console.log(client) /* Verificar a Promise sem o await */
  const app = express(); /*  Inicializa o express na const app */
  const port = 3000; /* Para evitar repetição de valor, insiro a porta em uma const */

  app.use(bodyParser.json());

  const db = client.db('pokedex')
  const pokedex = db.collection('pokemon')

  // console.log(await pokemon.find({}).toArray()) /* findall no meu banco */

  // [GET] - /pokedex

  /* Preciso colocar o async pois estou dentro de outra function */
  app.get('/pokedex', async (req, res) => {
    res.send(await pokedex.find({}).toArray()) // filter(Boolean) mostra apenas o que tiver valor.
  });

  // [GET] - /pokedex/{id}
  app.get('/pokedex/:id', async (req, res) => {
    const id = req.params.id // Pega o parametro enviado na requisição da rota | O + transforma o parmetro em number.
    const pokemon = await pokedex.findOne({ _id: mongodb.ObjectId(id) }) // procura o id dentro de cada objeto.

    /* Se não existir um pokemon, retorne essa mensagem.*/
    if (!pokemon) {
      res.send("Pokemon não encontrado")
      return
    }
    res.send(pokemon)

  })

  // [POST] - /pokedex
  app.post('/pokedex', async (req, res) => {
    const pokemon = req.body;

    if (!pokemon || !pokemon.nome || !pokemon.tipo || !pokemon.descricao) {
      res.send('Pokemon inválido');
      return;
    };

    /* Para desconstruir o objeto e pegar apenas o atributo insertedCount, basta envolver o atributo com { } */
    const { insertedCount } = await pokedex.insertOne(pokemon);

    if (insertedCount !== 1) {
      res.send(`Ocorreu um erro ao inserir o pokemon`);
      return;
    }

    res.send(`Pokemon inserido com sucesso!`);
  })

  // [PUT] - /pokedex/id
  app.put('/pokedex/:id', async (req, res) => {
    // Pega o parametro enviado na requisição da rota | O + transforma o parmetro em number.
    const id = req.params.id

    // Pega o objeto enviado no body da requisição
    const novoPokemon = req.body

    // Verificar se a mensagem chegou do body
    if (!novoPokemon || !novoPokemon.nome || !novoPokemon.tipo || !novoPokemon.descricao) {
      res.send('Pokemon inválido.')
      return
    }

    // Pega a quantidade de pokemons com esse id
    const qtdPokemon = await pokedex.countDocuments({ _id: mongodb.ObjectId(id) })

    // Verificar se o pokemon existe:
    if (qtdPokemon !== 1) {
      res.send(`Pokemon não encontrado`);
      return;
    }

    const { result } = await pokedex.updateOne(
      {
        _id: mongodb.ObjectId(id)
      },
      {
        $set: novoPokemon
      }
    )

    if (result.ok !== 1) {
      res.send(`Ocorreu um erro ao remover o pokemon`);
      return;
    }

    res.send(novoPokemon)
  })

  // [DELETE] - /pokedex/id
  app.delete('/pokedex/:id', async (req, res) => {
    const id = req.params.id  // Pega o parametro enviado na requisição da rota 

    // Pega a quantidade de pokemons com esse id
    const qtdPokemon = await pokedex.countDocuments({ _id: mongodb.ObjectId(id) })

    // Verificar se o pokemon existe:
    if (qtdPokemon !== 1) {
      res.send(`Pokemon não encontrado`);
      return;
    }

    // Apaga o pokemon expecifico de acordo com o id e pega o atributo deletedCount
    const { deletedCount } = await pokedex.deleteOne({ _id: mongodb.ObjectId(id) })

    if (deletedCount !== 1) {
      res.send(`Ocorreu um erro ao remover o pokemon`);
      return;
    }

    res.send(`Pokemon removido com sucesso!`)
  })



  /* Porta pela qual meu app vai ser chamado, ele vai ficar 'ouvindo' quem me chamar pela porta 300 (http:localhost:3000) */
  app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`)
  })

})(); /* Esse parenteses executa a função async */

