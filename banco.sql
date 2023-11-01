use loginT;

CREATE TABLE `pacientes` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `cartao_sus` varchar(20) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `ocupacao` varchar(50) DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `municipio` varchar(50) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `tipo_atendimento` varchar(50) DEFAULT NULL,
  `diagnostico` varchar(50) DEFAULT NULL,
  `outras_formas_dm` varchar(50) DEFAULT NULL,
  `data_diagnostico` date DEFAULT NULL,
  `gestante` char(3) DEFAULT NULL,
  `semanas_gestacao` int DEFAULT NULL,
  `amamentando` char(3) DEFAULT NULL,
  `tempo_pos_parto` varchar(20) DEFAULT NULL,
  `deficiencia` char(3) DEFAULT NULL,
  `tipo_deficiencia` varchar(50) DEFAULT NULL,
  `historico_dm1` char(3) DEFAULT NULL,
  `parentesco_dm1` varchar(50) DEFAULT NULL,
  `historico_dm2` char(3) DEFAULT NULL,
  `parentesco_dm2` varchar(50) DEFAULT NULL,
  `historico_outras_formas_dm` char(3) DEFAULT NULL,
  `parentesco_outras_formas_dm` varchar(50) DEFAULT NULL,
  `metodo_insulina` varchar(50) DEFAULT NULL,
  `marca_modelo_bomba` varchar(50) DEFAULT NULL,
  `metodo_monitoramento_glicemia` varchar(50) DEFAULT NULL,
  `marca_modelo_glicometro_sensor` varchar(50) DEFAULT NULL,
  `uso_app_glicemia` varchar(50) DEFAULT NULL,
  `outros_apps` varchar(255) DEFAULT NULL,
  `nome_responsavel` varchar(255) DEFAULT NULL,
  `cpf_responsavel` varchar(20) DEFAULT NULL,
  `rg_responsavel` varchar(20) DEFAULT NULL,
  `parentesco_responsavel` varchar(50) DEFAULT NULL,
  `telefone_responsavel` varchar(20) DEFAULT NULL,
  `ocupacao_responsavel` varchar(50) DEFAULT NULL,
  `data_nascimento_responsavel` date DEFAULT NULL,
  `anexar` blob,
  `auxilio` varchar(50) DEFAULT NULL,
  `outros_auxilios` varchar(255) DEFAULT NULL,
  `possui_celular_com_acesso_a_internet` char(3) DEFAULT NULL,
  `datecadastro` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `login` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `ra` varchar(45) NOT NULL,
  `curso` varchar(45) NOT NULL,
  `cpf` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pacientes_login` (
  `paciente_id` int(5) unsigned NOT NULL,
  `login_id` int(5) unsigned NOT NULL,
  PRIMARY KEY (`paciente_id`,`login_id`),
  KEY `login_id` (`login_id`),
  CONSTRAINT `pacientes_login_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pacientes_login_ibfk_2` FOREIGN KEY (`login_id`) REFERENCES `login` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `agendamentos` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int(5) unsigned NOT NULL,
  `data_agendamento` DATETIME NOT NULL,
  `hora_agendamento` TIME NOT NULL,
  `especialidade_med` varchar(40) NOT NULL,
  `observacao` TEXT,
  `usuario_id` int(5) unsigned,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `login` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
