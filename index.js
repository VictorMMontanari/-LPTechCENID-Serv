const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "SAc701@@",
  database: "loginT",
});

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const type = req.body.type;
  const phone = req.body.phone;
  const ra = req.body.ra;

  console.log(password)

  db.query("SELECT * FROM login WHERE email = ?;", [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: "Erro ao verificar email" });
    } else if (result.length == 0) {
      const hash = password; // Assuming this function exists
      db.query(
        "INSERT INTO login (email, password, name, type, phone, ra) VALUES (?,?,?,?,?,?);",
        [email, hash, name, type, phone, ra],
        (error, response) => {
          if (error) {
            console.error(error);
            res.status(500).send({ msg: "Erro ao cadastrar usuário" });
          } else {
            console.log(response);
            res.send({ msg: "Usuário cadastrado com sucesso" });
          }
        }
      );
    } else {
      console.log("Email já cadastrado");
      
      res.send({ msg: "Email já cadastrado" });
    }
  });  
});

/* ------------------------------###-------------------------------- */


app.post("/tabela", async (req, res) => {
  const query_usuario = "SELECT id, name, email, type, phone, ra FROM login order by id;";
  const result_usuario = await fetch('url/to/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query_usuario
    })
  });

  if (result_usuario.ok) {
    const data = await result_usuario.json();
    const lista_usuarios = { records: {} };

    for (let i = 0; i < data.length; i++) {
      const { id, name, email, type, phone, ra } = data[i];

      lista_usuarios.records[id] = { id, name, email, type, phone, ra };
    }
    console.log(lista_usuarios);
    // Retornar os produtos em formato json
    res.status(200).json(lista_usuarios);
  } else {
    // Se a requisição não for bem-sucedida, enviar uma resposta de erro
    res.status(result_usuario.status).json({ error: "Erro ao buscar usuario" });
  }
}); 


/* ------------------------------###-------------------------------- */

app.post("/signin", (req, res)=> {
  const email = req.body.email;
  const password = req.body.password;

  db.getConnection ( async (err, db)=> {
  if (err) throw (err) 
  const sqlSearch = "SELECT * FROM login WHERE email = ?" 
  const search_query = mysql.format(sqlSearch,[email])
    db.query(search_query, async (err, result) => {
      db.release()
      if (err)
        throw (err);
      if (result.length == 0) {
        console.log("--------> email não existe");
        res.sendStatus(404);
      }
      else {
        const hasshedPassword = result[0].password;
        if (password === hasshedPassword) {
          console.log("---------> Login bem-sucedido");
          console.log("---------> Gerando accessToken");
          const token = jwt.sign({id: result}, 's', {expiresIn: 5});
          res.json({user: result, token: token});
        } else {
          res.send("Senha incorreta!");
          console.log("Senha incorreta!")
        } //fim da senha incorreta
      } // fim do email existe
    })
  }) //fim da conexão.query() 
}) //fim do db.connection() /

/* ------------------------------###-------------------------------- */

app.post("/validate", async (req, res) => {
  const {token} = req.body;

  try {
    if (token) {
      decoded = jwt_decode(token);
      result = (Object.keys(decoded).map(function(prop){return decoded[prop];}))[0][0];
      res.json({status: true, user: result}).stop
    } else {
      res.json({status: false})
    } 

  } catch(error) {
      return res.status(500).json({error: error})
  }
});


app.post('/logout', function(req, res) {
  // remove a propriedade req.user e limpa a sessão de login
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.listen(3005, () => {
  console.log("rodando na porta 3005");
});
