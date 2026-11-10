-- =========================================================
-- GALERIA DE VIAJANTES - MIGRACAO PARA O BOATOUR
-- Banco alvo: boatour_bd (arquivo recebido: boatour_bd (10).sql)
-- Cria as tres tabelas relacionadas a publicacoes da galeria.
-- Nao altera nem apaga tabelas existentes.
-- =========================================================

USE `boatour_bd`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS `publicacoes_viagens` (
  `id_publicacao` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `cidade` varchar(120) NOT NULL,
  `pais` varchar(120) NOT NULL,
  `nota_experiencia` tinyint(3) UNSIGNED DEFAULT NULL,
  `data_publicacao` datetime NOT NULL DEFAULT current_timestamp(),
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_publicacao`),
  KEY `idx_publicacoes_usuario` (`id_usuario`),
  KEY `idx_publicacoes_data` (`data_publicacao`),
  CONSTRAINT `fk_publicacoes_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fotos_publicacoes` (
  `id_foto` int(11) NOT NULL AUTO_INCREMENT,
  `id_publicacao` int(11) NOT NULL,
  `caminho_foto` varchar(500) NOT NULL,
  `ordem` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `data_envio` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_foto`),
  UNIQUE KEY `uq_publicacao_ordem` (`id_publicacao`, `ordem`),
  CONSTRAINT `fk_fotos_publicacao` FOREIGN KEY (`id_publicacao`)
    REFERENCES `publicacoes_viagens` (`id_publicacao`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_publicacao` int(11) NOT NULL,
  `nota` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `data_avaliacao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_avaliacao`),
  UNIQUE KEY `unique_avaliacao` (`id_usuario`, `id_publicacao`),
  KEY `idx_avaliacao_publicacao` (`id_publicacao`),
  CONSTRAINT `fk_avaliacao_publicacao` FOREIGN KEY (`id_publicacao`)
    REFERENCES `publicacoes_viagens` (`id_publicacao`) ON DELETE CASCADE,
  CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conferencia: as tres tabelas devem aparecer.
SHOW TABLES LIKE 'publicacoes_viagens';
SHOW TABLES LIKE 'fotos_publicacoes';
SHOW TABLES LIKE 'avaliacoes';
