-- Adiciona a avaliação da experiência às publicações existentes.
-- Execute no banco boatour_bd depois da migração da galeria.
USE `boatour_bd`;

SET @coluna_nota_experiencia_existe = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'publicacoes_viagens'
      AND COLUMN_NAME = 'nota_experiencia'
);

SET @sql_migracao_nota = IF(
    @coluna_nota_experiencia_existe = 0,
    'ALTER TABLE `publicacoes_viagens` ADD COLUMN `nota_experiencia` TINYINT UNSIGNED DEFAULT NULL AFTER `pais`',
    'SELECT 1'
);

PREPARE migracao_nota_publicacoes FROM @sql_migracao_nota;
EXECUTE migracao_nota_publicacoes;
DEALLOCATE PREPARE migracao_nota_publicacoes;
