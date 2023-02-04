const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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

  console.log(email);
  console.log(password);
  db.getConnection ( async (err, db)=> {
  if (err) throw (err) 
  const sqlSearch = "SELECT * FROM login WHERE email = ?" 
  const search_query = mysql.format(sqlSearch,[email])
  db.query(search_query, async (err, result) => {
      db.release()
      console.log(result);

      if (err)
        throw (err);
      if (result.length == 0) {
        console.log("--------> email não existe");
        res.sendStatus(404);
      }
      else {
        const hasshedPassword = result[0].password;
        /* console.log(typeof hasshedPassword);
        console.log(typeof password);
        console.log(await bcrypt.compare(password, hasshedPassword)); */
        
        // obter o hashPassword do result
        if (password === hasshedPassword) {
          console.log("---------> Login bem-sucedido");
          console.log("---------> Gerando accessToken"); 
          const token = jwt.sign({id: result}, 's');
          console.log(result);
          /* results = JSON.stringify(result[0]);
          id = results;
          console.log(id); */
          var resultado = result;
          var ids = [];
          for(i = 0; i< resultado.length; i++){    
              if(ids.indexOf(resultado[i].id) === -1){
                  ids.push(resultado[i].id);        
              }        
          }
          for(i = 0; i< ids.length; i++){
              id = ids[i];     
          }
          console.log(id);
          console.log(token);
          res.json({user: result, token: token});
        
          if (token != "") {
            db.query("update login SET token = ? Where id = ?", [token, id], (err, result) => {
              if (err) {
                res.send(err);
              }
            });
          }

        } else {
          res.send("Senha incorreta!");
          console.log("Senha incorreta!")
        } //fim da senha incorreta
      } // fim do email existe
    }) //fim da conexão.query() 
  }) //fim do db.connection()
  }) //fim do app.post()

/* ------------------------------###-------------------------------- */

/* app.post("/validate", (req, res)=> {
  const token = req.body.token;
  db.getConnection ( async (db)=> { 
  const sqlSearch = "SELECT * FROM login WHERE email = ?" 
  const search_query = mysql.format(sqlSearch,[email])
  db.query(search_query, async (result) => {
      db.release()
      console.log(result); 
      if (email) {
        res.json({user: result})
      }
    })
  })
}) */


app.listen(3005, () => {
  console.log("rodando na porta 3005");
});