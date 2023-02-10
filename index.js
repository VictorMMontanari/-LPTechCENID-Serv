const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require('jsonwebtoken');
const saltRounds = 10;
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

  db.query("SELECT * FROM login WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length == 0) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO login (email, password) VALUE (?,?)",
          [email, hash],
          (error, response) => {
            if (err) {
              res.send(err);
            }

            res.send({ msg: "Usuário cadastrado com sucesso" });
          }
        );
      });
    } else {
      res.send({ msg: "Email já cadastrado" });
    }
  });
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
    }) //fim da conexão.query() 
  }) //fim do db.connection()
  }) //fim do app.post()

/* ------------------------------###-------------------------------- */

app.post("/validate", async (req, res) => {
  const {token} = req.body;

  try {
    if (token) {
      decoded = jwt_decode(token);
      result=(Object.keys(decoded).map(function(prop){ return decoded[prop];}))[0][0];
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
