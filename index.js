const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Cenid123@@",
  database: "loginT",
});

// configurando o body-parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.post('/tabelaPaciente', (req, res) => {
  const searchTerm = req.body.searchTerm;
  const columns = req.body.columns || [];

  if (searchTerm.length >= 3) {
    let query = `SELECT * FROM pacientes WHERE (`;

    columns.forEach((column, index) => {
      if (index !== 0) {
        query += ' OR ';
      }
      query += `${column} LIKE '%${searchTerm}%'`;
    });

    query += `)`;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ error: 'Ocorreu um erro ao executar a consulta' });
      } else {
        res.json(results);
      }
    });
  } else {
    res.status(400).json({ error: 'O termo de pesquisa deve ter pelo menos três caracteres' });
  }
});

//----------------------------------------------------------------------------------------------------------------------------//

app.post("/atualizar", (req, res) => {
  const { id, nome, cpf, rg, sus, DataNascimento, telefone, selectsexo, endereco, numero,
    nome_responsavel, cpf_responsavel, rg_responsavel, parentesco_responsavel, telefone_responsavel, ocupacao_responsavel,
    DataNascimentoResponsavel } = req.body;
  console.log(id);
  db.query("UPDATE pacientes SET nome = ?, cpf = ?, rg = ?, cartao_sus = ?, data_nascimento = ?, telefone = ?, sexo = ?, endereco = ?, numero = ?, nome_responsavel = ?, cpf_responsavel = ?, rg_responsavel = ?, parentesco_responsavel = ?, telefone_responsavel = ?, ocupacao_responsavel = ?, data_nascimento_responsavel = ? WHERE id = ?;",
  [nome, cpf, rg, sus, DataNascimento, telefone, selectsexo, endereco, numero,
    nome_responsavel, cpf_responsavel, rg_responsavel, parentesco_responsavel, telefone_responsavel, ocupacao_responsavel,
    DataNascimentoResponsavel,id], (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send({ msg: "Erro ao atualizar cadastro" });
      } else {
        console.log("teste", response); // Não é necessario 
        res.send({ msg: "Cadastro atualizado com sucesso" });
      }
    });
});

//----------------------------------------------------------------------------------------------------------------------------//

app.post("/registernovo", (req, res) => {
  const { datecadastro, nome, cpfForm, cartao_sus, rg, telefone, data_nascimento, email, ocupacao, sexo, endereco, municipio, numero, tipo_atendimento,
    diagnostico, outras_formas_dm, data_diagnostico, gestante, semanas_gestacao, amamentando, tempo_pos_parto, deficiencia, tipo_deficiencia, historico_dm1, parentesco_dm1, historico_dm2, parentesco_dm2, historico_outras_formas_dm, parentesco_outras_formas_dm, metodo_insulina,
    marca_modelo_bomba, metodo_monitoramento_glicemia, marca_modelo_glicometro_sensor, uso_app_glicemia, outros_apps, nome_responsavel, cpf_responsavel, rg_responsavel, parentesco_responsavel,
    telefone_responsavel, ocupacao_responsavel, data_nascimento_responsavel, anexar, auxilio, outros_auxilios, possui_celular_com_acesso_a_internet, idLogin } = req.body;

  const objetoSerializado = JSON.stringify(anexar);
  const pdfBuffer = Buffer.from(objetoSerializado.split(",")[1], "base64");

  db.query("SELECT * FROM pacientes WHERE cpf = ?;", [cpfForm], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: "Erro ao verificar cpf" });
    } else if (result.length > 0) {
      console.log("CPF já cadastrado");
      res.send({ msg: "CPF já cadastrado" });
    } else {
      db.query(
        "INSERT INTO pacientes (nome, cpf, cartao_sus, rg, telefone, data_nascimento, email, ocupacao, sexo, endereco, municipio, numero, tipo_atendimento, diagnostico, outras_formas_dm, data_diagnostico, gestante, semanas_gestacao, amamentando, tempo_pos_parto, deficiencia, tipo_deficiencia, historico_dm1, parentesco_dm1, historico_dm2, parentesco_dm2, historico_outras_formas_dm, parentesco_outras_formas_dm, metodo_insulina, marca_modelo_bomba, metodo_monitoramento_glicemia, marca_modelo_glicometro_sensor, uso_app_glicemia, outros_apps, nome_responsavel, cpf_responsavel, rg_responsavel, parentesco_responsavel, telefone_responsavel, ocupacao_responsavel, data_nascimento_responsavel, anexar, auxilio, outros_auxilios, possui_celular_com_acesso_a_internet, datecadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [nome, cpfForm, cartao_sus, rg, telefone, data_nascimento, email, ocupacao, sexo, endereco, municipio, numero, tipo_atendimento,
          diagnostico, outras_formas_dm, data_diagnostico, gestante, semanas_gestacao, amamentando, tempo_pos_parto, deficiencia, tipo_deficiencia, historico_dm1, parentesco_dm1, historico_dm2, parentesco_dm2, historico_outras_formas_dm, parentesco_outras_formas_dm, metodo_insulina,
          marca_modelo_bomba, metodo_monitoramento_glicemia, marca_modelo_glicometro_sensor, uso_app_glicemia, outros_apps, nome_responsavel, cpf_responsavel, rg_responsavel, parentesco_responsavel,
          telefone_responsavel, ocupacao_responsavel, data_nascimento_responsavel, pdfBuffer, auxilio, outros_auxilios, possui_celular_com_acesso_a_internet, datecadastro],
        (error, response) => {
          if (error) {
            console.error(error);
            res.status(500).send({ msg: "Erro ao cadastrar Paciente" });
          } else {
            const paciente_id = response.insertId;
            const login_id = idLogin;

            db.query(
              "INSERT INTO pacientes_login (paciente_id, login_id) VALUES (?, ?);",
              [paciente_id, login_id],
              (err, result) => {
                if (err) {
                  console.error(err);
                  res.status(500).send({ msg: "Erro ao cadastrar Paciente" });
                } else {
                  console.log("Paciente cadastrado com sucesso");
                  res.send({ msg: "Paciente cadastrado com sucesso" });
                }
              }
            );
          }
        }
      );
    }
  });
});

/* ------------------------------###-------------------------------- */

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const type = req.body.type;
  const phone = req.body.phone;
  const ra = req.body.ra;
  const curso = req.body.curso;
  const cpf = req.body.cpf;


  db.query("SELECT * FROM login WHERE email = ?;", [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: "Erro ao verificar email" });
    } else if (result.length == 0) {
      const hash = password; // Assuming this function exists
      db.query(
        "INSERT INTO login (email, password, name, type, phone, ra, curso, cpf) VALUES (?,?,?,?,?,?,?,?);",
        [email, hash, name, type, phone, ra, curso, cpf],
        (error, response) => {
          if (error) {
            console.error(error);
            res.status(500).send({ msg: "Erro ao cadastrar usuário" });
          } else {
            console.log("teste", response);
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

app.put("/update/:id", (req, res) => {
  const userId = req.params.id; // Parâmetro de rota para identificar o usuário a ser atualizado
  const { email, password, name, type, phone, ra, curso, cpf } = req.body;

  // Verifique se o usuário existe com base no ID
  db.query("SELECT * FROM login WHERE id = ?;", [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: "Erro ao buscar o usuário" });
    } else if (result.length === 0) {
      res.status(404).send({ msg: "Usuário não encontrado" });
    } else {
      // Atualize as informações do usuário
      const hash = password; // Lembre-se de usar uma função segura para hash de senhas

      db.query(
        "UPDATE login SET email=?, password=?, name=?, type=?, phone=?, ra=?, curso=?, cpf=? WHERE id = ?;",
        [email, hash, name, type, phone, ra, curso, cpf, userId],
        (error, response) => {
          if (error) {
            console.error(error);
            res.status(500).send({ msg: "Erro ao atualizar o usuário" });
          } else {
            console.log("Usuário atualizado com sucesso");
            res.status(200).send({ msg: "Usuário atualizado com sucesso" });
          }
        }
      );
    }
  });
});


/* ------------------------------###-------------------------------- */

app.post('/tabela', async (req, res) => {

  db.query(
    "SELECT id, name, email, type, phone, ra, curso, cpf FROM login order by id;",
    (error, response) => {
      try {
        if (error) {
          console.error(error);
          res.status(500).send({ msg: "Erro ao cadastrar usuário" });
        } else {
          const lista_usuarios = { records: {} };
          for (let i = 0; i < response.length; i++) {
            const { id, name, email, type, phone, ra, curso, cpf } = response[i];
            lista_usuarios.records[id] = { id, name, email, type, phone, ra, curso, cpf };
          }
          res.json(lista_usuarios);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
      }
    }
  );
});


/* ------------------------------###-------------------------------- */

app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.getConnection(async (err, db) => {
    if (err) throw (err)
    const sqlSearch = "SELECT * FROM login WHERE email = ?"
    const search_query = mysql.format(sqlSearch, [email])
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
          const token = jwt.sign({ id: result }, 's', { expiresIn: 5 });
          res.json({ user: result, token: token });
        } else {
          res.send("Senha incorreta!");
          console.log("Senha incorreta!")
        } //fim da senha incorreta
      } // fim do email existe
    })
  }) //fim da conexão.query() 
}) //fim do db.connection() /

/* ------------------------------###-------------------------------- */

app.post("/agendar", (req, res) => {
  const idpaciente = req.body.idpaciente;
  const userid = req.body.userid;
  const dataconsulta = req.body.dataconsulta;
  const hora = req.body.hora;
  const espmed = req.body.espmed;
  const obser = req.body.obser;

  // Exemplo de código para inserir dados na tabela agendamentos
  const query = "INSERT INTO agendamentos (paciente_id, data_agendamento, hora_agendamento, especialidade_med, observacao, usuario_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [idpaciente, dataconsulta, hora, espmed, obser, userid], (err, result) => {
    if (err) {
      console.error("Erro ao inserir os dados no banco de dados: " + err);
      res.status(500).json({ error: "Erro ao agendar consulta" });
    } else {
      console.log("Dados inseridos com sucesso na tabela agendamentos.");
      res.status(200).json({ message: "Consulta agendada com sucesso" });
    }
  });
});

app.get("/agendamentos", (req, res) => {
  // Exemplo de código para buscar os agendamentos na tabela agendamentos
  const query = "SELECT * FROM agendamentos";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao buscar os agendamentos no banco de dados: " + err);
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    } else {
      console.log("Agendamentos encontrados com sucesso.");
      res.status(200).json(result); // Retorna os dados dos agendamentos em formato JSON
    }
  });
});



/* ------------------------------###-------------------------------- */

app.post("/validate", async (req, res) => {
  const { token } = req.body;

  try {
    if (token) {
      decoded = jwt_decode(token);
      result = (Object.keys(decoded).map(function (prop) { return decoded[prop]; }))[0][0];
      res.json({ status: true, user: result }).stop
    } else {
      res.json({ status: false })
    }

  } catch (error) {
    return res.status(500).json({ error: error })
  }
});


app.post('/logout', function (req, res) {
  // remove a propriedade req.user e limpa a sessão de login
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.listen(3005, () => {
  console.log("rodando na porta 3005");
});
