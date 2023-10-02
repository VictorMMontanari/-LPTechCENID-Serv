SELECT * FROM loginT.login;

CREATE TABLE `login` (
  `id` int(5) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `ra` varchar(45) NOT NULL,
  `curso` varchar(45) NOT NULL,
  `cpf` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pacientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  cpf VARCHAR(11),
  cartao_sus VARCHAR(20),
  rg VARCHAR(20),
  telefone VARCHAR(20),
  data_nascimento DATE,
  email VARCHAR(255),
  ocupacao VARCHAR(50),
  sexo VARCHAR(10),
  endereco VARCHAR(255),
  municipio VARCHAR(50),
  numero VARCHAR(10),
  tipo_atendimento VARCHAR(50),
  diagnostico VARCHAR(50),
  outras_formas_dm VARCHAR(50),
  data_diagnostico DATE,
  
  gestante CHAR(3),
  semanas_gestacao INT,
  amamentando CHAR(3),
  tempo_pos_parto VARCHAR(20),
  
  deficiencia CHAR(3),
  tipo_deficiencia VARCHAR(50),
  
  historico_dm1 CHAR(3),
  parentesco_dm1 VARCHAR(50),
  
  historico_dm2 CHAR(3),
  parentesco_dm2 VARCHAR(50),
  
  historico_outras_formas_dm CHAR(3),
  parentesco_outras_formas_dm VARCHAR(50),
  
  metodo_insulina VARCHAR(50),
  marca_modelo_bomba VARCHAR(50),
  
  metodo_monitoramento_glicemia VARCHAR(50),
  marca_modelo_glicometro_sensor VARCHAR(50),
  
  uso_app_glicemia VARCHAR(50),
  outros_apps VARCHAR(255),
  
  nome_responsavel VARCHAR(255),
  cpf_responsavel VARCHAR(11),
  rg_responsavel VARCHAR(20),
  parentesco_responsavel VARCHAR(50),
  telefone_responsavel VARCHAR(20),
  ocupacao_responsavel VARCHAR(50),
  data_nascimento_responsavel DATE,
  
  arquivo BLOB,
  auxilio VARCHAR(50),
  outros_auxilios VARCHAR(255),
  possui_celular_com_acesso_a_internet CHAR(3)
);

CREATE TABLE `pacientes_login` (
  `paciente_id` int(5) unsigned zerofill NOT NULL,
  `login_id` int(5) unsigned zerofill NOT NULL,
  PRIMARY KEY (`paciente_id`, `login_id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;