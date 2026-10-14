
-- Colocar para surgimento do token temporario
-- ALTER TABLE usuarios
-- ADD COLUMN token_recuperacao VARCHAR(100) NULL,
-- ADD COLUMN token_expira DATETIME NULL;



-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/09/2026 às 16:50
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `boatour_bd`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias_destino`
--

CREATE TABLE `categorias_destino` (
  `id_categoria` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias_destino`
--

INSERT INTO `categorias_destino` (`id_categoria`, `nome`) VALUES
(2, 'Cidade'),
(6, 'Cultura'),
(4, 'Entretenimento'),
(5, 'História'),
(3, 'Natureza'),
(1, 'Praia'),
(7, 'Turismo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `destinos`
--

CREATE TABLE `destinos` (
  `id_destino` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `preco_base` decimal(10,2) DEFAULT NULL,
  `dias` int(11) DEFAULT NULL,
  `praia_popular` tinyint(1) DEFAULT 0,
  `destaque` tinyint(1) DEFAULT 0,
  `ods8` tinyint(1) DEFAULT 0,
  `ods12` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `destinos`
--

INSERT INTO `destinos` (`id_destino`, `nome`, `pais`, `cidade`, `descricao`, `imagem`, `tipo`, `preco_base`, `dias`, `praia_popular`, `destaque`, `ods8`, `ods12`) VALUES
(1, 'Fernando de Noronha', 'Brasil', 'Fernando de Noronha', 'Um dos destinos de praia mais conhecidos do Brasil.', 'img01.jpg', 'Praia', 1890.00, 5, 1, 1, 1, 1),
(2, 'Santorini', 'Grécia', 'Santorini', 'Destino famoso pelas casas brancas, cúpulas azuis e belos pores do sol.', 'img02.jpg', 'Praia', 4200.00, 7, 1, 1, 0, 0),
(3, 'Cancún', 'México', 'Cancún', 'Destino famoso pelas praias de águas cristalinas, resorts e paisagens tropicais.', 'img03.jpg', 'Praia', 3200.00, 7, 1, 1, 0, 0),
(4, 'Bali', 'Indonésia', 'Bali', 'Destino famoso pelas praias paradisíacas, templos, natureza exuberante e cultura local.', 'img04.jpg', 'Praia', 3800.00, 7, 1, 1, 1, 1),
(5, 'Maldivas', 'Maldivas', 'Maldivas', 'Destino famoso pelas praias paradisíacas, águas cristalinas e resorts sobre o mar.', 'img05.jpg', 'Praia', 4500.00, 7, 1, 1, 0, 1),
(6, 'Paris', 'França', 'Paris', 'Destino famoso pela Torre Eiffel, museus, arquitetura e gastronomia.', 'paris.jpg', 'Cultura', 3800.00, 7, 0, 0, 0, 0),
(7, 'Roma', 'Itália', 'Roma', 'Destino famoso pelo Coliseu, monumentos históricos e rica cultura.', 'roma.jpg', 'História', 3500.00, 7, 0, 0, 0, 0),
(8, 'Disney Orlando', 'Estados Unidos', 'Orlando', 'Destino conhecido pelos parques temáticos, atrações para toda a família e experiências de entretenimento.', 'disney.jpg', 'Entretenimento', 5000.00, 7, 0, 0, 0, 0),
(9, 'Gramado', 'Brasil', 'Gramado', 'Destino conhecido pelo clima europeu, gastronomia, atrações turísticas e belas paisagens.', 'gramado.jpg', 'Turismo', 2290.00, 4, 0, 0, 1, 0),
(10, 'Foz do Iguaçu', 'Brasil', 'Foz do Iguaçu', 'Destino famoso pelas Cataratas do Iguaçu, natureza exuberante e atrações turísticas.', 'foz.jpg', 'Natureza', 2380.00, 4, 0, 0, 0, 0),
(11, 'Curitiba', 'Brasil', 'Curitiba', 'Destino conhecido pela gastronomia, parques, arquitetura e atrações culturais.', 'curitiba.jpg', 'Turismo', 990.00, 3, 0, 0, 0, 0),
(12, 'Salvador', 'Brasil', 'Salvador', 'Destino conhecido pelas praias, cultura, história, gastronomia e tradições baianas.', 'salvador.jpg', 'Praia', 1990.00, 5, 1, 0, 0, 0),
(13, 'Rio de Janeiro', 'Brasil', 'Rio de Janeiro', 'Destino famoso pelas praias, paisagens, pontos turísticos e pela diversidade cultural.', 'riodejaneiro.jpg', 'Praia', 1790.00, 4, 1, 0, 0, 0),
(14, 'Maceió', 'Brasil', 'Maceió', 'Destino conhecido pelas praias de águas cristalinas, piscinas naturais e paisagens paradisíacas.', 'maceio.jpg', 'Praia', 2390.00, 5, 1, 0, 0, 0),
(15, 'Porto Seguro', 'Brasil', 'Porto Seguro', 'Destino conhecido pelas praias, história, cultura e atrações turísticas da Bahia.', 'porto.jpg', 'Praia', 1990.00, 5, 1, 0, 0, 0),
(16, 'Buenos Aires', 'Argentina', 'Buenos Aires', 'Destino conhecido pela arquitetura, gastronomia, cultura, história e vida urbana.', 'buenosaires.jpg', 'Cultura', 2890.00, 5, 0, 0, 0, 0),
(17, 'Lisboa', 'Portugal', 'Lisboa', 'Destino conhecido pela arquitetura histórica, gastronomia, cultura e belas paisagens.', 'lisboa.jpg', 'Cultura', 6290.00, 8, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `destino_categorias`
--

CREATE TABLE `destino_categorias` (
  `id_destino` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `destino_categorias`
--

INSERT INTO `destino_categorias` (`id_destino`, `id_categoria`) VALUES
(1, 1),
(1, 3),
(1, 7),
(2, 1),
(2, 3),
(2, 6),
(2, 7),
(3, 1),
(3, 3),
(3, 4),
(3, 7),
(4, 1),
(4, 3),
(4, 6),
(4, 7),
(5, 1),
(5, 3),
(5, 7),
(6, 2),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(7, 2),
(7, 5),
(7, 6),
(7, 7),
(8, 2),
(8, 4),
(8, 7),
(9, 3),
(9, 4),
(9, 6),
(9, 7),
(10, 3),
(10, 7),
(11, 2),
(11, 3),
(11, 4),
(11, 6),
(11, 7),
(12, 1),
(12, 2),
(12, 4),
(12, 5),
(12, 6),
(12, 7),
(13, 1),
(13, 2),
(13, 3),
(13, 4),
(13, 5),
(13, 6),
(13, 7),
(14, 1),
(14, 3),
(14, 7),
(15, 1),
(15, 5),
(15, 6),
(15, 7),
(16, 2),
(16, 4),
(16, 5),
(16, 6),
(16, 7),
(17, 2),
(17, 5),
(17, 6),
(17, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int(11) NOT NULL,
  `destino_id` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `nacional` tinyint(1) DEFAULT 0,
  `internacional` tinyint(1) DEFAULT 0,
  `pacote` tinyint(1) DEFAULT 0,
  `dias` int(11) NOT NULL,
  `quantidade_paises` int(11) DEFAULT 1,
  `passagem_aerea` tinyint(1) DEFAULT 0,
  `hospedagem` tinyint(1) DEFAULT 0,
  `passeios` tinyint(1) DEFAULT 0,
  `preco_anterior` decimal(10,2) NOT NULL,
  `preco_atual` decimal(10,2) NOT NULL,
  `ods8` tinyint(1) DEFAULT 0,
  `ods12` tinyint(1) DEFAULT 0,
  `destaque` tinyint(1) DEFAULT 0,
  `tudo_incluso` tinyint(1) DEFAULT 0,
  `cafe_da_manha` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `ofertas`
--

INSERT INTO `ofertas` (`id`, `destino_id`, `titulo`, `descricao`, `imagem`, `nacional`, `internacional`, `pacote`, `dias`, `quantidade_paises`, `passagem_aerea`, `hospedagem`, `passeios`, `preco_anterior`, `preco_atual`, `ods8`, `ods12`, `destaque`, `tudo_incluso`, `cafe_da_manha`) VALUES
(1, 3, 'Cancún All Inclusive', 'Uma experiência completa em Cancún, com voo e hospedagem para aproveitar as praias e atrações do destino.', 'img/ofertas/cancun.jpg', 0, 1, 0, 7, 1, 1, 1, 0, 4410.00, 3672.00, 0, 0, 1, 1, 0),
(2, 1, 'Fernando de Noronha', 'Conheça as belezas naturais de Fernando de Noronha em uma viagem com voo e hospedagem inclusos.', 'img/ofertas/fernando.jpg', 1, 0, 0, 5, 1, 1, 1, 0, 3290.00, 2961.00, 0, 1, 1, 0, 0),
(3, 6, 'Paris - Romance na França', 'Descubra Paris em uma viagem especial pela França, conhecendo seus principais pontos turísticos e experiências culturais.', 'img/ofertas/paris.jpg', 0, 1, 0, 7, 1, 1, 1, 0, 8990.00, 7490.00, 0, 0, 0, 0, 0),
(4, 7, 'Roma Histórica', 'Uma viagem pela história e cultura de Roma, com voo e hospedagem inclusos.', 'img/ofertas/roma.jpg', 0, 1, 0, 8, 1, 1, 1, 0, 6500.00, 5330.00, 0, 0, 1, 0, 0),
(6, NULL, 'Cruzeiro pelo Caribe', 'Cruzeiro pelo Caribe com diversas paradas, experiências e tudo incluso durante a viagem.', 'img/ofertas/caribe.jpg', 0, 1, 1, 6, 1, 0, 0, 0, 6000.00, 4497.00, 0, 0, 1, 1, 0),
(7, NULL, 'Europa Essencial', 'Uma viagem por alguns dos principais destinos da Europa, passando por quatro países e conhecendo diferentes culturas.', 'img/ofertas/europa.jpg', 0, 1, 0, 10, 4, 1, 1, 1, 7999.00, 5993.00, 0, 0, 1, 0, 0),
(9, 8, 'Disney Orlando', 'Uma viagem para Orlando com diversão, parques temáticos e experiências inesquecíveis para toda a família.', 'img/ofertas/disney.jpg', 0, 1, 0, 7, 1, 1, 1, 0, 5000.00, 4093.00, 0, 0, 1, 0, 0),
(10, 9, 'Gramado Romântico', 'Uma viagem especial para Gramado, com clima europeu, gastronomia e passeios românticos.', 'img/ofertas/gramado.jpg', 1, 0, 0, 4, 1, 0, 1, 1, 2490.00, 2292.00, 0, 0, 1, 0, 0),
(11, 10, 'Foz do Iguaçu', 'Conheça as famosas Cataratas do Iguaçu e as belezas naturais de Foz do Iguaçu.', 'img/ofertas/foz.jpg', 1, 0, 0, 4, 1, 1, 1, 0, 2800.00, 2380.00, 0, 0, 1, 0, 0),
(13, 11, 'Curitiba - Fim de semana gastronômico', 'Uma viagem para conhecer a gastronomia, os parques e os principais pontos turísticos de Curitiba.', 'img/ofertas/curitiba.jpg', 1, 0, 0, 3, 1, 0, 1, 0, 1290.00, 990.00, 0, 0, 0, 0, 1),
(14, 12, 'Salvador - Sol e cultura', 'Conheça as praias, a cultura, a história e a gastronomia de Salvador.', 'img/ofertas/salvador.jpg', 1, 0, 0, 5, 1, 1, 1, 0, 2490.00, 1990.00, 0, 0, 0, 0, 0),
(15, 13, 'Rio de Janeiro - Cidade Maravilhosa', 'Conheça as praias, paisagens e principais atrações do Rio de Janeiro.', 'img/ofertas/riodejaneiro.jpg', 1, 0, 0, 4, 1, 0, 1, 1, 2190.00, 1790.00, 0, 0, 0, 0, 0),
(16, 14, 'Maceió - Paraíso Alagoano', 'Uma viagem para conhecer as praias de águas cristalinas e as belezas naturais de Maceió.', 'img/ofertas/maceio.jpg', 1, 0, 0, 5, 1, 1, 1, 0, 2890.00, 2390.00, 0, 0, 0, 0, 0),
(17, 15, 'Porto Seguro - Verão na Bahia', 'Aproveite as praias, a cultura e as atrações de Porto Seguro em uma viagem pela Bahia.', 'img/ofertas/porto.jpg', 1, 0, 0, 5, 1, 1, 1, 0, 2390.00, 1990.00, 0, 0, 0, 0, 0),
(18, 16, 'Buenos Aires - Experiência Argentina', 'Conheça Buenos Aires, sua arquitetura, gastronomia, cultura e principais pontos turísticos.', 'img/ofertas/buenosaires.jpg', 0, 1, 0, 5, 1, 1, 1, 0, 3490.00, 2890.00, 0, 0, 0, 0, 0),
(19, 17, 'Lisboa - Descobrindo Portugal', 'Explore Lisboa e conheça sua arquitetura, história, cultura e gastronomia.', 'img/ofertas/lisboa.jpg', 0, 1, 0, 8, 1, 1, 1, 0, 7490.00, 6290.00, 0, 0, 0, 0, 0),
(22, NULL, 'Pacote Completo - Rio de Janeiro', 'Pacote completo para conhecer as principais atrações do Rio de Janeiro.', 'img/ofertas/riodejaneiro2.jpg', 1, 0, 1, 5, 1, 1, 1, 1, 2890.00, 2190.00, 0, 0, 1, 0, 0),
(23, NULL, 'Pacote de Férias - Gramado', 'Uma viagem especial para conhecer Gramado, Canela e seus principais pontos turísticos.', 'img/ofertas/gramado.jpg', 1, 0, 1, 5, 1, 1, 1, 1, 2650.00, 1990.00, 0, 0, 1, 0, 0),
(24, NULL, 'Experiência em Fernando de Noronha', 'Dias de descanso e contato com as praias e paisagens naturais de Fernando de Noronha.', 'img/ofertas/fernando2.jpg', 1, 0, 1, 6, 1, 1, 1, 1, 5200.00, 4290.00, 0, 0, 0, 0, 0),
(25, NULL, 'Aventura em Foz do Iguaçu', 'Conheça as Cataratas do Iguaçu e aproveite passeios incríveis pela região.', 'img/ofertas/foz.jpg', 1, 0, 1, 4, 1, 1, 1, 1, 2390.00, 1790.00, 0, 0, 1, 0, 0),
(26, NULL, 'Pacote Caribe - Cancún', 'Praias paradisíacas, resorts e experiências inesquecíveis no Caribe.', 'img/ofertas/cancun.jpg', 0, 1, 1, 7, 1, 1, 1, 1, 6900.00, 5490.00, 0, 0, 1, 0, 0),
(27, NULL, 'Experiência Europeia - Paris', 'Conheça Paris, a Torre Eiffel, museus, monumentos e a gastronomia francesa.', 'img/ofertas/paris.jpg', 0, 1, 1, 8, 1, 1, 1, 1, 8900.00, 7290.00, 0, 0, 1, 0, 0),
(28, NULL, 'Ilhas Gregas - Santorini', 'Uma experiência inesquecível pelas paisagens e praias de Santorini.', 'img/ofertas/santorini2.jpg', 0, 1, 1, 7, 1, 1, 1, 1, 10500.00, 8790.00, 0, 0, 0, 0, 0),
(29, NULL, 'Paraíso nas Maldivas', 'Dias de descanso em um dos destinos mais paradisíacos do mundo.', 'img/ofertas/maldivas.jpg', 0, 1, 1, 7, 1, 1, 1, 1, 12900.00, 10490.00, 0, 0, 1, 0, 0),
(30, NULL, 'Tour Cultural por Roma', 'Explore os principais pontos históricos de Roma com passeios guiados.', 'img/ofertas/roma2.jpg', 0, 1, 0, 6, 1, 1, 1, 1, 7200.00, 5990.00, 0, 0, 0, 0, 0),
(31, NULL, 'Aventura em Bonito', 'Flutuação, trilhas, cachoeiras e contato com a natureza em Bonito.', 'img/ofertas/bonito.jpg', 1, 0, 1, 5, 1, 1, 1, 1, 2800.00, 2190.00, 0, 0, 1, 0, 0),
(32, NULL, 'Descubra Florianópolis', 'Aproveite as praias, trilhas e paisagens de Florianópolis.', 'img/ofertas/florianopolis.jpg', 1, 0, 1, 4, 1, 1, 1, 1, 1890.00, 1390.00, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `termos_aceitos` tinyint(1) NOT NULL DEFAULT 0,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `foto_perfil` varchar(255) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `banner_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `cpf`, `email`, `senha`, `termos_aceitos`, `data_cadastro`, `foto_perfil`) VALUES
(12, 'Jullia Volpato Santos', '15093341738', 'volpatosantosjullia@gmail.com', '$2b$10$IK7QoXzL9fRaNeqmKlDRbuEK..Y2CmyOfGBII.nhymmftZPbe2ACa', 1, '2026-09-25 08:48:12', NULL),
(14, 'Jullia Volpato Santos', '15093341733', 'volpatosantos@gmail.com', '$2b$10$Nm3h9I6uLSgoaAJ6Xz1JEuHBi54u5Oj0V4cBMe.dXwLBwQa.YI3.C', 1, '2026-09-25 08:50:49', 'uploads/perfis/perfil_15093341733_1790347725359.png'),
(15, 'Alice Novacoski', '33344455566', 'alice@gmail.com', '$2b$10$Vi7eQeuSxvqBm9pjoLMBc.SlUCqD/k3GSMmPasn353NjEglg7w6xC', 1, '2026-09-25 09:00:30', NULL),
(16, 'Amanda Braz', '44455566677', 'amandabraz@gmai.com', '$2b$10$m1fBd/p27mqMTMNQeQqbfukaBVz9VHSYLvuhXTidLN6l8cbwxLhFW', 1, '2026-09-25 09:06:50', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias_destino`
--
ALTER TABLE `categorias_destino`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `destinos`
--
ALTER TABLE `destinos`
  ADD PRIMARY KEY (`id_destino`);

--
-- Índices de tabela `destino_categorias`
--
ALTER TABLE `destino_categorias`
  ADD PRIMARY KEY (`id_destino`,`id_categoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destino_id` (`destino_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias_destino`
--
ALTER TABLE `categorias_destino`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `destinos`
--
ALTER TABLE `destinos`
  MODIFY `id_destino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `destino_categorias`
--
ALTER TABLE `destino_categorias`
  ADD CONSTRAINT `destino_categorias_ibfk_1` FOREIGN KEY (`id_destino`) REFERENCES `destinos` (`id_destino`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `destino_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_destino` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `ofertas`
--
ALTER TABLE `ofertas`
  ADD CONSTRAINT `ofertas_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id_destino`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
