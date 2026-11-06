-- Migração da tabela de notificações para a base usada pela aplicação.
-- Não cria nem apaga bancos de dados e não insere dados de teste.
USE `boatour_bd`;

CREATE TABLE IF NOT EXISTS `notificacoes` (
  `id_notificacao` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(40) NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `mensagem` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `referencia_tipo` varchar(40) DEFAULT NULL,
  `referencia_id` varchar(80) DEFAULT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_leitura` datetime DEFAULT NULL,
  PRIMARY KEY (`id_notificacao`),
  KEY `idx_notificacoes_usuario_data` (`id_usuario`, `data_criacao`),
  KEY `idx_notificacoes_nao_lidas` (`id_usuario`, `lida`),
  CONSTRAINT `fk_notificacoes_usuario`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
