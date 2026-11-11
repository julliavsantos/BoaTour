-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/11/2026 às 20:32
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
-- Estrutura para tabela `aeroportos`
--

CREATE TABLE `aeroportos` (
  `id_aeroporto` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `codigo_iata` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `aeroportos`
--

INSERT INTO `aeroportos` (`id_aeroporto`, `nome`, `cidade`, `pais`, `codigo_iata`) VALUES
(1, 'Frankfurt am Main', 'Frankfurt', 'Alemanha', 'FRA'),
(2, 'Bangkok', 'Bangkok', 'Tailândia', 'BKK'),
(3, 'São Paulo - Guarulhos', 'São Paulo', 'Brasil', 'GRU'),
(4, 'Rio de Janeiro - Galeão', 'Rio de Janeiro', 'Brasil', 'GIG'),
(5, 'Florianópolis', 'Florianópolis', 'Brasil', 'FLN'),
(6, 'Curitiba', 'Curitiba', 'Brasil', 'CWB'),
(7, 'Salvador', 'Salvador', 'Brasil', 'SSA'),
(8, 'Recife', 'Recife', 'Brasil', 'REC'),
(9, 'Lisboa', 'Lisboa', 'Portugal', 'LIS'),
(10, 'Paris - Charles de Gaulle', 'Paris', 'França', 'CDG'),
(11, 'Londres - Heathrow', 'Londres', 'Reino Unido', 'LHR'),
(12, 'Nova York - JFK', 'Nova York', 'Estados Unidos', 'JFK'),
(13, 'Tóquio - Haneda', 'Tóquio', 'Japão', 'HND'),
(14, 'Dubai', 'Dubai', 'Emirados Árabes Unidos', 'DXB'),
(15, 'Roma', 'Roma', 'Itália', 'FCO'),
(16, 'Madrid', 'Madrid', 'Espanha', 'MAD'),
(17, 'Cancún', 'Cancún', 'México', 'CUN'),
(18, 'Atenas', 'Atenas', 'Grécia', 'ATH'),
(19, 'Bali', 'Denpasar', 'Indonésia', 'DPS'),
(20, 'Maldivas', 'Malé', 'Maldivas', 'MLE'),
(21, 'Fernando de Noronha', 'Fernando de Noronha', 'Brasil', 'FEN'),
(22, 'Santorini', 'Santorini', 'Grécia', 'JTR'),
(23, 'Orlando International', 'Orlando', 'Estados Unidos', 'MCO'),
(24, 'Gramado (destino de demonstração)', 'Gramado', 'Brasil', 'GRM'),
(25, 'Foz do Iguaçu - Cataratas', 'Foz do Iguaçu', 'Brasil', 'IGU'),
(26, 'Maceió - Zumbi dos Palmares', 'Maceió', 'Brasil', 'MCZ'),
(27, 'Porto Seguro', 'Porto Seguro', 'Brasil', 'BPS'),
(28, 'Buenos Aires - Ezeiza', 'Buenos Aires', 'Argentina', 'EZE'),
(29, 'Seul - Incheon', 'Seul', 'Coreia do Sul', 'ICN');

-- --------------------------------------------------------

--
-- Estrutura para tabela `atividades`
--

CREATE TABLE `atividades` (
  `id_atividade` int(5) NOT NULL,
  `nome_atividade` varchar(100) NOT NULL,
  `descricao_atividade` varchar(300) NOT NULL,
  `local_atividade` varchar(100) NOT NULL,
  `id_destino` int(11) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `duracao` varchar(50) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `classificacao` decimal(2,1) DEFAULT NULL,
  `imagem_principal` varchar(255) DEFAULT NULL,
  `incluso` varchar(255) DEFAULT NULL,
  `recomendacoes` varchar(255) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `ods8` tinyint(1) NOT NULL DEFAULT 0,
  `ods12` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `atividades`
--

INSERT INTO `atividades` (`id_atividade`, `nome_atividade`, `descricao_atividade`, `local_atividade`, `id_destino`, `categoria`, `duracao`, `preco`, `classificacao`, `imagem_principal`, `incluso`, `recomendacoes`, `ativo`, `ods8`, `ods12`) VALUES
(1, 'Trilha até as Cataratas do Iguaçu', 'Caminhada pelas trilhas do Parque Nacional do Iguaçu, permitindo observar as famosas quedas d’água e a natureza ao redor.', 'Parque Nacional do Iguaçu – Foz do Iguaçu, Brasil', 10, 'Natureza', '4 horas', 120.00, 4.9, 'img/atividades/trilha-cataratas.jpg', 'Entrada no parque e orientação de guia', 'Usar calçados adequados e levar água.', 1, 1, 1),
(2, 'Passeio pela orla de Copacabana', 'Caminhada pela orla de Copacabana, apreciando a praia, o calçadão e a paisagem característica do Rio de Janeiro.', 'Praia de Copacabana – Rio de Janeiro, Brasil', 13, 'Passeios', '1 hora', 80.00, 4.7, 'img/atividades/orla-copacabana.jpg', 'Orientações para o passeio', 'Usar protetor solar e levar água.', 1, 0, 0),
(3, 'Passeio a cavalo pela propriedade', 'Passeio tranquilo a cavalo pelas áreas verdes da propriedade, proporcionando contato com a natureza e momentos de relaxamento.', 'Fasano Boa Vista – Porto Feliz, Brasil', NULL, 'Aventura', '1 hora', 250.00, 4.6, 'img/atividades/passeio-cavalo-fasano.jpg', 'Cavalo e acompanhamento de instrutor', 'Usar roupas confortáveis e seguir as instruções.', 1, 1, 0),
(4, 'Passeio pela praia de Ipanema', 'Caminhada pela praia de Ipanema para aproveitar a paisagem, o mar e um dos locais mais conhecidos do Rio de Janeiro.', 'Praia de Ipanema – Rio de Janeiro, Brasil', 13, 'Passeios', '1 hora', 70.00, 4.8, 'img/atividades/praia-ipanema.jpg', 'Orientações para o passeio', 'Levar protetor solar e manter-se hidratado.', 1, 0, 0),
(5, 'Visita ao MASP', 'Visita ao Museu de Arte de São Paulo para conhecer exposições, obras de arte e um dos principais pontos culturais da cidade.', 'Avenida Paulista – São Paulo, Brasil', 11, 'Cultura', '2 horas', 90.00, 4.8, 'img/atividades/masp-sao-paulo.jpg', 'Ingresso do museu', 'Consultar os horários de funcionamento.', 1, 1, 0),
(6, 'Caminhada pelo Parque Burle Marx', 'Passeio pelas áreas verdes do parque, observando jardins, plantas e paisagens projetadas pelo famoso paisagista Burle Marx.', 'Parque Burle Marx – São Paulo, Brasil', 11, 'Natureza', '2 horas', 60.00, 4.7, 'img/atividades/parque-burle-marx.jpg', 'Orientações para o percurso', 'Usar calçados confortáveis.', 1, 0, 1),
(7, 'Passeio pelo Quadrado de Trancoso', 'Visita ao centro histórico de Trancoso, conhecido por suas construções tradicionais, restaurantes, lojas e ambiente agradável.', 'Quadrado de Trancoso – Porto Seguro, Brasil', 15, 'Cultura', '1 hora', 50.00, 4.9, 'img/atividades/quadrado-trancoso.jpg', 'Passeio pelo centro histórico', 'Usar calçados confortáveis e respeitar os espaços históricos.', 1, 1, 0),
(8, 'Passeio pela Avenida Paulista', 'Caminhada pela Avenida Paulista para conhecer seus museus, lojas, restaurantes e a movimentada vida urbana de São Paulo.', 'Avenida Paulista – São Paulo, Brasil', 11, 'Passeios', '2 horas', 40.00, 4.6, 'img/atividades/avenida-paulista.jpg', 'Orientações para o passeio', 'Verificar eventos e interdições na avenida.', 1, 0, 0),
(9, 'Passeio de barco pelo mar Egeu', 'Passeio de barco pelas águas do mar Egeu, proporcionando belas vistas da costa grega e das paisagens marítimas.', 'Costa de Porto Heli – Grécia', 2, 'Passeios', '3 horas', 180.00, 4.8, 'img/atividades/barco-mar-egeu.jpg', 'Passeio de barco', 'Levar protetor solar e verificar as condições do mar.', 1, 1, 0),
(10, 'Passeio de barco em Los Cabos', 'Passeio de barco pela costa de Los Cabos para apreciar o oceano, as formações rochosas e as paisagens do litoral mexicano.', 'Los Cabos – México', 3, 'Passeios', '2 horas', 220.00, 4.7, 'img/atividades/barco-los-cabos.jpg', 'Passeio de barco e acompanhamento da tripulação', 'Levar protetor solar e verificar as condições climáticas.', 1, 1, 0),
(11, 'Passeio a cavalo pela praia', 'Passeio a cavalo pelas praias de Sumba, permitindo apreciar a natureza, o mar e as paisagens da ilha.', 'Ilha de Sumba – Indonésia', 4, 'Aventura', '2 horas', 200.00, 4.6, 'img/atividades/cavalo-praia-sumba.jpg', 'Cavalo e acompanhamento de instrutor', 'Usar roupas confortáveis e seguir as instruções.', 1, 1, 0),
(12, 'Mergulho com snorkel', 'Atividade aquática nas águas cristalinas das Maldivas, permitindo observar peixes, corais e outros elementos da vida marinha.', 'Atol de Baa – Maldivas', 5, 'Natureza', '2 horas', 150.00, 4.9, 'img/atividades/snorkel-maldivas.jpg', 'Equipamentos de snorkel e orientação', 'Levar roupa de banho e seguir as orientações de segurança.', 1, 1, 1),
(13, 'Passeio pelas praias de Saint-Tropez', 'Passeio pelas praias de Saint-Tropez para aproveitar o litoral mediterrâneo e conhecer as belas paisagens da Riviera Francesa.', 'Saint-Tropez – França', 13, 'Passeios', '3 horas', 100.00, 4.8, 'img/atividades/praias-saint-tropez.jpg', 'Orientações para o passeio', 'Levar protetor solar e calçados confortáveis.', 1, 0, 0),
(14, 'Passeio de barco pelo Lago de Como', 'Passeio de barco pelo Lago de Como para observar suas águas, montanhas, jardins e pequenas cidades às margens do lago.', 'Lago de Como – Itália', 7, 'Passeios', '2 horas', 180.00, 4.9, 'img/atividades/barco-lago-como.jpg', 'Passeio de barco', 'Levar agasalho e verificar os horários dos passeios.', 1, 1, 0),
(15, 'Passeio pelo Central Park', 'Caminhada pelo Central Park, conhecendo suas áreas verdes, lagos, jardins e alguns dos pontos mais conhecidos de Nova York', 'Central Park – Nova York, Estados Unidos', 8, 'Natureza', '2 horas', 0.00, 4.9, 'img/atividades/central-park.jpg', 'Acesso às áreas públicas do parque', 'Usar calçados confortáveis e levar água.', 1, 0, 1),
(16, 'Visita ao bairro de San Telmo', 'Passeio pelo histórico bairro de San Telmo, conhecendo suas ruas antigas, construções tradicionais, lojas e atrações culturais.', 'San Telmo – Buenos Aires, Argentina', 16, 'Cultura', '2 horas', 100.00, 4.7, 'img/atividades/bairro-san-telmo.jpg', 'Orientações para o passeio', 'Usar calçados confortáveis e respeitar os espaços históricos.', 1, 1, 0),
(17, 'Passeio de barco pelo rio Douro', 'Passeio de barco pelo rio Douro para apreciar as paisagens de Porto e Vila Nova de Gaia e conhecer a região de uma perspectiva diferente.', 'Rio Douro – Porto, Portugal', 17, 'Passeios', '2 horas', 120.00, 4.8, 'img/atividades/barco-rio-douro.jpg', 'Passeio de barco pelo rio Douro', 'Levar agasalho e verificar as condições do passeio.', 1, 1, 0),
(18, 'Mergulho em Fernando de Noronha', 'Explore a vida marinha e os recifes do arquipélago.', 'Fernando de Noronha, PE', 1, 'Aventura', '3 horas', 280.00, 4.9, 'img/atividades/mergulho-noronha.jpg', 'Equipamentos e instrutor', 'Levar roupa de banho.', 1, 1, 1),
(19, 'Passeio de barco em Noronha', 'Conheça praias e paisagens em um passeio pelo mar.', 'Fernando de Noronha, PE', 1, 'Passeios', '4 horas', 220.00, 4.8, 'img/atividades/barco-noronha.jpg', 'Passeio de barco', 'Levar protetor solar.', 1, 1, 1),
(20, 'Pôr do sol em Santorini', 'Contemple as famosas paisagens da ilha ao entardecer.', 'Santorini, Grécia', 2, 'Passeios', '2 horas', 180.00, 4.9, 'img/atividades/por-do-sol-santorini.jpg', 'Acompanhamento de guia', 'Chegar com antecedência.', 1, 1, 0),
(21, 'Tour cultural por Santorini', 'Conheça vilarejos e a história da ilha grega.', 'Santorini, Grécia', 2, 'Cultura', '3 horas', 150.00, 4.7, 'img/atividades/tour-santorini.jpg', 'Visita guiada', 'Usar calçados confortáveis.', 1, 1, 0),
(22, 'Mergulho em Cancún', 'Descubra a vida marinha do Caribe com acompanhamento profissional.', 'Cancún, México', 3, 'Aventura', '3 horas', 250.00, 4.8, 'img/atividades/mergulho-cancun.jpg', 'Equipamentos e instrutor', 'Seguir as orientações de segurança.', 1, 1, 1),
(23, 'Passeio de barco em Cancún', 'Navegue pelas águas azul-turquesa do Caribe.', 'Cancún, México', 3, 'Passeios', '4 horas', 210.00, 4.7, 'img/atividades/barco-cancun.jpg', 'Passeio de barco', 'Consultar condições climáticas.', 1, 0, 0),
(24, 'Aula de surfe em Bali', 'Aprenda técnicas de surfe com orientação de um instrutor.', 'Bali, Indonésia', 4, 'Aventura', '2 horas', 130.00, 4.8, 'img/atividades/surfe-bali.jpg', 'Prancha e instrução', 'Verificar as condições do mar.', 1, 1, 0),
(25, 'Trilha em Bali', 'Explore paisagens naturais em uma caminhada guiada.', 'Bali, Indonésia', 4, 'Natureza', '4 horas', 160.00, 4.7, 'img/atividades/trilha-bali.jpg', 'Guia local', 'Usar calçados adequados.', 1, 1, 1),
(26, 'Passeio de barco nas Maldivas', 'Conheça os atóis e as águas cristalinas do arquipélago.', 'Maldivas', 5, 'Passeios', '3 horas', 300.00, 4.9, 'img/atividades/barco-maldivas.jpg', 'Passeio acompanhado', 'Consultar condições climáticas.', 1, 0, 0),
(28, 'Tour pelos monumentos de Paris', 'Conheça os principais pontos turísticos da capital francesa.', 'Paris, França', 6, 'Cultura', '3 horas', 190.00, 4.8, 'img/atividades/monumentos-paris.jpg', 'Visita guiada', 'Confirmar o ponto de encontro.', 1, 0, 0),
(29, 'Experiência gastronômica em Paris', 'Descubra sabores da culinária francesa.', 'Paris, França', 6, 'Gastronomia', '2 horas', 240.00, 4.7, 'img/atividades/gastronomia-paris.jpg', 'Degustação conforme pacote', 'Informar restrições alimentares.', 1, 0, 0),
(30, 'Tour pelo Coliseu de Roma', 'Conheça a história da Roma Antiga em uma visita guiada.', 'Roma, Itália', 7, 'História', '2 horas', 170.00, 4.9, 'img/atividades/coliseu-roma-tour.jpg', 'Visita guiada', 'Verificar necessidade de ingresso.', 1, 0, 0),
(31, 'Tour histórico por Roma', 'Explore monumentos, praças e construções históricas.', 'Roma, Itália', 7, 'Cultura', '3 horas', 150.00, 4.8, 'img/atividades/tour-historico-roma.jpg', 'Acompanhamento de guia', 'Usar calçados confortáveis.', 1, 0, 0),
(32, 'Experiência nos parques de Orlando', 'Aproveite atrações temáticas e experiências de entretenimento.', 'Orlando, Estados Unidos', 8, 'Entretenimento', 'Dia inteiro', 650.00, 4.9, 'img/atividades/parques-orlando.jpeg', 'Depende do ingresso contratado', 'Verificar ingressos e regras oficiais.', 1, 0, 0),
(33, 'Tour pelo centro de Gramado', 'Conheça os pontos turísticos e a arquitetura da cidade.', 'Gramado, RS', 9, 'Cultura', '3 horas', 100.00, 4.6, 'img/atividades/centro-gramado.jpg', 'Passeio acompanhado', 'Levar agasalho em dias frios.', 1, 0, 0),
(34, 'Rota dos chocolates em Gramado', 'Descubra sabores e lojas de chocolate da região.', 'Gramado, RS', 9, 'Gastronomia', '2 horas', 120.00, 4.7, 'img/atividades/chocolates-gramado.jpg', 'Visitas conforme roteiro', 'Consultar degustações incluídas.', 1, 0, 0),
(35, 'Visita às Cataratas do Iguaçu', 'Admire as quedas-d’água pelas trilhas e passarelas do parque.', 'Foz do Iguaçu, PR', 10, 'Natureza', '4 horas', 120.00, 4.9, 'img/atividades/trilha-cataratas.jpg', 'Acesso conforme ingresso', 'Levar capa de chuva.', 1, 0, 0),
(36, 'Passeio de barco nas Cataratas', 'Viva uma experiência de navegação próxima às quedas-d’água.', 'Foz do Iguaçu, PR', 10, 'Aventura', '2 horas', 280.00, 4.8, 'img/atividades/barco-cataratas.jpg', 'Passeio conforme pacote', 'Verificar restrições de segurança.', 1, 0, 0),
(37, 'Tour cultural por Curitiba', 'Explore parques, espaços culturais e pontos turísticos.', 'Curitiba, PR', 11, 'Cultura', '3 horas', 90.00, 4.6, 'img/atividades/tour-curitiba-cultural.jpg', 'Roteiro guiado', 'Consultar a previsão do tempo.', 1, 0, 0),
(38, 'Passeio pelo Pelourinho', 'Conheça a história e a cultura de Salvador.', 'Salvador, BA', 12, 'História', '3 horas', 100.00, 4.8, 'img/atividades/pelourinho-salvador.jpg', 'Acompanhamento de guia', 'Levar água e usar roupas leves.', 1, 0, 0),
(39, 'Tour pelos pontos turísticos do Rio', 'Conheça as paisagens e atrações mais famosas da cidade.', 'Rio de Janeiro, RJ', 13, 'Passeios', '4 horas', 180.00, 4.8, 'img/atividades/pontos-turisticos-rio.jpg', 'Roteiro conforme pacote', 'Confirmar os locais visitados.', 1, 0, 0),
(40, 'Passeio de jangada em Maceió', 'Aproveite as águas costeiras e as piscinas naturais quando permitido.', 'Maceió, AL', 14, 'Passeios', '2 horas', 100.00, 4.7, 'img/atividades/jangada-maceio.jpg', 'Passeio de jangada', 'Depende da maré e do clima.', 1, 0, 0),
(41, 'Passeio de escuna em Porto Seguro', 'Aprecie as praias e paisagens do litoral baiano.', 'Porto Seguro, BA', 15, 'Passeios', '4 horas', 150.00, 4.7, 'img/atividades/escuna-porto-seguro.jpg', 'Passeio conforme roteiro', 'Confirmar os serviços incluídos.', 1, 0, 0),
(42, 'Tour histórico por Buenos Aires', 'Conheça bairros, praças e construções históricas da capital argentina.', 'Buenos Aires, Argentina', 16, 'História', '3 horas', 140.00, 4.8, 'img/atividades/tour-buenos-aires.jpg', 'Visita guiada', 'Levar documento de identificação.', 1, 0, 0),
(43, 'Tour pelo centro histórico de Lisboa', 'Explore ruas históricas, miradouros e construções tradicionais.', 'Lisboa, Portugal', 17, 'Cultura', '3 horas', 130.00, 4.8, 'img/atividades/centro-historico-lisboa.jpg', 'Roteiro guiado', 'Usar calçados confortáveis.', 1, 0, 0),
(44, 'Flutuação em rio de águas cristalinas', 'Experiência de flutuação em Bonito com orientação de condutor local e respeito às regras de conservação do ambiente aquático.', 'Bonito, MS', 18, 'Natureza', '2 horas', 145.00, 4.9, 'img/atividades/flutuacao-bonito.jpg', 'Orientação e equipamentos básicos', 'Seguir as instruções ambientais e não tocar na vegetação ou nos animais.', 1, 1, 1),
(45, 'Trilha guiada na Chapada Diamantina', 'Caminhada conduzida por guia da região, com interpretação da paisagem e valorização do conhecimento local.', 'Lençóis, BA', 19, 'Natureza', '4 horas', 95.00, 4.8, 'img/atividades/trilha-chapada.jpg', 'Acompanhamento de guia local', 'Levar água em garrafa reutilizável e recolher todo o resíduo produzido.', 1, 1, 1),
(46, 'Roteiro de cachoeiras no Jalapão', 'Passeio em grupo reduzido com condutor local por atrativos naturais da região.', 'Mateiros, TO', 20, 'Natureza', 'Dia inteiro', 180.00, 4.8, 'img/atividades/cachoeiras-jalapao.jpg', 'Condutor e roteiro terrestre', 'Respeitar limites de visitação e orientações do condutor.', 1, 1, 1),
(47, 'Caminhada pelas trilhas da Ilha do Mel', 'Percurso a pé por trilhas e paisagens costeiras, incentivando deslocamento de baixo impacto.', 'Ilha do Mel, PR', 21, 'Natureza', '2 horas', 45.00, 4.7, 'img/atividades/trilha-ilha-mel.jpg', 'Orientação de percurso', 'Não sair das trilhas demarcadas e não deixar resíduos.', 1, 0, 1),
(48, 'Passeio cultural com moradores de Alter do Chão', 'Vivência cultural conduzida por anfitriões locais, com histórias e referências da comunidade.', 'Alter do Chão, PA', 22, 'Cultura', '2 horas', 75.00, 4.9, 'img/atividades/passeio-cultural-alter.jpg', 'Acompanhamento de anfitrião local', 'Respeitar costumes, espaços comunitários e regras para fotografias.', 1, 1, 1),
(49, 'Caminhada de observação do cerrado', 'Atividade interpretativa na região da Serra da Canastra com condutor local e observação responsável da paisagem.', 'São Roque de Minas, MG', 23, 'Natureza', '3 horas', 80.00, 4.8, 'img/atividades/caminhada-canastra.jpg', 'Acompanhamento de condutor', 'Usar calçado adequado e não retirar plantas ou elementos naturais.', 1, 1, 1),
(50, 'Oficina de culinária regional', 'Experiência gastronômica demonstrativa com ingredientes regionais e participação de pequenos produtores.', 'Lençóis, BA', 19, 'Gastronomia', '2 horas', 110.00, 4.8, 'img/atividades/oficina-culinaria-chapada.jpg', 'Oficina e degustação', 'Informar restrições alimentares com antecedência.', 1, 1, 1),
(51, 'Visita a produtor de queijo artesanal', 'Visita demonstrativa a produtor rural da região, com apresentação do processo artesanal e valorização da produção local.', 'São Roque de Minas, MG', 23, 'Gastronomia', '1h30', 55.00, 4.7, 'img/atividades/queijo-canastra.jpg', 'Visita orientada e degustação conforme disponibilidade', 'Comprar diretamente do produtor é opcional.', 1, 1, 1),
(52, 'Observação de aves com guia local', 'Atividade de observação de aves sem captura ou alimentação dos animais, conduzida por profissional da região.', 'Bonito, MS', 18, 'Natureza', '2 horas', 90.00, 4.8, 'img/atividades/observacao-aves-bonito.jpg', 'Acompanhamento de guia', 'Manter distância dos animais e evitar sons que os perturbem.', 1, 1, 1),
(53, 'Passeio de bicicleta em Lençóis', 'Roteiro leve de bicicleta para conhecer a cidade e arredores, incentivando mobilidade de menor impacto.', 'Lençóis, BA', 19, 'Aventura', '2 horas', 65.00, 4.6, 'img/atividades/ciclismo-lencois.jpg', 'Bicicleta e capacete', 'Utilizar equipamentos de segurança e respeitar pedestres.', 1, 1, 1),
(54, 'Passeio de canoa com condutor local', 'Passeio contemplativo em área permitida, com condução local e orientações para proteção do ambiente fluvial.', 'Alter do Chão, PA', 22, 'Natureza', '1h30', 85.00, 4.7, 'img/atividades/canoa-alter.jpg', 'Canoa e acompanhamento de condutor', 'Confirmar condições do rio e seguir orientações de segurança.', 1, 1, 1),
(55, 'Roteiro de cachoeiras da Canastra', 'Passeio em grupo com condutor regional para conhecer cachoeiras e paisagens, respeitando as regras dos atrativos.', 'São Roque de Minas, MG', 23, 'Natureza', '4 horas', 120.00, 4.8, 'img/atividades/cachoeiras-canastra.jpg', 'Roteiro acompanhado', 'Verificar acesso, clima e regras locais antes da saída.', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacoes`
--

CREATE TABLE `avaliacoes` (
  `id_avaliacao` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_publicacao` int(11) NOT NULL,
  `nota` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `data_avaliacao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `boatour_cupons`
--

CREATE TABLE `boatour_cupons` (
  `id_cupom` bigint(20) NOT NULL,
  `codigo` varchar(64) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_pagamento_origem` varchar(80) NOT NULL,
  `chave_item` varchar(120) NOT NULL,
  `ods` tinyint(4) NOT NULL,
  `desconto_percentual` decimal(7,3) DEFAULT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'ativo',
  `id_pagamento_uso` varchar(80) DEFAULT NULL,
  `criado_em` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `boatour_pagamentos_simulados`
--

CREATE TABLE `boatour_pagamentos_simulados` (
  `id_pagamento` varchar(80) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(32) NOT NULL DEFAULT 'compra',
  `descricao` varchar(255) NOT NULL,
  `valor` decimal(12,2) NOT NULL,
  `metodo` varchar(20) NOT NULL,
  `parcelas` int(11) NOT NULL DEFAULT 1,
  `cartao_final` varchar(4) DEFAULT NULL,
  `status` varchar(24) NOT NULL,
  `motivo` text DEFAULT NULL,
  `cupom_codigo` varchar(64) DEFAULT NULL,
  `dados_pedido` longtext DEFAULT NULL,
  `criado_em` datetime NOT NULL,
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `boatour_pagamentos_simulados`
--

INSERT INTO `boatour_pagamentos_simulados` (`id_pagamento`, `id_usuario`, `tipo`, `descricao`, `valor`, `metodo`, `parcelas`, `cartao_final`, `status`, `motivo`, `cupom_codigo`, `dados_pedido`, `criado_em`, `atualizado_em`) VALUES
('BP-20261104-AAFKV8', 1, 'compra', 'LATAM Airlines · BT1001', 2675.06, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}', '2026-11-04 15:25:50', '2026-11-04 15:25:58'),
('BP-20261104-C6USHE', 1, 'compra', 'TAP Air Portugal · BT3001', 5477.82, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}', '2026-11-04 15:24:17', '2026-11-04 15:24:27'),
('BP-20261104-GCEL6J', 1, 'compra', 'TAP Air Portugal · BT3001', 5477.82, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Lisboa (LIS) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}', '2026-11-04 09:50:09', '2026-11-04 09:50:21'),
('BP-20261104-JWQW7F', 1, 'compra', 'LATAM Airlines · BT1001', 2675.06, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}', '2026-11-04 14:47:54', '2026-11-04 14:47:55'),
('BP-20261104-XL6LPL', 1, 'compra', 'TAP Air Portugal · TP1230', 4646.26, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"TAP Air Portugal · TP1230\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:8\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":8,\"nome\":\"TAP Air Portugal · TP1230\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[\"12\"],\"descricao\":\"Lisboa (LIS) · Econômica · 9h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 21/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Lisboa (LIS) · 22:30\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato\",\"email\":\"volpato@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 98814-8189\"},\"viajantes\":[{\"nome\":\"Jullia Volpato Santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[\"12\"]}', '2026-11-04 09:14:59', '2026-11-04 09:15:01'),
('BP-20261104-YBRA9B', 1, 'compra', 'TAP Air Portugal · BT3001', 5477.82, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}', '2026-11-04 14:42:08', '2026-11-04 14:42:18'),
('BP-20261105-LETT8X', 1, 'compra', 'Aeromexico · BT1003', 4413.95, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"Aeromexico · BT1003\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img03.jpg\",\"itens\":[{\"chave\":\"voo:23\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":23,\"numeroVoo\":\"BT1003\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"dataSaida\":\"2026-11-02T03:00:00.000Z\",\"nome\":\"Aeromexico · BT1003\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Cancún (CUN) · Econômica · 10h25\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 02/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Cancún (CUN) · 09:15\"}],\"imagem\":\"../img/destinos/img03.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"descontoSaldo\":232.31,\"descontoCupom\":0}', '2026-11-05 09:49:30', '2026-11-05 09:49:33'),
('BP-20261109-HVNSC3', 17, 'compra', 'TAP Air Portugal · BT1002', 6899.06, 'pix', 1, NULL, 'aprovado', NULL, NULL, '{\"titulo\":\"TAP Air Portugal · BT1002\",\"valor\":6899.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img02.jpg\",\"itens\":[{\"chave\":\"voo:22\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":22,\"numeroVoo\":\"BT1002\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"dataSaida\":\"2026-10-31T03:00:00.000Z\",\"nome\":\"TAP Air Portugal · BT1002\",\"valor\":4899.9,\"valorPorParticipante\":4899.9,\"participantesIds\":[\"11714544907\"],\"ods\":[],\"descricao\":\"Santorini (JTR) · Econômica · 17h50\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 31/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Santorini (JTR) · 18:20\"}],\"imagem\":\"../img/destinos/img02.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Alice Novacoski Vieira\",\"email\":\"alice.novacoski10@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 99201-9988\"},\"viajantes\":[{\"nome\":\"Alice Novacoski\",\"cpf\":\"117.145.449-07\",\"nascimento\":\"2010-02-15\",\"categoria\":\"Adulto\",\"id\":\"11714544907\"}],\"ods\":[],\"descontoSaldo\":0,\"descontoCupom\":0}', '2026-11-09 09:05:36', '2026-11-09 09:05:38');

-- --------------------------------------------------------

--
-- Estrutura para tabela `boatour_saldo_movimentos`
--

CREATE TABLE `boatour_saldo_movimentos` (
  `id_movimento` bigint(20) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `referencia` varchar(120) NOT NULL,
  `id_pagamento` varchar(80) NOT NULL,
  `tipo` varchar(32) NOT NULL,
  `valor` decimal(12,2) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `criado_em` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `boatour_saldo_movimentos`
--

INSERT INTO `boatour_saldo_movimentos` (`id_movimento`, `id_usuario`, `referencia`, `id_pagamento`, `tipo`, `valor`, `descricao`, `criado_em`) VALUES
(1, 1, 'BP-20261104-XL6LPL:ods12-cashback', 'BP-20261104-XL6LPL', 'cashback_ods12', 232.31, 'Cashback ODS 12 · 5%', '2026-11-04 09:14:59'),
(9, 1, 'BP-20261105-LETT8X:saldo', 'BP-20261105-LETT8X', 'uso', -232.31, 'Desconto BoaPay em Aeromexico · BT1003', '2026-11-05 09:49:30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `boatour_viagens_simuladas`
--

CREATE TABLE `boatour_viagens_simuladas` (
  `id_viagem` varchar(80) NOT NULL,
  `id_pagamento` varchar(80) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `imagem` text DEFAULT NULL,
  `origem` varchar(160) DEFAULT NULL,
  `destino` varchar(160) DEFAULT NULL,
  `data_ida` varchar(32) DEFAULT NULL,
  `data_volta` varchar(32) DEFAULT NULL,
  `codigo_voo` varchar(24) DEFAULT NULL,
  `codigo_aviao` varchar(24) DEFAULT NULL,
  `status` varchar(40) NOT NULL,
  `dados_viagem` longtext DEFAULT NULL,
  `criado_em` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `boatour_viagens_simuladas`
--

INSERT INTO `boatour_viagens_simuladas` (`id_viagem`, `id_pagamento`, `id_usuario`, `titulo`, `imagem`, `origem`, `destino`, `data_ida`, `data_volta`, `codigo_voo`, `codigo_aviao`, `status`, `dados_viagem`, `criado_em`) VALUES
('VG-20261104-AAFKV8', 'BP-20261104-AAFKV8', 1, 'LATAM Airlines · BT1001', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT4981', 'PR-CFW', 'confirmada', '{\"id_viagem\":\"VG-20261104-AAFKV8\",\"id_pagamento\":\"BP-20261104-AAFKV8\",\"id_usuario\":1,\"titulo\":\"LATAM Airlines · BT1001\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT4981\",\"codigo_aviao\":\"PR-CFW\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-AAFKV8\\\",\\\"idPagamento\\\":\\\"BP-20261104-AAFKV8\\\",\\\"titulo\\\":\\\"LATAM Airlines · BT1001\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:21\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":21,\\\"nome\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":1899.9,\\\"valorPorParticipante\\\":1899.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Fernando de Noronha (FEN) · Econômica · 3h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 29/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT4981\\\",\\\"codigoAviao\\\":\\\"PR-CFW\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":2675.06,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:21\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":21,\\\"nome\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":1899.9,\\\"valorPorParticipante\\\":1899.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Fernando de Noronha (FEN) · Econômica · 3h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 29/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[]}}\",\"criado_em\":\"2026-11-04T18:25:50.000Z\",\"id\":\"VG-20261104-AAFKV8\",\"idPagamento\":\"BP-20261104-AAFKV8\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT4981\",\"codigoAviao\":\"PR-CFW\",\"dados\":{\"id\":\"VG-20261104-AAFKV8\",\"idPagamento\":\"BP-20261104-AAFKV8\",\"titulo\":\"LATAM Airlines · BT1001\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT4981\",\"codigoAviao\":\"PR-CFW\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}},\"pedido\":{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}}', '2026-11-04 15:25:50'),
('VG-20261104-C6USHE', 'BP-20261104-C6USHE', 1, 'TAP Air Portugal · BT3001', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT2946', 'PR-UJX', 'confirmada', '{\"id_viagem\":\"VG-20261104-C6USHE\",\"id_pagamento\":\"BP-20261104-C6USHE\",\"id_usuario\":1,\"titulo\":\"TAP Air Portugal · BT3001\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT2946\",\"codigo_aviao\":\"PR-UJX\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-C6USHE\\\",\\\"idPagamento\\\":\\\"BP-20261104-C6USHE\\\",\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Londres (LON) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Londres (LON) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT2946\\\",\\\"codigoAviao\\\":\\\"PR-UJX\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":5477.82,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Londres (LON) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Londres (LON) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[]}}\",\"criado_em\":\"2026-11-04T18:24:17.000Z\",\"id\":\"VG-20261104-C6USHE\",\"idPagamento\":\"BP-20261104-C6USHE\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT2946\",\"codigoAviao\":\"PR-UJX\",\"dados\":{\"id\":\"VG-20261104-C6USHE\",\"idPagamento\":\"BP-20261104-C6USHE\",\"titulo\":\"TAP Air Portugal · BT3001\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT2946\",\"codigoAviao\":\"PR-UJX\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}},\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}}', '2026-11-04 15:24:17'),
('VG-20261104-GCEL6J', 'BP-20261104-GCEL6J', 1, 'TAP Air Portugal · BT3001', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT2093', 'PR-YYZ', 'confirmada', '{\"id_viagem\":\"VG-20261104-GCEL6J\",\"id_pagamento\":\"BP-20261104-GCEL6J\",\"id_usuario\":1,\"titulo\":\"TAP Air Portugal · BT3001\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT2093\",\"codigo_aviao\":\"PR-YYZ\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-GCEL6J\\\",\\\"idPagamento\\\":\\\"BP-20261104-GCEL6J\\\",\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Lisboa (LIS) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT2093\\\",\\\"codigoAviao\\\":\\\"PR-YYZ\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":5477.82,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Lisboa (LIS) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[]}}\",\"criado_em\":\"2026-11-04T12:50:09.000Z\",\"id\":\"VG-20261104-GCEL6J\",\"idPagamento\":\"BP-20261104-GCEL6J\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT2093\",\"codigoAviao\":\"PR-YYZ\",\"dados\":{\"id\":\"VG-20261104-GCEL6J\",\"idPagamento\":\"BP-20261104-GCEL6J\",\"titulo\":\"TAP Air Portugal · BT3001\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Lisboa (LIS) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT2093\",\"codigoAviao\":\"PR-YYZ\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Lisboa (LIS) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}},\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Lisboa (LIS) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Lisboa (LIS) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}}', '2026-11-04 09:50:09'),
('VG-20261104-JWQW7F', 'BP-20261104-JWQW7F', 1, 'LATAM Airlines · BT1001', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT9548', 'PR-QQF', 'confirmada', '{\"id_viagem\":\"VG-20261104-JWQW7F\",\"id_pagamento\":\"BP-20261104-JWQW7F\",\"id_usuario\":1,\"titulo\":\"LATAM Airlines · BT1001\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT9548\",\"codigo_aviao\":\"PR-QQF\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-JWQW7F\\\",\\\"idPagamento\\\":\\\"BP-20261104-JWQW7F\\\",\\\"titulo\\\":\\\"LATAM Airlines · BT1001\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:21\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":21,\\\"nome\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":1899.9,\\\"valorPorParticipante\\\":1899.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Fernando de Noronha (FEN) · Econômica · 3h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 29/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT9548\\\",\\\"codigoAviao\\\":\\\"PR-QQF\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":2675.06,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:21\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":21,\\\"nome\\\":\\\"LATAM Airlines · BT1001\\\",\\\"valor\\\":1899.9,\\\"valorPorParticipante\\\":1899.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Fernando de Noronha (FEN) · Econômica · 3h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 29/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[]}}\",\"criado_em\":\"2026-11-04T17:47:54.000Z\",\"id\":\"VG-20261104-JWQW7F\",\"idPagamento\":\"BP-20261104-JWQW7F\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT9548\",\"codigoAviao\":\"PR-QQF\",\"dados\":{\"id\":\"VG-20261104-JWQW7F\",\"idPagamento\":\"BP-20261104-JWQW7F\",\"titulo\":\"LATAM Airlines · BT1001\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT9548\",\"codigoAviao\":\"PR-QQF\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}},\"pedido\":{\"titulo\":\"LATAM Airlines · BT1001\",\"valor\":2675.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:21\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":21,\"nome\":\"LATAM Airlines · BT1001\",\"valor\":1899.9,\"valorPorParticipante\":1899.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Fernando de Noronha (FEN) · Econômica · 3h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 29/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Fernando de Noronha (FEN) · 08:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}}', '2026-11-04 14:47:54'),
('VG-20261104-XL6LPL', 'BP-20261104-XL6LPL', 1, 'TAP Air Portugal · TP1230', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT7062', 'PR-ZMX', 'confirmada', '{\"id_viagem\":\"VG-20261104-XL6LPL\",\"id_pagamento\":\"BP-20261104-XL6LPL\",\"id_usuario\":1,\"titulo\":\"TAP Air Portugal · TP1230\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT7062\",\"codigo_aviao\":\"PR-ZMX\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-XL6LPL\\\",\\\"idPagamento\\\":\\\"BP-20261104-XL6LPL\\\",\\\"titulo\\\":\\\"TAP Air Portugal · TP1230\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:8\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":8,\\\"nome\\\":\\\"TAP Air Portugal · TP1230\\\",\\\"valor\\\":3299.9,\\\"valorPorParticipante\\\":3299.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[\\\"12\\\"],\\\"descricao\\\":\\\"Lisboa (LIS) · Econômica · 9h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 21/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Lisboa (LIS) · 22:30\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato\\\",\\\"email\\\":\\\"volpato@gmail.com\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"telefone\\\":\\\"(48) 98814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[\\\"12\\\"],\\\"codigoVoo\\\":\\\"BT7062\\\",\\\"codigoAviao\\\":\\\"PR-ZMX\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"TAP Air Portugal · TP1230\\\",\\\"valor\\\":4646.26,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:8\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":8,\\\"nome\\\":\\\"TAP Air Portugal · TP1230\\\",\\\"valor\\\":3299.9,\\\"valorPorParticipante\\\":3299.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[\\\"12\\\"],\\\"descricao\\\":\\\"Lisboa (LIS) · Econômica · 9h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 21/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Lisboa (LIS) · 22:30\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato\\\",\\\"email\\\":\\\"volpato@gmail.com\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"telefone\\\":\\\"(48) 98814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[\\\"12\\\"]}}\",\"criado_em\":\"2026-11-04T12:14:59.000Z\",\"id\":\"VG-20261104-XL6LPL\",\"idPagamento\":\"BP-20261104-XL6LPL\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT7062\",\"codigoAviao\":\"PR-ZMX\",\"dados\":{\"id\":\"VG-20261104-XL6LPL\",\"idPagamento\":\"BP-20261104-XL6LPL\",\"titulo\":\"TAP Air Portugal · TP1230\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:8\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":8,\"nome\":\"TAP Air Portugal · TP1230\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[\"12\"],\"descricao\":\"Lisboa (LIS) · Econômica · 9h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 21/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Lisboa (LIS) · 22:30\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato\",\"email\":\"volpato@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 98814-8189\"},\"viajantes\":[{\"nome\":\"Jullia Volpato Santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[\"12\"],\"codigoVoo\":\"BT7062\",\"codigoAviao\":\"PR-ZMX\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"TAP Air Portugal · TP1230\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:8\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":8,\"nome\":\"TAP Air Portugal · TP1230\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[\"12\"],\"descricao\":\"Lisboa (LIS) · Econômica · 9h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 21/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Lisboa (LIS) · 22:30\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato\",\"email\":\"volpato@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 98814-8189\"},\"viajantes\":[{\"nome\":\"Jullia Volpato Santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[\"12\"]}},\"pedido\":{\"titulo\":\"TAP Air Portugal · TP1230\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:8\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":8,\"nome\":\"TAP Air Portugal · TP1230\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[\"12\"],\"descricao\":\"Lisboa (LIS) · Econômica · 9h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 21/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Lisboa (LIS) · 22:30\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato\",\"email\":\"volpato@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 98814-8189\"},\"viajantes\":[{\"nome\":\"Jullia Volpato Santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[\"12\"]}}', '2026-11-04 09:14:59'),
('VG-20261104-YBRA9B', 'BP-20261104-YBRA9B', 1, 'TAP Air Portugal · BT3001', '../img/destinos/cancun.jpg', NULL, NULL, NULL, NULL, 'BT1036', 'PR-VYP', 'confirmada', '{\"id_viagem\":\"VG-20261104-YBRA9B\",\"id_pagamento\":\"BP-20261104-YBRA9B\",\"id_usuario\":1,\"titulo\":\"TAP Air Portugal · BT3001\",\"imagem\":\"../img/destinos/cancun.jpg\",\"origem\":null,\"destino\":null,\"data_ida\":null,\"data_volta\":null,\"codigo_voo\":\"BT1036\",\"codigo_aviao\":\"PR-VYP\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261104-YBRA9B\\\",\\\"idPagamento\\\":\\\"BP-20261104-YBRA9B\\\",\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Londres (LON) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Londres (LON) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT1036\\\",\\\"codigoAviao\\\":\\\"PR-VYP\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":5477.82,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:48\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":48,\\\"nome\\\":\\\"TAP Air Portugal · BT3001\\\",\\\"valor\\\":3890.5,\\\"valorPorParticipante\\\":3890.5,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Londres (LON) · Econômica · 11h30\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 15/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"Porto Alegre (POA) → Londres (LON) · 18:00\\\"}],\\\"imagem\\\":\\\"../img/destinos/cancun.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[]}}\",\"criado_em\":\"2026-11-04T17:42:08.000Z\",\"id\":\"VG-20261104-YBRA9B\",\"idPagamento\":\"BP-20261104-YBRA9B\",\"ida\":null,\"volta\":null,\"codigoVoo\":\"BT1036\",\"codigoAviao\":\"PR-VYP\",\"dados\":{\"id\":\"VG-20261104-YBRA9B\",\"idPagamento\":\"BP-20261104-YBRA9B\",\"titulo\":\"TAP Air Portugal · BT3001\",\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT1036\",\"codigoAviao\":\"PR-VYP\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}},\"pedido\":{\"titulo\":\"TAP Air Portugal · BT3001\",\"valor\":5477.82,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/cancun.jpg\",\"itens\":[{\"chave\":\"voo:48\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":48,\"nome\":\"TAP Air Portugal · BT3001\",\"valor\":3890.5,\"valorPorParticipante\":3890.5,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Londres (LON) · Econômica · 11h30\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 15/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"Porto Alegre (POA) → Londres (LON) · 18:00\"}],\"imagem\":\"../img/destinos/cancun.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[]}}', '2026-11-04 14:42:08'),
('VG-20261105-LETT8X', 'BP-20261105-LETT8X', 1, 'Aeromexico · BT1003', '../img/destinos/img03.jpg', 'São Paulo (GRU)', 'Cancún (CUN)', '2026-11-02T03:00:00.000Z', NULL, 'BT1003', 'PR-KZR', 'confirmada', '{\"id_viagem\":\"VG-20261105-LETT8X\",\"id_pagamento\":\"BP-20261105-LETT8X\",\"id_usuario\":1,\"titulo\":\"Aeromexico · BT1003\",\"imagem\":\"../img/destinos/img03.jpg\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"data_ida\":\"2026-11-02T03:00:00.000Z\",\"data_volta\":null,\"codigo_voo\":\"BT1003\",\"codigo_aviao\":\"PR-KZR\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261105-LETT8X\\\",\\\"idPagamento\\\":\\\"BP-20261105-LETT8X\\\",\\\"titulo\\\":\\\"Aeromexico · BT1003\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Cancún (CUN)\\\",\\\"ida\\\":\\\"2026-11-02T03:00:00.000Z\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/img03.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:23\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":23,\\\"numeroVoo\\\":\\\"BT1003\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Cancún (CUN)\\\",\\\"dataSaida\\\":\\\"2026-11-02T03:00:00.000Z\\\",\\\"nome\\\":\\\"Aeromexico · BT1003\\\",\\\"valor\\\":3299.9,\\\"valorPorParticipante\\\":3299.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Cancún (CUN) · Econômica · 10h25\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 02/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Cancún (CUN) · 09:15\\\"}],\\\"imagem\\\":\\\"../img/destinos/img03.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT1003\\\",\\\"codigoAviao\\\":\\\"PR-KZR\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"Aeromexico · BT1003\\\",\\\"valor\\\":4646.26,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/img03.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:23\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":23,\\\"numeroVoo\\\":\\\"BT1003\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Cancún (CUN)\\\",\\\"dataSaida\\\":\\\"2026-11-02T03:00:00.000Z\\\",\\\"nome\\\":\\\"Aeromexico · BT1003\\\",\\\"valor\\\":3299.9,\\\"valorPorParticipante\\\":3299.9,\\\"participantesIds\\\":[\\\"15093341738\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Cancún (CUN) · Econômica · 10h25\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 02/11/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Cancún (CUN) · 09:15\\\"}],\\\"imagem\\\":\\\"../img/destinos/img03.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Jullia Volpato Santos\\\",\\\"email\\\":\\\"volpatosantosjullia@gmail.com\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"telefone\\\":\\\"(48) 38814-8189\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Jullia volpato santos\\\",\\\"cpf\\\":\\\"150.933.417-38\\\",\\\"nascimento\\\":\\\"2009-12-21\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"15093341738\\\"}],\\\"ods\\\":[],\\\"descontoSaldo\\\":232.31,\\\"descontoCupom\\\":0}}\",\"criado_em\":\"2026-11-05T12:49:30.000Z\",\"id\":\"VG-20261105-LETT8X\",\"idPagamento\":\"BP-20261105-LETT8X\",\"ida\":\"2026-11-02T03:00:00.000Z\",\"volta\":null,\"codigoVoo\":\"BT1003\",\"codigoAviao\":\"PR-KZR\",\"dados\":{\"id\":\"VG-20261105-LETT8X\",\"idPagamento\":\"BP-20261105-LETT8X\",\"titulo\":\"Aeromexico · BT1003\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"ida\":\"2026-11-02T03:00:00.000Z\",\"volta\":\"\",\"imagem\":\"../img/destinos/img03.jpg\",\"itens\":[{\"chave\":\"voo:23\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":23,\"numeroVoo\":\"BT1003\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"dataSaida\":\"2026-11-02T03:00:00.000Z\",\"nome\":\"Aeromexico · BT1003\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Cancún (CUN) · Econômica · 10h25\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 02/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Cancún (CUN) · 09:15\"}],\"imagem\":\"../img/destinos/img03.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"codigoVoo\":\"BT1003\",\"codigoAviao\":\"PR-KZR\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"Aeromexico · BT1003\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img03.jpg\",\"itens\":[{\"chave\":\"voo:23\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":23,\"numeroVoo\":\"BT1003\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"dataSaida\":\"2026-11-02T03:00:00.000Z\",\"nome\":\"Aeromexico · BT1003\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Cancún (CUN) · Econômica · 10h25\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 02/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Cancún (CUN) · 09:15\"}],\"imagem\":\"../img/destinos/img03.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"descontoSaldo\":232.31,\"descontoCupom\":0}},\"pedido\":{\"titulo\":\"Aeromexico · BT1003\",\"valor\":4646.26,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img03.jpg\",\"itens\":[{\"chave\":\"voo:23\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":23,\"numeroVoo\":\"BT1003\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Cancún (CUN)\",\"dataSaida\":\"2026-11-02T03:00:00.000Z\",\"nome\":\"Aeromexico · BT1003\",\"valor\":3299.9,\"valorPorParticipante\":3299.9,\"participantesIds\":[\"15093341738\"],\"ods\":[],\"descricao\":\"Cancún (CUN) · Econômica · 10h25\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 02/11/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Cancún (CUN) · 09:15\"}],\"imagem\":\"../img/destinos/img03.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Jullia Volpato Santos\",\"email\":\"volpatosantosjullia@gmail.com\",\"cpf\":\"150.933.417-38\",\"telefone\":\"(48) 38814-8189\"},\"viajantes\":[{\"nome\":\"Jullia volpato santos\",\"cpf\":\"150.933.417-38\",\"nascimento\":\"2009-12-21\",\"categoria\":\"Adulto\",\"id\":\"15093341738\"}],\"ods\":[],\"descontoSaldo\":232.31,\"descontoCupom\":0}}', '2026-11-05 09:49:30');
INSERT INTO `boatour_viagens_simuladas` (`id_viagem`, `id_pagamento`, `id_usuario`, `titulo`, `imagem`, `origem`, `destino`, `data_ida`, `data_volta`, `codigo_voo`, `codigo_aviao`, `status`, `dados_viagem`, `criado_em`) VALUES
('VG-20261109-HVNSC3', 'BP-20261109-HVNSC3', 17, 'TAP Air Portugal · BT1002', '../img/destinos/img02.jpg', 'São Paulo (GRU)', 'Santorini (JTR)', '2026-10-31T03:00:00.000Z', NULL, 'BT1002', 'PR-BDV', 'confirmada', '{\"id_viagem\":\"VG-20261109-HVNSC3\",\"id_pagamento\":\"BP-20261109-HVNSC3\",\"id_usuario\":17,\"titulo\":\"TAP Air Portugal · BT1002\",\"imagem\":\"../img/destinos/img02.jpg\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"data_ida\":\"2026-10-31T03:00:00.000Z\",\"data_volta\":null,\"codigo_voo\":\"BT1002\",\"codigo_aviao\":\"PR-BDV\",\"status\":\"confirmada\",\"dados_viagem\":\"{\\\"id\\\":\\\"VG-20261109-HVNSC3\\\",\\\"idPagamento\\\":\\\"BP-20261109-HVNSC3\\\",\\\"titulo\\\":\\\"TAP Air Portugal · BT1002\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Santorini (JTR)\\\",\\\"ida\\\":\\\"2026-10-31T03:00:00.000Z\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/img02.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:22\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":22,\\\"numeroVoo\\\":\\\"BT1002\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Santorini (JTR)\\\",\\\"dataSaida\\\":\\\"2026-10-31T03:00:00.000Z\\\",\\\"nome\\\":\\\"TAP Air Portugal · BT1002\\\",\\\"valor\\\":4899.9,\\\"valorPorParticipante\\\":4899.9,\\\"participantesIds\\\":[\\\"11714544907\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Santorini (JTR) · Econômica · 17h50\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 31/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Santorini (JTR) · 18:20\\\"}],\\\"imagem\\\":\\\"../img/destinos/img02.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Alice Novacoski Vieira\\\",\\\"email\\\":\\\"alice.novacoski10@gmail.com\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"telefone\\\":\\\"(48) 99201-9988\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Alice Novacoski\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"nascimento\\\":\\\"2010-02-15\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"11714544907\\\"}],\\\"ods\\\":[],\\\"codigoVoo\\\":\\\"BT1002\\\",\\\"codigoAviao\\\":\\\"PR-BDV\\\",\\\"status\\\":\\\"aguardando pagamento\\\",\\\"pedido\\\":{\\\"titulo\\\":\\\"TAP Air Portugal · BT1002\\\",\\\"valor\\\":6899.06,\\\"origem\\\":\\\"\\\",\\\"destino\\\":\\\"\\\",\\\"ida\\\":\\\"\\\",\\\"volta\\\":\\\"\\\",\\\"imagem\\\":\\\"../img/destinos/img02.jpg\\\",\\\"itens\\\":[{\\\"chave\\\":\\\"voo:22\\\",\\\"tipo\\\":\\\"voo\\\",\\\"categoria\\\":\\\"voo\\\",\\\"id\\\":22,\\\"numeroVoo\\\":\\\"BT1002\\\",\\\"origem\\\":\\\"São Paulo (GRU)\\\",\\\"destino\\\":\\\"Santorini (JTR)\\\",\\\"dataSaida\\\":\\\"2026-10-31T03:00:00.000Z\\\",\\\"nome\\\":\\\"TAP Air Portugal · BT1002\\\",\\\"valor\\\":4899.9,\\\"valorPorParticipante\\\":4899.9,\\\"participantesIds\\\":[\\\"11714544907\\\"],\\\"ods\\\":[],\\\"descricao\\\":\\\"Santorini (JTR) · Econômica · 17h50\\\",\\\"detalhes\\\":[{\\\"icone\\\":\\\"../img/icones/calendario2.png\\\",\\\"texto\\\":\\\"Voo em 31/10/2026\\\"},{\\\"icone\\\":\\\"../img/icones/aviao2.png\\\",\\\"texto\\\":\\\"São Paulo (GRU) → Santorini (JTR) · 18:20\\\"}],\\\"imagem\\\":\\\"../img/destinos/img02.jpg\\\",\\\"icone\\\":\\\"../img/icones/aviao2.png\\\"}],\\\"comprador\\\":{\\\"nome\\\":\\\"Alice Novacoski Vieira\\\",\\\"email\\\":\\\"alice.novacoski10@gmail.com\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"telefone\\\":\\\"(48) 99201-9988\\\"},\\\"viajantes\\\":[{\\\"nome\\\":\\\"Alice Novacoski\\\",\\\"cpf\\\":\\\"117.145.449-07\\\",\\\"nascimento\\\":\\\"2010-02-15\\\",\\\"categoria\\\":\\\"Adulto\\\",\\\"id\\\":\\\"11714544907\\\"}],\\\"ods\\\":[],\\\"descontoSaldo\\\":0,\\\"descontoCupom\\\":0}}\",\"criado_em\":\"2026-11-09T12:05:36.000Z\",\"id\":\"VG-20261109-HVNSC3\",\"idPagamento\":\"BP-20261109-HVNSC3\",\"ida\":\"2026-10-31T03:00:00.000Z\",\"volta\":null,\"codigoVoo\":\"BT1002\",\"codigoAviao\":\"PR-BDV\",\"dados\":{\"id\":\"VG-20261109-HVNSC3\",\"idPagamento\":\"BP-20261109-HVNSC3\",\"titulo\":\"TAP Air Portugal · BT1002\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"ida\":\"2026-10-31T03:00:00.000Z\",\"volta\":\"\",\"imagem\":\"../img/destinos/img02.jpg\",\"itens\":[{\"chave\":\"voo:22\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":22,\"numeroVoo\":\"BT1002\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"dataSaida\":\"2026-10-31T03:00:00.000Z\",\"nome\":\"TAP Air Portugal · BT1002\",\"valor\":4899.9,\"valorPorParticipante\":4899.9,\"participantesIds\":[\"11714544907\"],\"ods\":[],\"descricao\":\"Santorini (JTR) · Econômica · 17h50\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 31/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Santorini (JTR) · 18:20\"}],\"imagem\":\"../img/destinos/img02.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Alice Novacoski Vieira\",\"email\":\"alice.novacoski10@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 99201-9988\"},\"viajantes\":[{\"nome\":\"Alice Novacoski\",\"cpf\":\"117.145.449-07\",\"nascimento\":\"2010-02-15\",\"categoria\":\"Adulto\",\"id\":\"11714544907\"}],\"ods\":[],\"codigoVoo\":\"BT1002\",\"codigoAviao\":\"PR-BDV\",\"status\":\"aguardando pagamento\",\"pedido\":{\"titulo\":\"TAP Air Portugal · BT1002\",\"valor\":6899.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img02.jpg\",\"itens\":[{\"chave\":\"voo:22\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":22,\"numeroVoo\":\"BT1002\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"dataSaida\":\"2026-10-31T03:00:00.000Z\",\"nome\":\"TAP Air Portugal · BT1002\",\"valor\":4899.9,\"valorPorParticipante\":4899.9,\"participantesIds\":[\"11714544907\"],\"ods\":[],\"descricao\":\"Santorini (JTR) · Econômica · 17h50\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 31/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Santorini (JTR) · 18:20\"}],\"imagem\":\"../img/destinos/img02.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Alice Novacoski Vieira\",\"email\":\"alice.novacoski10@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 99201-9988\"},\"viajantes\":[{\"nome\":\"Alice Novacoski\",\"cpf\":\"117.145.449-07\",\"nascimento\":\"2010-02-15\",\"categoria\":\"Adulto\",\"id\":\"11714544907\"}],\"ods\":[],\"descontoSaldo\":0,\"descontoCupom\":0}},\"pedido\":{\"titulo\":\"TAP Air Portugal · BT1002\",\"valor\":6899.06,\"origem\":\"\",\"destino\":\"\",\"ida\":\"\",\"volta\":\"\",\"imagem\":\"../img/destinos/img02.jpg\",\"itens\":[{\"chave\":\"voo:22\",\"tipo\":\"voo\",\"categoria\":\"voo\",\"id\":22,\"numeroVoo\":\"BT1002\",\"origem\":\"São Paulo (GRU)\",\"destino\":\"Santorini (JTR)\",\"dataSaida\":\"2026-10-31T03:00:00.000Z\",\"nome\":\"TAP Air Portugal · BT1002\",\"valor\":4899.9,\"valorPorParticipante\":4899.9,\"participantesIds\":[\"11714544907\"],\"ods\":[],\"descricao\":\"Santorini (JTR) · Econômica · 17h50\",\"detalhes\":[{\"icone\":\"../img/icones/calendario2.png\",\"texto\":\"Voo em 31/10/2026\"},{\"icone\":\"../img/icones/aviao2.png\",\"texto\":\"São Paulo (GRU) → Santorini (JTR) · 18:20\"}],\"imagem\":\"../img/destinos/img02.jpg\",\"icone\":\"../img/icones/aviao2.png\"}],\"comprador\":{\"nome\":\"Alice Novacoski Vieira\",\"email\":\"alice.novacoski10@gmail.com\",\"cpf\":\"117.145.449-07\",\"telefone\":\"(48) 99201-9988\"},\"viajantes\":[{\"nome\":\"Alice Novacoski\",\"cpf\":\"117.145.449-07\",\"nascimento\":\"2010-02-15\",\"categoria\":\"Adulto\",\"id\":\"11714544907\"}],\"ods\":[],\"descontoSaldo\":0,\"descontoCupom\":0}}', '2026-11-09 09:05:36');

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
-- Estrutura para tabela `classes_voo`
--

CREATE TABLE `classes_voo` (
  `id_classe` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `classes_voo`
--

INSERT INTO `classes_voo` (`id_classe`, `nome`) VALUES
(1, 'Econômica'),
(2, 'Premium Economy'),
(3, 'Executiva'),
(4, 'Primeira Classe');

-- --------------------------------------------------------

--
-- Estrutura para tabela `companhias_aereas`
--

CREATE TABLE `companhias_aereas` (
  `id_companhia` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `codigo_iata` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(17, 'Lisboa', 'Portugal', 'Lisboa', 'Destino conhecido pela arquitetura histórica, gastronomia, cultura e belas paisagens.', 'lisboa.jpg', 'Cultura', 6290.00, 8, 0, 0, 0, 0),
(18, 'Bonito', 'Brasil', 'Bonito', 'Destino de ecoturismo conhecido por rios transparentes, grutas e atividades de natureza. Prioriza experiências com controle de visitação e condutores locais.', 'bonito.jpg', 'Natureza', 1250.00, 4, 0, 1, 1, 1),
(19, 'Chapada Diamantina', 'Brasil', 'Lençóis', 'Região de trilhas, cachoeiras e comunidades do interior baiano. Roteiros com guias locais ajudam a distribuir renda e valorizar a cultura regional.', 'chapada-diamantina.jpg', 'Natureza', 1100.00, 4, 0, 1, 1, 1),
(20, 'Jalapão', 'Brasil', 'Mateiros', 'Paisagens de cerrado, fervedouros e dunas. O turismo de base local pode apoiar pequenos prestadores e incentivar o respeito às áreas naturais.', 'jalapao.jpg', 'Natureza', 1650.00, 5, 0, 0, 1, 1),
(21, 'Ilha do Mel', 'Brasil', 'Paranaguá', 'Destino de natureza com praias e trilhas, onde deslocamentos a pé e respeito às áreas protegidas contribuem para uma visita de menor impacto.', 'ilha-do-mel.jpg', 'Praia', 890.00, 3, 1, 1, 1, 1),
(22, 'Alter do Chão', 'Brasil', 'Santarém', 'Comunidade amazônica conhecida pelas praias fluviais e cultura regional. Experiências conduzidas por moradores valorizam a economia local.', 'alter-do-chao.jpg', 'Natureza', 1380.00, 5, 1, 0, 1, 1),
(23, 'Serra da Canastra', 'Brasil', 'São Roque de Minas', 'Região de cerrado, nascentes e cachoeiras, com oportunidades de turismo rural, gastronomia regional e contratação de guias locais.', 'serra-da-canastra.jpg', 'Natureza', 980.00, 3, 0, 0, 1, 1),
(24, 'Seul', 'Coreia do Sul', 'Seul', 'Explore palácios históricos, bairros culturais, gastronomia e transporte urbano da capital sul-coreana.', 'europa.jpg', 'Cultura', 6200.00, 7, 0, 1, 0, 0);

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
(17, 7),
(18, 3),
(18, 7),
(19, 3),
(19, 5),
(19, 7),
(20, 3),
(20, 7),
(21, 1),
(21, 3),
(21, 7),
(22, 1),
(22, 3),
(22, 6),
(22, 7),
(23, 3),
(23, 6),
(23, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `favoritos`
--

CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `id_item` int(11) NOT NULL,
  `data_favoritado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `favoritos`
--

INSERT INTO `favoritos` (`id_favorito`, `id_usuario`, `tipo`, `id_item`, `data_favoritado`) VALUES
(9, 1, 'destino', 2, '2026-10-02 11:32:27'),
(17, 1, 'destino', 3, '2026-10-02 11:32:28'),
(43, 1, 'destino', 7, '2026-10-02 11:38:47'),
(49, 1, 'destino', 8, '2026-10-02 11:47:30'),
(52, 1, 'destino', 6, '2026-10-05 08:22:54'),
(56, 1, 'oferta', 28, '2026-10-05 08:23:14'),
(57, 1, 'destino', 4, '2026-10-05 08:23:50'),
(61, 1, 'oferta', 6, '2026-10-05 08:50:38'),
(63, 1, 'hotel', 5, '2026-10-12 21:02:12'),
(64, 1, 'atividade', 1, '2026-10-12 21:06:03'),
(71, 1, 'oferta', 1, '2026-10-13 20:25:06'),
(72, 1, 'oferta', 12, '2026-10-22 14:07:34'),
(73, 1, 'oferta', 25, '2026-10-28 15:23:13');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotos_atividades`
--

CREATE TABLE `fotos_atividades` (
  `id_foto` int(11) NOT NULL,
  `id_atividade` int(11) NOT NULL,
  `caminho_foto` varchar(255) NOT NULL,
  `legenda` varchar(200) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `origem` enum('oficial','usuario') NOT NULL DEFAULT 'oficial',
  `status` enum('pendente','aprovada','rejeitada') NOT NULL DEFAULT 'aprovada',
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotos_hoteis`
--

CREATE TABLE `fotos_hoteis` (
  `id_foto` int(11) NOT NULL,
  `id_hotel` int(11) NOT NULL,
  `caminho_foto` varchar(255) NOT NULL,
  `legenda` varchar(150) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `origem` enum('oficial','usuario') NOT NULL DEFAULT 'oficial',
  `status` enum('pendente','aprovada','rejeitada') NOT NULL DEFAULT 'aprovada',
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fotos_hoteis`
--

INSERT INTO `fotos_hoteis` (`id_foto`, `id_hotel`, `caminho_foto`, `legenda`, `id_usuario`, `origem`, `status`, `data_envio`) VALUES
(1, 1, 'img/hoteis/hotel-das-cataratas.jpg', 'Foto principal - Hotel das Cataratas', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(2, 2, 'img/hoteis/copacabana.jpg', 'Foto principal - Copacabana Palace', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(3, 3, 'img/hoteis/fasano-boa-vista.jpg', 'Foto principal - Fasano Boa Vista', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(4, 4, 'img/hoteis/fasano-rio.jpg', 'Foto principal - Fasano Rio de Janeiro', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(5, 5, 'img/hoteis/fasano-sao-paulo.jpg', 'Foto principal - Fasano São Paulo', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(6, 6, 'img/hoteis/palacio-tangara.jpg', 'Foto principal - Palácio Tangará', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(7, 7, 'img/hoteis/uxua-casa-hotel.jpg', 'Foto principal - UXUA Casa Hotel & Spa', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(8, 8, 'img/hoteis/emiliano-sao-paulo.jpg', 'Foto principal - Emiliano São Paulo', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(9, 9, 'img/hoteis/amanzoe-grecia.jpg', 'Foto principal - Amanzoe Grécia', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(10, 10, 'img/hoteis/las-ventanas.jpg', 'Foto principal - Las Ventanas al Paraíso México', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(11, 11, 'img/hoteis/nihi-sumba.jpg', 'Foto principal - NIHI Sumba Indonésia', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(12, 12, 'img/hoteis/nautilus-maldivas.jpg', 'Foto principal - The Nautilus Maldivas', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(13, 13, 'img/hoteis/cheval-blanc.jpg', 'Foto principal - Cheval Blanc St-Tropez França', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(14, 14, 'img/hoteis/passalacqua.jpg', 'Foto principal - Passalacqua Itália', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(15, 15, 'img/hoteis/aman-new-york.jpg', 'Foto principal - Aman New York Estados Unidos', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(16, 16, 'img/hoteis/four-seasons-buenos-aires.jpg', 'Foto principal - Four Seasons Hotel Buenos Aires Argentina', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28'),
(17, 17, 'img/hoteis/the-rebello-porto.jpg', 'Foto principal - The Rebello Porto Portugal', NULL, 'oficial', 'aprovada', '2026-10-12 22:31:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotos_publicacoes`
--

CREATE TABLE `fotos_publicacoes` (
  `id_foto` int(11) NOT NULL,
  `id_publicacao` int(11) NOT NULL,
  `caminho_foto` varchar(500) NOT NULL,
  `ordem` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `data_envio` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `hoteis`
--

CREATE TABLE `hoteis` (
  `id_hotel` int(10) NOT NULL,
  `nome_hotel` varchar(50) NOT NULL,
  `descricao_hotel` varchar(300) NOT NULL,
  `quarto_hotel` varchar(50) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `preco_diaria` decimal(10,2) DEFAULT NULL,
  `classificacao` tinyint(4) DEFAULT NULL,
  `imagem_principal` varchar(255) DEFAULT NULL,
  `site_oficial` varchar(255) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `ods8` tinyint(1) NOT NULL DEFAULT 0,
  `ods12` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `hoteis`
--

INSERT INTO `hoteis` (`id_hotel`, `nome_hotel`, `descricao_hotel`, `quarto_hotel`, `cidade`, `pais`, `endereco`, `preco_diaria`, `classificacao`, `imagem_principal`, `site_oficial`, `ativo`, `ods8`, `ods12`) VALUES
(1, 'Hotel das Cataratas', 'Hotel de luxo próximo às Cataratas do Iguaçu, cercado pela natureza e com experiências exclusivas.', 'Suíte de luxo com vista para as Cataratas', 'Foz do Iguaçu', 'Brasil', 'Rodovia BR-469, Km 32, Parque Nacional do Iguaçu', 6500.00, 5, 'img/hoteis/hotel-das-cataratas.jpg', 'https://www.belmond.com/hotels/south-america/brazil/iguassu-falls/belmond-hotel-das-cataratas/', 1, 1, 1),
(2, 'Copacabana Palace', 'Hotel icônico à beira-mar em Copacabana, com gastronomia sofisticada, piscina e atendimento de luxo.', 'Quarto de luxo com vista para o mar', 'Rio de Janeiro', 'Brasil', 'Avenida Atlântica, 1702', 2500.00, 5, 'img/hoteis/copacabana.jpg', 'https://www.copacabanapalace.com/', 1, 1, 0),
(3, 'Fasano Boa Vista', 'Refúgio de luxo no interior paulista, com natureza, lazer e experiências de descanso.', 'Suíte de luxo com vista para a natureza', 'Porto Feliz', 'Brasil', 'Rodovia Castello Branco, Km 102,5', 1800.00, 5, 'img/hoteis/fasano-boa-vista.jpg', 'https://www.fasano.com.br/', 1, 1, 0),
(4, 'Fasano Rio de Janeiro', 'Hotel sofisticado no Rio de Janeiro, com vista para o mar e serviços exclusivos.', 'Suíte de luxo com vista para o mar', 'Rio de Janeiro', 'Brasil', 'Avenida Vieira Souto, 80', 3500.00, 5, 'img/hoteis/fasano-rio.jpg', 'https://www.fasano.com.br/', 1, 1, 0),
(5, 'Fasano São Paulo', 'Hotel de luxo em São Paulo, conhecido pela arquitetura elegante, gastronomia e atendimento personalizado.', 'Quarto de luxo', 'São Paulo', 'Brasil', 'Rua Vittorio Fasano, 88', 2800.00, 5, 'img/hoteis/fasano-sao-paulo.jpg', 'https://www.fasano.com.br/', 1, 1, 0),
(6, 'Palácio Tangará', 'Hotel de luxo cercado por jardins, com spa, piscina e experiências gastronômicas.', 'Suíte de luxo', 'São Paulo', 'Brasil', 'Rua Deputado Laércio Corte, 1501', 3200.00, 5, 'img/hoteis/palacio-tangara.jpg', 'https://www.oetkercollection.com/', 1, 1, 0),
(7, 'UXUA Casa Hotel & Spa', 'Hospedagem exclusiva em Trancoso, com casas privativas, design artesanal e atmosfera tropical.', 'Casa privativa de luxo', 'Trancoso', 'Brasil', 'Praça São João, Quadrado', 2200.00, 5, 'img/hoteis/uxua-casa-hotel.jpg', 'https://uxua.com/', 1, 1, 1),
(8, 'Emiliano São Paulo', 'Hotel sofisticado em São Paulo, com design contemporâneo, gastronomia e serviços personalizados.', 'Suíte de luxo', 'São Paulo', 'Brasil', 'Rua Oscar Freire, 384', 2500.00, 5, 'img/hoteis/emiliano-sao-paulo.jpg', 'https://www.emiliano.com.br/', 1, 1, 0),
(9, 'Amanzoe Grécia', 'Resort de luxo na Grécia, com vilas privativas, piscinas e vista para o mar Mediterrâneo.', 'Suíte com piscina privativa', 'Porto Heli', 'Grécia', 'Porto Heli, Península do Peloponeso', 7000.00, 5, 'img/hoteis/amanzoe-grecia.jpg', 'https://www.aman.com/resorts/amanzoe', 1, 1, 1),
(10, 'Las Ventanas al Paraíso México', 'Resort de luxo em Los Cabos, com piscinas privativas, spa e paisagens do litoral mexicano.', 'Suíte de luxo com vista para o mar', 'Los Cabos', 'México', 'Carretera Transpeninsular, Corredor Turístico', 8500.00, 5, 'img/hoteis/las-ventanas.jpg', 'https://www.rosewoodhotels.com/', 1, 1, 0),
(11, 'NIHI Sumba Indonésia', 'Hospedagem exclusiva na Indonésia, com contato com a natureza, praias e experiências culturais.', 'Vila privativa com piscina', 'Sumba', 'Indonésia', 'Nihiwatu, Ilha de Sumba', 9000.00, 5, 'img/hoteis/nihi-sumba.jpg', 'https://nihi.com/', 1, 1, 1),
(12, 'The Nautilus Maldivas', 'Resort de luxo nas Maldivas, com vilas sobre as águas e experiências em meio ao oceano Índico.', 'Vila sobre as águas', 'Atol de Baa', 'Maldivas', 'Atol de Baa', 12000.00, 5, 'img/hoteis/nautilus-maldivas.jpg', 'https://www.thenautilusmaldives.com/', 1, 1, 0),
(13, 'Cheval Blanc St-Tropez França', 'Hotel de luxo na Riviera Francesa, com gastronomia sofisticada e ambiente elegante.', 'Suíte de luxo', 'Saint-Tropez', 'França', 'Boulevard des Crêtes', 6500.00, 5, 'img/hoteis/cheval-blanc.jpg', 'https://www.chevalblanc.com/', 1, 1, 0),
(14, 'Passalacqua Itália', 'Hotel de luxo às margens do Lago de Como, em uma propriedade histórica com jardins e vista para o lago.', 'Suíte com vista para o Lago de Como', 'Moltrasio', 'Itália', 'Via Besana, 59', 7500.00, 5, 'img/hoteis/passalacqua.jpg', 'https://www.passalacqua.it/', 1, 1, 0),
(15, 'Aman New York Estados Unidos', 'Hotel de luxo em Manhattan, com suítes sofisticadas, spa e serviços exclusivos.', 'Suíte de luxo', 'Nova York', 'Estados Unidos', '730 Fifth Avenue', 15000.00, 5, 'img/hoteis/aman-new-york.jpg', 'https://www.aman.com/hotels/aman-new-york', 1, 1, 0),
(16, 'Four Seasons Hotel Buenos Aires Argentina', 'Hotel de luxo em Buenos Aires, com jardins, piscina e gastronomia refinada.', 'Suíte de luxo', 'Buenos Aires', 'Argentina', 'Posadas, 1086', 3000.00, 5, 'img/hoteis/four-seasons-buenos-aires.jpg', 'https://www.fourseasons.com/buenosaires/', 1, 1, 0),
(17, 'The Rebello Porto Portugal', 'Hotel em Vila Nova de Gaia, com vista para o rio Douro e ambientes de design contemporâneo.', 'Suíte com vista para o rio Douro', 'Vila Nova de Gaia', 'Portugal', 'Rua do Barão de Forrester, 69', 1800.00, 5, 'img/hoteis/the-rebello-porto.jpg', 'https://www.therebello.com/', 1, 1, 0),
(18, 'Pousada Caminho das Águas', 'Cadastro demonstrativo de hospedagem econômica em Bonito. A proposta do anúncio destaca contratação de fornecedores locais e orientação para uso responsável da água.', 'Quarto standard', 'Bonito', 'Brasil', 'Centro de Bonito', 220.00, 3, 'img/hoteis/pousada-caminho-das-aguas.jpg', NULL, 1, 1, 1),
(19, 'Pousada Recanto da Chapada', 'Cadastro demonstrativo de hospedagem familiar em Lençóis, com foco em fornecedores regionais, valorização da comunidade e redução de desperdício.', 'Quarto casal', 'Lençóis', 'Brasil', 'Centro de Lençóis', 190.00, 3, 'img/hoteis/pousada-recanto-chapada.jpg', NULL, 1, 1, 1),
(20, 'Hospedaria do Jalapão', 'Cadastro demonstrativo de hospedagem simples em Mateiros, com proposta de apoio a pequenos negócios locais e consumo consciente de recursos.', 'Quarto standard', 'Mateiros', 'Brasil', 'Área central de Mateiros', 240.00, 3, 'img/hoteis/hospedaria-jalapao.jpg', NULL, 1, 1, 1),
(21, 'Pousada Ilha Verde', 'Cadastro demonstrativo de pousada econômica na Ilha do Mel, com incentivo a deslocamentos não motorizados e redução de resíduos.', 'Quarto casal', 'Paranaguá', 'Brasil', 'Encantadas, Ilha do Mel', 260.00, 3, 'img/hoteis/pousada-ilha-verde.jpg', NULL, 1, 1, 1),
(22, 'Pousada Tapajós', 'Cadastro demonstrativo de hospedagem em Alter do Chão, com proposta de valorizar a gastronomia regional e contratar serviços da comunidade.', 'Quarto standard', 'Santarém', 'Brasil', 'Alter do Chão', 230.00, 3, 'img/hoteis/pousada-tapajos.jpg', NULL, 1, 1, 0),
(23, 'Pousada Serra da Canastra', 'Cadastro demonstrativo de hospedagem rural com valorização de produtores locais, café regional e orientação para economia de água e energia.', 'Quarto casal', 'São Roque de Minas', 'Brasil', 'Centro de São Roque de Minas', 210.00, 3, 'img/hoteis/pousada-serra-canastra.jpg', NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `notificacoes`
--

CREATE TABLE `notificacoes` (
  `id_notificacao` int(11) NOT NULL,
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
  `data_agendamento` datetime DEFAULT NULL,
  `status` enum('pendente','enviada','cancelada') NOT NULL DEFAULT 'enviada',
  `chave_evento` varchar(150) DEFAULT NULL,
  `data_envio` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `notificacoes`
--

INSERT INTO `notificacoes` (`id_notificacao`, `id_usuario`, `tipo`, `titulo`, `mensagem`, `link`, `referencia_tipo`, `referencia_id`, `lida`, `data_criacao`, `data_leitura`, `data_agendamento`, `status`, `chave_evento`, `data_envio`) VALUES
(1, 1, 'sistema', 'Notificação de teste!', 'As notificações do BoaTour estão funcionando.', NULL, NULL, NULL, 1, '2026-11-05 14:40:36', '2026-11-05 14:40:47', NULL, 'enviada', NULL, NULL),
(2, 1, 'viagem', 'Sua viagem está chegando!', 'Está quase na hora de fazer as malas! Sua viagem acontece em breve. Confira os detalhes.', NULL, 'viagem', '101', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(3, 1, 'viagem', 'Viagem confirmada!', 'Sua reserva foi confirmada com sucesso. Agora é só começar a contagem regressiva!', NULL, 'viagem', '102', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(4, 1, 'pagamento', 'Pagamento aprovado!', 'Seu pagamento foi processado com sucesso. Sua viagem está mais perto!', NULL, 'pagamento', '201', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(5, 1, 'pagamento', 'Saldo atualizado!', 'Seu saldo BoaPay foi atualizado. Acesse sua carteira para conferir o novo valor.', NULL, 'boapay', '202', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(6, 1, 'ods', 'Você ganhou pontos!', 'Parabéns! Sua ação sustentável gerou novos pontos para sua conta.', NULL, 'ods', '301', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(7, 1, 'ods', 'Nova recompensa disponível!', 'Você tem uma nova recompensa disponível para resgatar. Confira seus benefícios!', NULL, 'ods', '302', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(8, 1, 'oferta', 'Novas ofertas disponíveis!', 'Encontramos novas oportunidades de viagem para você. Confira as promoções da BoaTour!', NULL, 'oferta', '401', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(9, 1, 'oferta', 'Seu destino favorito está em promoção!', 'Um destino que você demonstrou interesse está com uma oferta especial.', NULL, 'oferta', '402', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(10, 1, 'cupom', 'Seu cupom está vencendo!', 'Um dos seus cupons está próximo do vencimento. Aproveite antes que expire!', NULL, 'cupom', '501', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(11, 1, 'voo', 'Atualização no seu voo!', 'Houve uma atualização nas informações do seu voo. Confira os detalhes do rastreamento.', NULL, 'voo', '601', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(12, 1, 'viagem', 'Hora de fazer as malas!', 'Sua viagem está próxima. Confira os documentos, as passagens e os itens necessários.', NULL, 'viagem', '103', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(13, 1, 'avaliacao', 'Como foi sua viagem?', 'Esperamos que tenha aproveitado cada momento! Que tal avaliar sua experiência?', NULL, 'viagem', '104', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(14, 1, 'usuario', 'Feliz aniversário!', 'Hoje é seu dia! A BoaTour deseja muitas felicidades e novas aventuras!', NULL, 'usuario', '1', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(15, 1, 'seguranca', 'Senha alterada', 'A senha da sua conta foi alterada. Se não foi você, entre em contato com nosso suporte.', NULL, 'usuario', '1', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL),
(16, 1, 'novidade', 'Novos destinos disponíveis!', 'Temos novos lugares para você explorar. Descubra sua próxima aventura!', NULL, 'destino', '701', 0, '2026-11-06 10:33:42', NULL, NULL, 'enviada', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `tipo_alvo` enum('produto','pacote') NOT NULL,
  `tipo_produto` enum('destino','hotel','voo','atividade') DEFAULT NULL,
  `id_produto` int(11) DEFAULT NULL,
  `id_pacote` int(11) DEFAULT NULL,
  `preco_anterior` decimal(10,2) NOT NULL,
  `preco_atual` decimal(10,2) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime NOT NULL,
  `status` enum('rascunho','agendada','ativa','encerrada','cancelada') NOT NULL DEFAULT 'rascunho',
  `limite_vendas` int(11) DEFAULT NULL,
  `vendas_realizadas` int(11) NOT NULL DEFAULT 0,
  `ods8` tinyint(1) NOT NULL DEFAULT 0,
  `ods12` tinyint(1) NOT NULL DEFAULT 0,
  `destaque` tinyint(1) NOT NULL DEFAULT 0,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `ofertas`
--

INSERT INTO `ofertas` (`id`, `titulo`, `descricao`, `imagem`, `tipo_alvo`, `tipo_produto`, `id_produto`, `id_pacote`, `preco_anterior`, `preco_atual`, `data_inicio`, `data_fim`, `status`, `limite_vendas`, `vendas_realizadas`, `ods8`, `ods12`, `destaque`, `data_criacao`) VALUES
(1, 'Férias em Foz do Iguaçu', 'Aproveite 5 dias em Foz do Iguaçu com hospedagem no Hotel das Cataratas e passeio pelas trilhas do Parque Nacional.', 'img/ofertas/foz.jpg', 'pacote', NULL, NULL, 1, 6620.00, 6310.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-19 09:21:07'),
(2, 'Paraíso em Fernando de Noronha', 'Explore as praias e a natureza de Fernando de Noronha.', 'img/destinos/img01.jpg', 'produto', 'destino', 1, NULL, 1890.00, 1699.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-10-19 09:43:34'),
(3, 'Descubra Santorini', 'Conheça as paisagens e os famosos pores do sol da Grécia.', 'img/destinos/img02.jpg', 'produto', 'destino', 2, NULL, 4200.00, 3890.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 0, 0, 1, '2026-10-19 09:43:34'),
(4, 'Férias em Cancún', 'Aproveite praias caribenhas e paisagens tropicais.', 'img/destinos/img03.jpg', 'produto', 'destino', 3, NULL, 3200.00, 2890.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 0, 0, 1, '2026-10-19 09:43:34'),
(5, 'Paris cultural', 'Explore museus, arquitetura e a gastronomia francesa.', 'img/destinos/paris.jpg', 'produto', 'destino', 6, NULL, 3800.00, 3490.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-10-19 09:43:34'),
(6, 'Encantos de Gramado', 'Descubra a gastronomia, as paisagens e as atrações da Serra Gaúcha.', 'img/destinos/gramado.jpg', 'produto', 'destino', 9, NULL, 2290.00, 1990.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-10-19 09:43:34'),
(7, 'Aventura em Foz do Iguaçu', 'Conheça as Cataratas e as atrações naturais da região.', 'img/destinos/foz.jpg', 'produto', 'destino', 10, NULL, 2380.00, 2190.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-10-19 09:43:34'),
(8, 'Estadia no Copacabana Palace', 'Diária promocional no icônico hotel à beira-mar do Rio de Janeiro.', 'img/hoteis/copacabana.jpg', 'produto', 'hotel', 2, NULL, 2500.00, 2250.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 1, '2026-10-19 09:43:34'),
(9, 'Experiência Fasano Rio', 'Diária promocional em hotel sofisticado com vista para o mar.', 'img/hoteis/fasano-rio.jpg', 'produto', 'hotel', 4, NULL, 3500.00, 3150.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-10-19 09:43:34'),
(10, 'Hospedagem em Lisboa', 'Diária promocional no The Rebello, com vista para o rio Douro.', 'img/hoteis/the-rebello-porto.jpg', 'produto', 'hotel', 17, NULL, 1800.00, 1620.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-10-19 09:43:34'),
(11, 'Passeio pela orla de Copacabana', 'Caminhada pela orla mais famosa do Rio de Janeiro.', 'img/atividades/orla-copacabana.jpg', 'produto', 'atividade', 2, NULL, 80.00, 65.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-10-19 09:43:34'),
(12, 'Mergulho em Fernando de Noronha', 'Explore a vida marinha com equipamentos e acompanhamento de instrutor.', 'img/atividades/mergulho-noronha.jpg', 'produto', 'atividade', 18, NULL, 280.00, 239.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-10-19 09:43:34'),
(13, 'Pôr do sol em Santorini', 'Contemple as paisagens da ilha grega ao entardecer.', 'img/atividades/por-do-sol-santorini.jpg', 'produto', 'atividade', 20, NULL, 180.00, 149.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-10-19 09:43:34'),
(14, 'Tour pelos monumentos de Paris', 'Conheça os principais pontos turísticos da capital francesa.', 'img/atividades/monumentos-paris.jpg', 'produto', 'atividade', 28, NULL, 190.00, 159.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-10-19 09:43:34'),
(15, 'Visita às Cataratas do Iguaçu', 'Admire as quedas-d’água pelas trilhas e passarelas do parque.', 'img/atividades/trilhas-cataratas.jpeg', 'produto', 'atividade', 35, NULL, 120.00, 99.00, '2026-10-19 00:00:00', '2026-12-31 23:59:59', 'cancelada', NULL, 0, 1, 1, 1, '2026-10-19 09:43:34'),
(16, 'Férias completas em Foz do Iguaçu', 'Pacote com hospedagem no Hotel das Cataratas e passeio pela trilha das Cataratas do Iguaçu.', 'img/ofertas/foz.jpg', 'pacote', NULL, NULL, 1, 6620.00, 5958.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:51:33'),
(17, 'Escapada em Gramado', 'Viagem para curtir o centro de Gramado, a gastronomia e atrações da Serra Gaúcha.', 'img/ofertas/gramado.jpg', 'pacote', NULL, NULL, 2, 2650.00, 2385.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(18, 'Praias de Fernando de Noronha', 'Pacote para aproveitar as praias e as paisagens naturais de Fernando de Noronha.', 'img/ofertas/fernando.jpg', 'pacote', NULL, NULL, 3, 5200.00, 4680.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(19, 'Caribe em Cancún', 'Pacote de férias com praias, passeios e experiências no Caribe mexicano.', 'img/ofertas/cancun.jpg', 'pacote', NULL, NULL, 4, 6900.00, 6210.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(20, 'Paris cultural', 'Descubra monumentos, museus, arquitetura e gastronomia de Paris.', 'img/ofertas/paris.jpg', 'pacote', NULL, NULL, 5, 8900.00, 8010.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(21, 'Aventura em Bonito', 'Dias de natureza, trilhas, cachoeiras e flutuação em Bonito.', 'img/ofertas/bonito.jpg', 'pacote', NULL, NULL, 6, 2800.00, 2520.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(22, 'Descobrindo Florianópolis', 'Pacote para aproveitar praias, trilhas e paisagens da Ilha da Magia.', 'img/ofertas/florianopolis.jpg', 'pacote', NULL, NULL, 7, 1890.00, 1701.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(23, 'Roma histórica', 'Uma viagem pela história, arquitetura e gastronomia da capital italiana.', 'img/ofertas/roma.jpg', 'pacote', NULL, NULL, 8, 7200.00, 6480.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 1, '2026-10-22 08:56:42'),
(24, 'Bali', 'Destino famoso pelas praias paradisíacas, templos, natureza exuberante e cultura local.', 'img/destinos/img04.jpg', 'produto', 'destino', 4, NULL, 3800.00, 3420.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 1, 1, 1, '2026-10-22 08:56:42'),
(25, 'Maldivas', 'Destino famoso pelas praias paradisíacas, águas cristalinas e resorts sobre o mar.', 'img/destinos/img05.jpg', 'produto', 'destino', 5, NULL, 4500.00, 4050.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 1, 1, '2026-10-22 08:56:42'),
(26, 'Roma', 'Destino famoso pelo Coliseu, monumentos históricos e rica cultura.', 'img/destinos/roma.jpg', 'produto', 'destino', 7, NULL, 3500.00, 3150.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(27, 'Disney Orlando', 'Destino conhecido pelos parques temáticos, atrações para toda a família e experiências de entretenimento.', 'img/destinos/disney.jpg', 'produto', 'destino', 8, NULL, 5000.00, 4500.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(28, 'Curitiba', 'Destino conhecido pela gastronomia, parques, arquitetura e atrações culturais.', 'img/destinos/curitiba.jpg', 'produto', 'destino', 11, NULL, 990.00, 891.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(29, 'Salvador', 'Destino conhecido pelas praias, cultura, história, gastronomia e tradições baianas.', 'img/destinos/salvador.jpg', 'produto', 'destino', 12, NULL, 1990.00, 1791.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(30, 'Rio de Janeiro', 'Destino famoso pelas praias, paisagens, pontos turísticos e pela diversidade cultural.', 'img/destinos/riodejaneiro.jpg', 'produto', 'destino', 13, NULL, 1790.00, 1611.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(31, 'Maceió', 'Destino conhecido pelas praias de águas cristalinas, piscinas naturais e paisagens paradisíacas.', 'img/destinos/maceio.jpg', 'produto', 'destino', 14, NULL, 2390.00, 2151.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(39, 'Hotel das Cataratas', 'Hotel de luxo próximo às Cataratas do Iguaçu, cercado pela natureza e com experiências exclusivas.', 'img/hoteis/hotel-das-cataratas.jpg', 'produto', 'hotel', 1, NULL, 6500.00, 5850.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(40, 'Fasano Boa Vista', 'Refúgio de luxo no interior paulista, com natureza, lazer e experiências de descanso.', 'img/hoteis/fasano-boa-vista.jpg', 'produto', 'hotel', 3, NULL, 1800.00, 1620.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(41, 'Fasano São Paulo', 'Hotel de luxo em São Paulo, conhecido pela arquitetura elegante, gastronomia e atendimento personalizado.', 'img/hoteis/fasano-sao-paulo.jpg', 'produto', 'hotel', 5, NULL, 2800.00, 2520.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(42, 'Palácio Tangará', 'Hotel de luxo cercado por jardins, com spa, piscina e experiências gastronômicas.', 'img/hoteis/palacio-tangara.jpg', 'produto', 'hotel', 6, NULL, 3200.00, 2880.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(43, 'UXUA Casa Hotel & Spa', 'Hospedagem exclusiva em Trancoso, com casas privativas, design artesanal e atmosfera tropical.', 'img/hoteis/uxua-casa-hotel.jpg', 'produto', 'hotel', 7, NULL, 2200.00, 1980.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(44, 'Emiliano São Paulo', 'Hotel sofisticado em São Paulo, com design contemporâneo, gastronomia e serviços personalizados.', 'img/hoteis/emiliano-sao-paulo.jpg', 'produto', 'hotel', 8, NULL, 2500.00, 2250.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(45, 'Amanzoe Grécia', 'Resort de luxo na Grécia, com vilas privativas, piscinas e vista para o mar Mediterrâneo.', 'img/hoteis/amanzoe-grecia.jpg', 'produto', 'hotel', 9, NULL, 7000.00, 6300.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(46, 'Las Ventanas al Paraíso México', 'Resort de luxo em Los Cabos, com piscinas privativas, spa e paisagens do litoral mexicano.', 'img/hoteis/las-ventanas.jpg', 'produto', 'hotel', 10, NULL, 8500.00, 7650.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(54, 'Trilha até as Cataratas do Iguaçu', 'Caminhada pelas trilhas do Parque Nacional do Iguaçu, permitindo observar as famosas quedas d’água e a natureza ao redor.', 'img/atividades/trilha-cataratas.jpeg', 'produto', 'atividade', 1, NULL, 120.00, 108.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(55, 'Passeio a cavalo pela propriedade', 'Passeio tranquilo a cavalo pelas áreas verdes da propriedade, proporcionando contato com a natureza e momentos de relaxamento.', 'img/atividades/passeio-cavalo-fasano.jpg', 'produto', 'atividade', 3, NULL, 250.00, 225.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(56, 'Passeio pela praia de Ipanema', 'Caminhada pela praia de Ipanema para aproveitar a paisagem, o mar e um dos locais mais conhecidos do Rio de Janeiro.', 'img/atividades/praia-ipanema.jpg', 'produto', 'atividade', 4, NULL, 70.00, 63.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(57, 'Visita ao MASP', 'Visita ao Museu de Arte de São Paulo para conhecer exposições, obras de arte e um dos principais pontos culturais da cidade.', 'img/atividades/masp-sao-paulo.jpg', 'produto', 'atividade', 5, NULL, 90.00, 81.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(58, 'Caminhada pelo Parque Burle Marx', 'Passeio pelas áreas verdes do parque, observando jardins, plantas e paisagens projetadas pelo famoso paisagista Burle Marx.', 'img/atividades/parque-burle-marx.jpg', 'produto', 'atividade', 6, NULL, 60.00, 54.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(59, 'Passeio pelo Quadrado de Trancoso', 'Visita ao centro histórico de Trancoso, conhecido por suas construções tradicionais, restaurantes, lojas e ambiente agradável.', 'img/atividades/quadrado-trancoso.jpg', 'produto', 'atividade', 7, NULL, 50.00, 45.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(60, 'Passeio pela Avenida Paulista', 'Caminhada pela Avenida Paulista para conhecer seus museus, lojas, restaurantes e a movimentada vida urbana de São Paulo.', 'img/atividades/avenida-paulista.jpg', 'produto', 'atividade', 8, NULL, 40.00, 36.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(61, 'Passeio de barco pelo mar Egeu', 'Passeio de barco pelas águas do mar Egeu, proporcionando belas vistas da costa grega e das paisagens marítimas.', 'img/atividades/barco-mar-egeu.jpg', 'produto', 'atividade', 9, NULL, 180.00, 162.00, '2026-10-22 08:56:42', '2026-11-21 08:56:42', 'ativa', NULL, 0, 0, 0, 0, '2026-10-22 08:56:42'),
(62, 'Ecoturismo em Bonito', 'Oferta demonstrativa para conhecer Bonito com foco em natureza, condutores locais e visitação responsável.', 'img/destinos/bonito.jpg', 'produto', 'destino', 18, NULL, 1250.00, 1090.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-11-06 00:00:00'),
(63, 'Chapada Diamantina consciente', 'Oferta demonstrativa de viagem econômica pela Chapada, valorizando guias e serviços da região.', 'img/destinos/chapada-diamantina.jpg', 'produto', 'destino', 19, NULL, 1100.00, 950.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-11-06 00:00:00'),
(64, 'Descubra o Jalapão', 'Oferta demonstrativa para explorar o cerrado com acompanhamento local e respeito aos atrativos naturais.', 'img/destinos/jalapao.jpg', 'produto', 'destino', 20, NULL, 1650.00, 1490.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(65, 'Fim de semana na Ilha do Mel', 'Oferta demonstrativa de estadia econômica em destino onde caminhadas e trilhas são alternativas de deslocamento.', 'img/destinos/ilha-do-mel.jpg', 'produto', 'destino', 21, NULL, 890.00, 790.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-11-06 00:00:00'),
(66, 'Alter do Chão e cultura local', 'Oferta demonstrativa para conhecer a região e experiências conduzidas por moradores.', 'img/destinos/alter-do-chao.jpg', 'produto', 'destino', 22, NULL, 1380.00, 1190.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(67, 'Serra da Canastra econômica', 'Oferta demonstrativa com turismo rural, natureza e valorização de pequenos produtores.', 'img/destinos/serra-da-canastra.jpg', 'produto', 'destino', 23, NULL, 980.00, 850.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(68, 'Hospedagem econômica em Bonito', 'Diária demonstrativa em hospedagem com proposta de apoio a fornecedores locais e uso consciente de recursos.', 'img/hoteis/pousada-caminho-das-aguas.jpg', 'produto', 'hotel', 18, NULL, 220.00, 198.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(69, 'Pousada acessível na Chapada', 'Diária demonstrativa em hospedagem familiar com valorização da economia regional.', 'img/hoteis/pousada-recanto-chapada.jpg', 'produto', 'hotel', 19, NULL, 190.00, 171.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(70, 'Hospedagem no Jalapão', 'Diária demonstrativa com proposta de consumo consciente e apoio a pequenos negócios locais.', 'img/hoteis/hospedaria-jalapao.jpg', 'produto', 'hotel', 20, NULL, 240.00, 216.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(71, 'Pousada Ilha Verde', 'Diária demonstrativa com incentivo a caminhadas e redução de resíduos.', 'img/hoteis/pousada-ilha-verde.jpg', 'produto', 'hotel', 21, NULL, 260.00, 234.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(72, 'Hospedagem em Alter do Chão', 'Diária demonstrativa com proposta de valorizar a gastronomia e os serviços da comunidade.', 'img/hoteis/pousada-tapajos.jpg', 'produto', 'hotel', 22, NULL, 230.00, 207.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 0, 0, '2026-11-06 00:00:00'),
(73, 'Pousada na Serra da Canastra', 'Diária demonstrativa com valorização de produtores regionais e consumo consciente.', 'img/hoteis/pousada-serra-canastra.jpg', 'produto', 'hotel', 23, NULL, 210.00, 189.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(74, 'Flutuação em Bonito com desconto', 'Atividade demonstrativa com orientação de condutor local e regras de conservação do rio.', 'img/atividades/flutuacao-bonito.jpg', 'produto', 'atividade', 44, NULL, 145.00, 125.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 1, '2026-11-06 00:00:00'),
(75, 'Trilha guiada na Chapada', 'Passeio demonstrativo com guia local e práticas de mínimo impacto.', 'img/atividades/trilha-chapada.jpg', 'produto', 'atividade', 45, NULL, 95.00, 79.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(76, 'Caminhada na Ilha do Mel', 'Passeio demonstrativo por trilhas, incentivando deslocamento a pé e respeito à área natural.', 'img/atividades/trilha-ilha-mel.jpg', 'produto', 'atividade', 47, NULL, 45.00, 35.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 0, 1, 0, '2026-11-06 00:00:00'),
(77, 'Vivência cultural em Alter do Chão', 'Experiência demonstrativa conduzida por anfitriões locais, valorizando cultura e renda comunitária.', 'img/atividades/passeio-cultural-alter.jpg', 'produto', 'atividade', 48, NULL, 75.00, 65.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(78, 'Observação de aves em Bonito', 'Atividade demonstrativa de observação responsável da fauna com guia da região.', 'img/atividades/observacao-aves-bonito.jpg', 'produto', 'atividade', 52, NULL, 90.00, 75.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00'),
(79, 'Passeio de bicicleta em Lençóis', 'Roteiro demonstrativo de mobilidade de menor impacto com serviço local.', 'img/atividades/ciclismo-lencois.jpg', 'produto', 'atividade', 53, NULL, 65.00, 55.00, '2026-11-06 00:00:00', '2027-12-31 23:59:59', 'ativa', NULL, 0, 1, 1, 0, '2026-11-06 00:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ofertas_antigas`
--

CREATE TABLE `ofertas_antigas` (
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
-- Despejando dados para a tabela `ofertas_antigas`
--

INSERT INTO `ofertas_antigas` (`id`, `destino_id`, `titulo`, `descricao`, `imagem`, `nacional`, `internacional`, `pacote`, `dias`, `quantidade_paises`, `passagem_aerea`, `hospedagem`, `passeios`, `preco_anterior`, `preco_atual`, `ods8`, `ods12`, `destaque`, `tudo_incluso`, `cafe_da_manha`) VALUES
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
-- Estrutura para tabela `pacotes`
--

CREATE TABLE `pacotes` (
  `id_pacote` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `dias` int(11) NOT NULL DEFAULT 1,
  `quantidade_paises` int(11) NOT NULL DEFAULT 1,
  `preco_base` decimal(10,2) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pacotes`
--

INSERT INTO `pacotes` (`id_pacote`, `titulo`, `descricao`, `imagem`, `dias`, `quantidade_paises`, `preco_base`, `ativo`, `data_criacao`) VALUES
(1, 'Férias completas em Foz do Iguaçu', 'Pacote com hospedagem no Hotel das Cataratas e passeio pela trilha das Cataratas do Iguaçu.', 'img/ofertas/foz.jpg', 5, 1, 6620.00, 1, '2026-10-19 09:21:07'),
(2, 'Escapada em Gramado', 'Viagem para curtir o centro de Gramado, a gastronomia e atrações da Serra Gaúcha.', 'img/ofertas/gramado.jpg', 4, 1, 2650.00, 1, '2026-10-22 08:56:42'),
(3, 'Praias de Fernando de Noronha', 'Pacote para aproveitar as praias e as paisagens naturais de Fernando de Noronha.', 'img/ofertas/fernando.jpg', 6, 1, 5200.00, 1, '2026-10-22 08:56:42'),
(4, 'Caribe em Cancún', 'Pacote de férias com praias, passeios e experiências no Caribe mexicano.', 'img/ofertas/cancun.jpg', 7, 1, 6900.00, 1, '2026-10-22 08:56:42'),
(5, 'Paris cultural', 'Descubra monumentos, museus, arquitetura e gastronomia de Paris.', 'img/ofertas/paris.jpg', 7, 1, 8900.00, 1, '2026-10-22 08:56:42'),
(6, 'Aventura em Bonito', 'Dias de natureza, trilhas, cachoeiras e flutuação em Bonito.', 'img/ofertas/bonito.jpg', 5, 1, 2800.00, 1, '2026-10-22 08:56:42'),
(7, 'Descobrindo Florianópolis', 'Pacote para aproveitar praias, trilhas e paisagens da Ilha da Magia.', 'img/ofertas/florianopolis.jpg', 4, 1, 1890.00, 1, '2026-10-22 08:56:42'),
(8, 'Roma histórica', 'Uma viagem pela história, arquitetura e gastronomia da capital italiana.', 'img/ofertas/roma.jpg', 6, 1, 7200.00, 1, '2026-10-22 08:56:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pacote_itens`
--

CREATE TABLE `pacote_itens` (
  `id_pacote_item` int(11) NOT NULL,
  `id_pacote` int(11) NOT NULL,
  `tipo_item` enum('destino','hotel','voo','atividade') NOT NULL,
  `id_item` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `observacoes` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pacote_itens`
--

INSERT INTO `pacote_itens` (`id_pacote_item`, `id_pacote`, `tipo_item`, `id_item`, `quantidade`, `observacoes`) VALUES
(1, 1, 'hotel', 1, 1, 'Hospedagem durante a viagem'),
(2, 1, 'atividade', 1, 1, 'Passeio incluído no pacote');

-- --------------------------------------------------------

--
-- Estrutura para tabela `publicacoes_viagens`
--

CREATE TABLE `publicacoes_viagens` (
  `id_publicacao` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `cidade` varchar(120) NOT NULL,
  `pais` varchar(120) NOT NULL,
  `nota_experiencia` decimal(2,1) DEFAULT NULL,
  `data_publicacao` datetime NOT NULL DEFAULT current_timestamp(),
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `banner_perfil` varchar(500) DEFAULT NULL,
  `perfil_completo` tinyint(1) NOT NULL DEFAULT 0,
  `termos_aceitos` tinyint(1) NOT NULL DEFAULT 0,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `cpf`, `email`, `data_nascimento`, `senha`, `telefone`, `foto_perfil`, `banner_perfil`, `perfil_completo`, `termos_aceitos`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'Jullia Volpato Santos', '15093341738', 'volpatosantosjullia@gmail.com', '2009-12-21', '$2b$12$ptx9suWjZlRHAtFFd62mWuREGaJ.vqT4L7ZsOFyNdpb9ve5.8/mJu', '48388148189', 'uploads/perfis/perfil_1_1793211783120.jpg', '../img/ofertas/santorini2.jpg', 0, 1, '2026-10-01 20:45:42', '2026-11-10 15:51:25'),
(18, 'Amanda Braz', '09772082900', 'braz.amanda05@gmail.com', '2010-02-05', '$2b$12$1w/G/ZvaOf3cc5Ow6w2LYuQjsaC1xZ3kpVlFqWXwgvyShWCU05nSO', '48996914827', NULL, NULL, 0, 1, '2026-11-10 16:07:03', '2026-11-10 16:07:03');

-- --------------------------------------------------------

--
-- Estrutura para tabela `viagens`
--

CREATE TABLE `viagens` (
  `id_viagem` varchar(30) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_pagamento` varchar(30) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `origem` varchar(80) DEFAULT NULL,
  `destino` varchar(80) DEFAULT NULL,
  `data_ida` date DEFAULT NULL,
  `data_volta` date DEFAULT NULL,
  `codigo_voo` varchar(10) DEFAULT NULL,
  `codigo_aviao` varchar(10) DEFAULT NULL,
  `status` enum('aguardando pagamento','confirmada','cancelada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `viagens`
--

INSERT INTO `viagens` (`id_viagem`, `id_usuario`, `id_pagamento`, `titulo`, `origem`, `destino`, `data_ida`, `data_volta`, `codigo_voo`, `codigo_aviao`, `status`) VALUES
('VG-20261030-8S8HJQ', 9, 'BP-20261030-8S8HJQ', 'Pacote Gramado (hotel + voo)', 'São Paulo', 'Gramado', '2027-01-15', '2027-01-20', 'BT4409', 'PR-XHH', 'confirmada'),
('VG-20261030-WARXRY', 9, 'BP-20261030-WARXRY', 'Pacote Gramado (hotel + voo)', 'São Paulo', 'Gramado', '2027-01-15', '2027-01-20', 'BT4870', 'PR-QAM', 'aguardando pagamento'),
('VG-20261103-2KKW4W', 9, 'BP-20261103-2KKW4W', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT3961', 'PR-WDF', 'aguardando pagamento'),
('VG-20261103-3LNJZE', 9, 'BP-20261103-3LNJZE', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT5898', 'PR-FGQ', 'confirmada'),
('VG-20261103-6LUCDP', 9, 'BP-20261103-6LUCDP', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT6333', 'PR-HDQ', 'confirmada'),
('VG-20261103-B3TKFD', 9, 'BP-20261103-B3TKFD', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT3189', 'PR-ZTX', 'aguardando pagamento'),
('VG-20261103-CQBZD9', 9, 'BP-20261103-CQBZD9', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT4034', 'PR-AQZ', 'confirmada'),
('VG-20261103-CR6QCU', 9, 'BP-20261103-CR6QCU', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT6841', 'PR-PWV', 'confirmada'),
('VG-20261103-D6AQ8E', 9, 'BP-20261103-D6AQ8E', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT5060', 'PR-CDD', 'confirmada'),
('VG-20261103-E3Z8KQ', 9, 'BP-20261103-E3Z8KQ', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT6518', 'PR-ADQ', 'confirmada'),
('VG-20261103-ENLLXY', 9, 'BP-20261103-ENLLXY', 'Pacote Gramado (hotel + voo)', 'São Paulo', 'Gramado', '2027-01-15', '2027-01-20', 'BT2589', 'PR-GDT', 'confirmada'),
('VG-20261103-MP63SC', 9, 'BP-20261103-MP63SC', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT2851', 'PR-GNG', 'confirmada'),
('VG-20261103-NJNNDS', 9, 'BP-20261103-NJNNDS', 'Voo Florianópolis → Paris', 'Florianópolis', 'Paris', '2027-05-02', '2027-05-16', 'BT5271', 'PR-LMQ', 'aguardando pagamento'),
('VG-20261103-PFTDXB', 9, 'BP-20261103-PFTDXB', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT5533', 'PR-LBC', 'confirmada'),
('VG-20261103-Q962WZ', 9, 'BP-20261103-Q962WZ', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT9879', 'PR-GNN', 'confirmada'),
('VG-20261104-NBT58D', 9, 'BP-20261104-NBT58D', 'Voo Porto Alegre → Lisboa', 'Porto Alegre', 'Lisboa', '2027-03-10', '2027-03-24', 'BT5804', 'PR-QPD', 'confirmada'),
('VG-20261104-VUGWLB', 9, 'BP-20261104-VUGWLB', 'Pacote Gramado (hotel + voo)', 'São Paulo', 'Gramado', '2027-01-15', '2027-01-20', 'BT6222', 'PR-YNF', 'confirmada');

-- --------------------------------------------------------

--
-- Estrutura para tabela `voos`
--

CREATE TABLE `voos` (
  `id_voo` int(10) NOT NULL,
  `numero_voo` varchar(10) NOT NULL,
  `companhia_aerea` varchar(50) NOT NULL,
  `origem` varchar(100) NOT NULL,
  `destino` varchar(100) NOT NULL,
  `data_saida` date NOT NULL,
  `horario_saida` time NOT NULL,
  `horario_chegada` time NOT NULL,
  `duracao` varchar(20) NOT NULL,
  `escalas` int(2) NOT NULL DEFAULT 0,
  `classe` varchar(50) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `preco_anterior` decimal(10,2) DEFAULT NULL,
  `assentos_disponiveis` int(2) NOT NULL DEFAULT 9,
  `oferta` tinyint(1) NOT NULL DEFAULT 0,
  `ods8` tinyint(1) NOT NULL DEFAULT 0,
  `ods12` tinyint(1) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `voos`
--

INSERT INTO `voos` (`id_voo`, `numero_voo`, `companhia_aerea`, `origem`, `destino`, `data_saida`, `horario_saida`, `horario_chegada`, `duracao`, `escalas`, `classe`, `preco`, `preco_anterior`, `assentos_disponiveis`, `oferta`, `ods8`, `ods12`, `ativo`) VALUES
(1, 'LA1234', 'LATAM Airlines', 'São Paulo (GRU)', 'Salvador (SSA)', '2026-10-20', '08:30:00', '10:50:00', '2h20', 0, 'Econômica', 599.90, 799.90, 9, 1, 1, 1, 0),
(2, 'G31234', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Rio de Janeiro (GIG)', '2026-10-20', '09:45:00', '10:50:00', '1h05', 0, 'Econômica', 349.90, NULL, 9, 0, 1, 0, 0),
(3, 'AD4567', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Recife (REC)', '2026-10-20', '11:00:00', '14:10:00', '3h10', 0, 'Econômica', 729.90, 899.90, 9, 1, 1, 1, 0),
(4, 'AA7890', 'American Airlines', 'São Paulo (GRU)', 'Miami (MIA)', '2026-10-20', '13:20:00', '21:00:00', '8h40', 0, 'Econômica', 2899.90, NULL, 9, 0, 0, 1, 0),
(5, 'DL5678', 'Delta Air Lines', 'São Paulo (GRU)', 'Atlanta (ATL)', '2026-10-20', '15:30:00', '23:30:00', '8h00', 1, 'Econômica', 3199.90, 3599.90, 9, 1, 0, 1, 0),
(6, 'AF3210', 'Air France', 'São Paulo (GRU)', 'Paris (CDG)', '2026-10-20', '18:00:00', '08:30:00', '11h30', 0, 'Executiva', 8999.90, NULL, 9, 0, 0, 1, 0),
(7, 'EK2020', 'Emirates', 'São Paulo (GRU)', 'Dubai (DXB)', '2026-10-21', '20:15:00', '17:30:00', '14h15', 0, 'Econômica', 4599.90, 5299.90, 9, 1, 0, 1, 0),
(8, 'TP1230', 'TAP Air Portugal', 'São Paulo (GRU)', 'Lisboa (LIS)', '2026-10-21', '22:30:00', '11:00:00', '9h30', 0, 'Econômica', 3299.90, NULL, 9, 0, 0, 1, 0),
(9, 'LA5678', 'LATAM Airlines', 'Rio de Janeiro (GIG)', 'Buenos Aires (EZE)', '2026-10-22', '07:20:00', '10:15:00', '2h55', 0, 'Econômica', 899.90, 1099.90, 9, 1, 1, 1, 0),
(10, 'GOL7890', 'GOL Linhas Aéreas', 'Florianópolis (FLN)', 'São Paulo (GRU)', '2026-10-22', '10:00:00', '11:15:00', '1h15', 0, 'Econômica', 299.90, NULL, 9, 0, 1, 0, 0),
(11, 'AZ9876', 'Azul Linhas Aéreas', 'Florianópolis (FLN)', 'Recife (REC)', '2026-10-22', '14:00:00', '17:40:00', '3h40', 1, 'Econômica', 799.90, 999.90, 9, 1, 1, 1, 0),
(12, 'LA4321', 'LATAM Airlines', 'São Paulo (GRU)', 'Salvador (SSA)', '2026-11-05', '16:30:00', '18:50:00', '2h20', 0, 'Executiva', 1399.90, 1699.90, 9, 1, 1, 1, 0),
(13, 'BT2041', 'LATAM Airlines', 'São Paulo (GRU)', 'Rio de Janeiro (GIG)', '2026-10-29', '08:15:00', '09:20:00', '1h05', 0, 'Econômica', 420.00, 560.00, 9, 1, 0, 0, 0),
(14, 'BT3172', 'GOL Linhas Aéreas', 'Florianópolis (FLN)', 'São Paulo (GRU)', '2026-10-31', '10:30:00', '11:45:00', '1h15', 0, 'Econômica', 389.90, 470.00, 9, 1, 0, 0, 0),
(15, 'BT4283', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Recife (REC)', '2026-11-03', '06:20:00', '09:25:00', '3h05', 0, 'Econômica', 780.00, 920.00, 9, 1, 0, 0, 0),
(16, 'BT5394', 'LATAM Airlines', 'Brasília (BSB)', 'Salvador (SSA)', '2026-11-05', '14:10:00', '16:05:00', '1h55', 0, 'Econômica', 510.00, 510.00, 9, 0, 0, 0, 0),
(17, 'BT6405', 'GOL Linhas Aéreas', 'Rio de Janeiro (GIG)', 'Buenos Aires (EZE)', '2026-11-07', '09:40:00', '13:00:00', '3h20', 0, 'Econômica', 1150.00, 1350.00, 9, 1, 0, 0, 0),
(18, 'BT7516', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Lisboa (LIS)', '2026-11-11', '18:30:00', '08:10:00', '10h40', 0, 'Econômica', 3490.00, 3890.00, 9, 1, 0, 0, 1),
(19, 'BT8627', 'LATAM Airlines', 'Curitiba (CWB)', 'Porto Alegre (POA)', '2026-11-13', '12:00:00', '13:15:00', '1h15', 0, 'Econômica', 360.00, 360.00, 9, 0, 0, 0, 1),
(20, 'BT9738', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Manaus (MAO)', '2026-11-16', '21:15:00', '00:25:00', '3h10', 0, 'Econômica', 890.00, 1050.00, 9, 1, 0, 0, 1),
(21, 'BT1001', 'LATAM Airlines', 'São Paulo (GRU)', 'Fernando de Noronha (FEN)', '2026-10-29', '08:00:00', '11:30:00', '3h30', 1, 'Econômica', 1899.90, 2199.90, 9, 1, 0, 0, 0),
(22, 'BT1002', 'TAP Air Portugal', 'São Paulo (GRU)', 'Santorini (JTR)', '2026-10-31', '18:20:00', '13:10:00', '17h50', 1, 'Econômica', 4899.90, 5399.90, 9, 1, 0, 0, 0),
(23, 'BT1003', 'Aeromexico', 'São Paulo (GRU)', 'Cancún (CUN)', '2026-11-02', '09:15:00', '17:40:00', '10h25', 1, 'Econômica', 3299.90, 3699.90, 9, 1, 0, 0, 0),
(24, 'BT1004', 'Qatar Airways', 'São Paulo (GRU)', 'Denpasar / Bali (DPS)', '2026-11-04', '01:10:00', '16:00:00', '26h50', 1, 'Econômica', 5899.90, NULL, 9, 0, 0, 0, 0),
(25, 'BT1005', 'Emirates', 'São Paulo (GRU)', 'Malé / Maldivas (MLE)', '2026-11-06', '01:25:00', '14:20:00', '23h55', 1, 'Econômica', 5599.90, 6199.90, 9, 1, 0, 0, 0),
(26, 'BT1006', 'Air France', 'São Paulo (GRU)', 'Paris (CDG)', '2026-11-08', '18:00:00', '10:30:00', '11h30', 0, 'Econômica', 4199.90, NULL, 9, 0, 0, 0, 0),
(27, 'BT1007', 'ITA Airways', 'São Paulo (GRU)', 'Roma (FCO)', '2026-11-10', '15:40:00', '08:20:00', '11h40', 0, 'Econômica', 3999.90, 4499.90, 9, 1, 0, 0, 1),
(28, 'BT1008', 'American Airlines', 'São Paulo (GRU)', 'Orlando (MCO)', '2026-11-12', '22:00:00', '06:10:00', '9h10', 0, 'Econômica', 2899.90, NULL, 9, 0, 0, 0, 1),
(29, 'BT1009', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Gramado (GRM)', '2026-11-14', '09:30:00', '11:20:00', '1h50', 0, 'Econômica', 699.90, 849.90, 9, 1, 0, 0, 1),
(30, 'BT1010', 'LATAM Airlines', 'São Paulo (GRU)', 'Foz do Iguaçu (IGU)', '2026-11-16', '10:00:00', '11:45:00', '1h45', 0, 'Econômica', 579.90, NULL, 9, 0, 0, 0, 1),
(31, 'BT1011', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Curitiba (CWB)', '2026-11-18', '07:20:00', '08:25:00', '1h05', 0, 'Econômica', 389.90, 459.90, 9, 1, 0, 0, 1),
(32, 'BT1012', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Salvador (SSA)', '2026-11-20', '08:30:00', '10:50:00', '2h20', 0, 'Econômica', 599.90, NULL, 9, 0, 0, 0, 1),
(33, 'BT1013', 'LATAM Airlines', 'São Paulo (GRU)', 'Rio de Janeiro (GIG)', '2026-11-22', '09:45:00', '10:50:00', '1h05', 0, 'Econômica', 349.90, 429.90, 9, 1, 0, 0, 1),
(34, 'BT1014', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Maceió (MCZ)', '2026-11-24', '12:10:00', '15:05:00', '2h55', 0, 'Econômica', 729.90, NULL, 9, 0, 0, 0, 1),
(35, 'BT1015', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Porto Seguro (BPS)', '2026-11-26', '10:15:00', '12:05:00', '1h50', 0, 'Econômica', 649.90, 799.90, 9, 1, 0, 0, 1),
(36, 'BT1016', 'Aerolíneas Argentinas', 'São Paulo (GRU)', 'Buenos Aires (EZE)', '2026-11-28', '14:30:00', '17:20:00', '2h50', 0, 'Econômica', 1199.90, NULL, 9, 0, 0, 0, 1),
(37, 'BT1017', 'TAP Air Portugal', 'São Paulo (GRU)', 'Lisboa (LIS)', '2026-11-30', '22:30:00', '11:00:00', '9h30', 0, 'Econômica', 3299.90, 3699.90, 9, 1, 0, 0, 1),
(38, 'BT2001', 'LATAM Airlines', 'São Paulo (GRU)', 'Maceió (MCZ)', '2026-11-10', '07:30:00', '10:20:00', '2h50', 0, 'Econômica', 649.90, 799.90, 9, 1, 1, 1, 1),
(39, 'BT2002', 'GOL Linhas Aéreas', 'Rio de Janeiro (GIG)', 'Salvador (SSA)', '2026-11-12', '09:15:00', '11:20:00', '2h05', 0, 'Econômica', 479.90, 599.90, 9, 1, 1, 0, 1),
(40, 'BT2003', 'Azul Linhas Aéreas', 'Campinas (VCP)', 'Fortaleza (FOR)', '2026-11-14', '06:40:00', '10:10:00', '3h30', 0, 'Econômica', 829.90, NULL, 9, 0, 1, 1, 1),
(41, 'BT2004', 'LATAM Airlines', 'Brasília (BSB)', 'Recife (REC)', '2026-11-16', '13:20:00', '15:55:00', '2h35', 0, 'Econômica', 579.90, 699.90, 9, 1, 0, 1, 1),
(42, 'BT2005', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Porto Alegre (POA)', '2026-11-18', '08:00:00', '09:45:00', '1h45', 0, 'Econômica', 399.90, 499.90, 9, 1, 1, 0, 1),
(43, 'BT2006', 'Azul Linhas Aéreas', 'Belo Horizonte (CNF)', 'Porto Seguro (BPS)', '2026-11-20', '11:10:00', '12:35:00', '1h25', 0, 'Econômica', 449.90, NULL, 9, 0, 0, 1, 1),
(44, 'BT2007', 'LATAM Airlines', 'São Paulo (GRU)', 'Santiago (SCL)', '2026-11-22', '10:30:00', '14:20:00', '3h50', 0, 'Econômica', 1199.90, 1499.90, 9, 1, 1, 1, 1),
(45, 'BT2008', 'TAP Air Portugal', 'São Paulo (GRU)', 'Porto (OPO)', '2026-11-24', '18:45:00', '09:15:00', '10h30', 0, 'Econômica', 3599.90, NULL, 9, 0, 0, 1, 1),
(46, 'BT2009', 'GOL Linhas Aéreas', 'Curitiba (CWB)', 'Rio de Janeiro (GIG)', '2026-11-26', '14:00:00', '15:30:00', '1h30', 0, 'Econômica', 369.90, 459.90, 9, 1, 1, 0, 1),
(47, 'BT2010', 'Azul Linhas Aéreas', 'Recife (REC)', 'Fernando de Noronha (FEN)', '2026-11-28', '08:20:00', '10:00:00', '1h40', 0, 'Econômica', 899.90, 1099.90, 9, 1, 0, 1, 1),
(48, 'BT3001', 'TAP Air Portugal', 'Porto Alegre (POA)', 'Londres (LON)', '2026-11-15', '18:00:00', '09:30:00', '11h30', 1, 'Econômica', 3890.50, NULL, 9, 0, 0, 0, 1),
(49, 'BT3002', 'Air France', 'Florianópolis (FLN)', 'Paris (CDG)', '2026-11-20', '16:00:00', '10:30:00', '14h30', 1, 'Econômica', 5420.90, NULL, 9, 0, 0, 0, 1),
(50, 'BT4001', 'LATAM Airlines', 'São Paulo (GRU)', 'Florianópolis (FLN)', '2026-11-17', '07:10:00', '08:20:00', '1h10', 0, 'Econômica', 329.90, 399.90, 9, 1, 0, 0, 1),
(51, 'BT4002', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Brasília (BSB)', '2026-11-17', '11:30:00', '13:15:00', '1h45', 0, 'Econômica', 449.90, NULL, 9, 0, 0, 0, 1),
(52, 'BT4003', 'Azul Linhas Aéreas', 'Campinas (VCP)', 'Recife (REC)', '2026-11-18', '06:25:00', '09:35:00', '3h10', 0, 'Econômica', 789.90, 899.90, 9, 1, 1, 0, 1),
(53, 'BT4004', 'LATAM Airlines', 'Rio de Janeiro (GIG)', 'São Paulo (GRU)', '2026-11-19', '15:10:00', '16:20:00', '1h10', 0, 'Econômica', 319.90, NULL, 9, 0, 0, 0, 1),
(54, 'BT4005', 'GOL Linhas Aéreas', 'Florianópolis (FLN)', 'Brasília (BSB)', '2026-11-20', '09:00:00', '11:05:00', '2h05', 0, 'Econômica', 629.90, 749.90, 9, 1, 0, 1, 1),
(55, 'BT4006', 'Azul Linhas Aéreas', 'Belo Horizonte (CNF)', 'Salvador (SSA)', '2026-11-21', '08:15:00', '10:05:00', '1h50', 0, 'Econômica', 489.90, NULL, 9, 0, 0, 0, 1),
(56, 'BT4007', 'LATAM Airlines', 'São Paulo (GRU)', 'Fortaleza (FOR)', '2026-11-22', '10:40:00', '14:10:00', '3h30', 0, 'Econômica', 899.90, 1049.90, 9, 1, 0, 0, 1),
(57, 'BT4008', 'GOL Linhas Aéreas', 'Brasília (BSB)', 'Rio de Janeiro (GIG)', '2026-11-23', '17:20:00', '19:05:00', '1h45', 0, 'Econômica', 539.90, NULL, 9, 0, 1, 0, 1),
(58, 'BT4009', 'Azul Linhas Aéreas', 'Campinas (VCP)', 'Porto Alegre (POA)', '2026-11-24', '07:50:00', '09:35:00', '1h45', 0, 'Econômica', 429.90, 519.90, 9, 1, 0, 1, 1),
(59, 'BT4010', 'LATAM Airlines', 'São Paulo (GRU)', 'Maceió (MCZ)', '2026-11-25', '12:30:00', '15:25:00', '2h55', 0, 'Econômica', 749.90, NULL, 9, 0, 0, 0, 1),
(60, 'BT4011', 'GOL Linhas Aéreas', 'Curitiba (CWB)', 'São Paulo (GRU)', '2026-11-26', '06:45:00', '07:50:00', '1h05', 0, 'Econômica', 299.90, 369.90, 9, 1, 0, 0, 1),
(61, 'BT4012', 'Azul Linhas Aéreas', 'Recife (REC)', 'Fernando de Noronha (FEN)', '2026-11-27', '09:20:00', '11:00:00', '1h40', 0, 'Econômica', 879.90, NULL, 9, 0, 1, 1, 1),
(62, 'BT4013', 'LATAM Airlines', 'São Paulo (GRU)', 'Buenos Aires (EZE)', '2026-11-28', '13:40:00', '16:30:00', '2h50', 0, 'Econômica', 1249.90, 1399.90, 9, 1, 0, 0, 1),
(63, 'BT4014', 'GOL Linhas Aéreas', 'Rio de Janeiro (GIG)', 'Salvador (SSA)', '2026-11-29', '10:00:00', '12:05:00', '2h05', 0, 'Econômica', 499.90, NULL, 9, 0, 1, 0, 1),
(64, 'BT4015', 'Azul Linhas Aéreas', 'Belo Horizonte (CNF)', 'Porto Seguro (BPS)', '2026-11-30', '08:35:00', '10:00:00', '1h25', 0, 'Econômica', 459.90, 549.90, 9, 1, 0, 1, 1),
(65, 'BT4016', 'LATAM Airlines', 'São Paulo (GRU)', 'Lisboa (LIS)', '2026-12-01', '22:15:00', '11:00:00', '9h45', 0, 'Econômica', 3399.90, NULL, 9, 0, 0, 0, 1),
(66, 'BT4017', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Manaus (MAO)', '2026-12-02', '20:40:00', '23:50:00', '3h10', 0, 'Econômica', 929.90, 1049.90, 9, 1, 0, 0, 1),
(67, 'BT4018', 'Azul Linhas Aéreas', 'Campinas (VCP)', 'Fortaleza (FOR)', '2026-12-03', '06:30:00', '10:00:00', '3h30', 0, 'Econômica', 819.90, NULL, 9, 0, 1, 1, 1),
(68, 'BT4019', 'LATAM Airlines', 'Brasília (BSB)', 'Recife (REC)', '2026-12-04', '14:00:00', '16:35:00', '2h35', 0, 'Econômica', 599.90, 699.90, 9, 1, 0, 1, 1),
(69, 'BT4020', 'GOL Linhas Aéreas', 'Florianópolis (FLN)', 'Buenos Aires (EZE)', '2026-12-05', '12:10:00', '15:20:00', '3h10', 1, 'Econômica', 1399.90, NULL, 9, 0, 0, 0, 1),
(70, 'BT4021', 'Azul Linhas Aéreas', 'São Paulo (GRU)', 'Cuiabá (CGB)', '2026-12-06', '09:25:00', '11:10:00', '1h45', 0, 'Econômica', 569.90, 649.90, 9, 1, 0, 0, 1),
(71, 'BT4022', 'LATAM Airlines', 'Rio de Janeiro (GIG)', 'Porto Alegre (POA)', '2026-12-07', '07:30:00', '09:35:00', '2h05', 0, 'Econômica', 519.90, NULL, 9, 0, 1, 0, 1),
(72, 'BT4023', 'GOL Linhas Aéreas', 'São Paulo (GRU)', 'Santiago (SCL)', '2026-12-08', '11:20:00', '15:10:00', '3h50', 0, 'Econômica', 1299.90, 1449.90, 9, 1, 0, 1, 1),
(73, 'BT4024', 'Azul Linhas Aéreas', 'Recife (REC)', 'Salvador (SSA)', '2026-12-09', '13:15:00', '14:40:00', '1h25', 0, 'Econômica', 389.90, NULL, 9, 0, 1, 0, 1),
(74, 'BT4025', 'LATAM Airlines', 'São Paulo (GRU)', 'Miami (MIA)', '2026-12-10', '23:10:00', '07:50:00', '8h40', 0, 'Econômica', 2999.90, 3299.90, 9, 1, 0, 0, 1),
(75, 'BT4026', 'GOL Linhas Aéreas', 'Curitiba (CWB)', 'Rio de Janeiro (GIG)', '2026-12-11', '16:20:00', '17:50:00', '1h30', 0, 'Econômica', 379.90, NULL, 9, 0, 1, 0, 1),
(76, 'BT4027', 'Azul Linhas Aéreas', 'Belo Horizonte (CNF)', 'Maceió (MCZ)', '2026-12-12', '10:05:00', '12:45:00', '2h40', 0, 'Econômica', 679.90, 789.90, 9, 1, 0, 1, 1),
(77, 'BT4028', 'LATAM Airlines', 'São Paulo (GRU)', 'Paris (CDG)', '2026-12-13', '18:35:00', '10:05:00', '11h30', 0, 'Econômica', 4299.90, NULL, 9, 0, 0, 0, 1),
(78, 'BT4029', 'GOL Linhas Aéreas', 'Brasília (BSB)', 'Manaus (MAO)', '2026-12-14', '08:50:00', '11:55:00', '3h05', 0, 'Econômica', 849.90, 969.90, 9, 1, 1, 0, 1),
(79, 'BT4030', 'Azul Linhas Aéreas', 'Campinas (VCP)', 'Florianópolis (FLN)', '2026-12-15', '17:40:00', '18:55:00', '1h15', 0, 'Econômica', 339.90, NULL, 9, 0, 0, 1, 1),
(80, 'BT4031', 'LATAM Airlines', 'São Paulo (GRU)', 'Orlando (MCO)', '2026-12-16', '21:30:00', '05:40:00', '9h10', 0, 'Econômica', 3099.90, 3399.90, 9, 1, 0, 0, 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aeroportos`
--
ALTER TABLE `aeroportos`
  ADD PRIMARY KEY (`id_aeroporto`),
  ADD UNIQUE KEY `codigo_iata` (`codigo_iata`);

--
-- Índices de tabela `atividades`
--
ALTER TABLE `atividades`
  ADD PRIMARY KEY (`id_atividade`);

--
-- Índices de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD UNIQUE KEY `unique_avaliacao` (`id_usuario`,`id_publicacao`),
  ADD KEY `idx_avaliacao_publicacao` (`id_publicacao`);

--
-- Índices de tabela `boatour_cupons`
--
ALTER TABLE `boatour_cupons`
  ADD PRIMARY KEY (`id_cupom`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD UNIQUE KEY `uq_cupom_item_ods` (`id_pagamento_origem`,`chave_item`,`ods`),
  ADD KEY `idx_cupons_usuario_status` (`id_usuario`,`status`);

--
-- Índices de tabela `boatour_pagamentos_simulados`
--
ALTER TABLE `boatour_pagamentos_simulados`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD KEY `idx_pagamentos_usuario_data` (`id_usuario`,`criado_em`);

--
-- Índices de tabela `boatour_saldo_movimentos`
--
ALTER TABLE `boatour_saldo_movimentos`
  ADD PRIMARY KEY (`id_movimento`),
  ADD UNIQUE KEY `referencia` (`referencia`),
  ADD KEY `idx_saldo_usuario_data` (`id_usuario`,`criado_em`);

--
-- Índices de tabela `boatour_viagens_simuladas`
--
ALTER TABLE `boatour_viagens_simuladas`
  ADD PRIMARY KEY (`id_viagem`),
  ADD UNIQUE KEY `uq_viagem_pagamento` (`id_pagamento`),
  ADD KEY `idx_viagens_usuario_data` (`id_usuario`,`criado_em`);

--
-- Índices de tabela `categorias_destino`
--
ALTER TABLE `categorias_destino`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `classes_voo`
--
ALTER TABLE `classes_voo`
  ADD PRIMARY KEY (`id_classe`);

--
-- Índices de tabela `companhias_aereas`
--
ALTER TABLE `companhias_aereas`
  ADD PRIMARY KEY (`id_companhia`);

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
-- Índices de tabela `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD UNIQUE KEY `favorito_unico` (`id_usuario`,`tipo`,`id_item`);

--
-- Índices de tabela `fotos_atividades`
--
ALTER TABLE `fotos_atividades`
  ADD PRIMARY KEY (`id_foto`),
  ADD KEY `idx_fotos_atividade` (`id_atividade`),
  ADD KEY `idx_fotos_status` (`status`);

--
-- Índices de tabela `fotos_hoteis`
--
ALTER TABLE `fotos_hoteis`
  ADD PRIMARY KEY (`id_foto`),
  ADD KEY `id_hotel` (`id_hotel`);

--
-- Índices de tabela `fotos_publicacoes`
--
ALTER TABLE `fotos_publicacoes`
  ADD PRIMARY KEY (`id_foto`),
  ADD UNIQUE KEY `uq_publicacao_ordem` (`id_publicacao`,`ordem`);

--
-- Índices de tabela `hoteis`
--
ALTER TABLE `hoteis`
  ADD PRIMARY KEY (`id_hotel`);

--
-- Índices de tabela `notificacoes`
--
ALTER TABLE `notificacoes`
  ADD PRIMARY KEY (`id_notificacao`),
  ADD UNIQUE KEY `uk_notificacoes_evento` (`id_usuario`,`chave_evento`),
  ADD KEY `idx_notificacoes_usuario_data` (`id_usuario`,`data_criacao`),
  ADD KEY `idx_notificacoes_nao_lidas` (`id_usuario`,`lida`),
  ADD KEY `idx_notificacoes_agendamento` (`status`,`data_agendamento`);

--
-- Índices de tabela `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ofertas_periodo` (`status`,`data_inicio`,`data_fim`),
  ADD KEY `idx_ofertas_pacote` (`id_pacote`),
  ADD KEY `idx_ofertas_produto` (`tipo_produto`,`id_produto`);

--
-- Índices de tabela `ofertas_antigas`
--
ALTER TABLE `ofertas_antigas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destino_id` (`destino_id`);

--
-- Índices de tabela `pacotes`
--
ALTER TABLE `pacotes`
  ADD PRIMARY KEY (`id_pacote`);

--
-- Índices de tabela `pacote_itens`
--
ALTER TABLE `pacote_itens`
  ADD PRIMARY KEY (`id_pacote_item`),
  ADD KEY `idx_pacote_itens_pacote` (`id_pacote`),
  ADD KEY `idx_pacote_itens_produto` (`tipo_item`,`id_item`);

--
-- Índices de tabela `publicacoes_viagens`
--
ALTER TABLE `publicacoes_viagens`
  ADD PRIMARY KEY (`id_publicacao`),
  ADD KEY `idx_publicacoes_usuario` (`id_usuario`),
  ADD KEY `idx_publicacoes_data` (`data_publicacao`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uk_usuarios_cpf` (`cpf`),
  ADD UNIQUE KEY `uk_usuarios_email` (`email`);

--
-- Índices de tabela `viagens`
--
ALTER TABLE `viagens`
  ADD PRIMARY KEY (`id_viagem`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_pagamento` (`id_pagamento`);

--
-- Índices de tabela `voos`
--
ALTER TABLE `voos`
  ADD PRIMARY KEY (`id_voo`),
  ADD KEY `idx_voos_ativo_data` (`ativo`,`data_saida`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aeroportos`
--
ALTER TABLE `aeroportos`
  MODIFY `id_aeroporto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de tabela `atividades`
--
ALTER TABLE `atividades`
  MODIFY `id_atividade` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `boatour_cupons`
--
ALTER TABLE `boatour_cupons`
  MODIFY `id_cupom` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `boatour_saldo_movimentos`
--
ALTER TABLE `boatour_saldo_movimentos`
  MODIFY `id_movimento` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `categorias_destino`
--
ALTER TABLE `categorias_destino`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `classes_voo`
--
ALTER TABLE `classes_voo`
  MODIFY `id_classe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `companhias_aereas`
--
ALTER TABLE `companhias_aereas`
  MODIFY `id_companhia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `destinos`
--
ALTER TABLE `destinos`
  MODIFY `id_destino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de tabela `fotos_atividades`
--
ALTER TABLE `fotos_atividades`
  MODIFY `id_foto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fotos_hoteis`
--
ALTER TABLE `fotos_hoteis`
  MODIFY `id_foto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `fotos_publicacoes`
--
ALTER TABLE `fotos_publicacoes`
  MODIFY `id_foto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `hoteis`
--
ALTER TABLE `hoteis`
  MODIFY `id_hotel` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `notificacoes`
--
ALTER TABLE `notificacoes`
  MODIFY `id_notificacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT de tabela `ofertas_antigas`
--
ALTER TABLE `ofertas_antigas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `pacotes`
--
ALTER TABLE `pacotes`
  MODIFY `id_pacote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `pacote_itens`
--
ALTER TABLE `pacote_itens`
  MODIFY `id_pacote_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `publicacoes_viagens`
--
ALTER TABLE `publicacoes_viagens`
  MODIFY `id_publicacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `voos`
--
ALTER TABLE `voos`
  MODIFY `id_voo` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD CONSTRAINT `fk_avaliacao_publicacao` FOREIGN KEY (`id_publicacao`) REFERENCES `publicacoes_viagens` (`id_publicacao`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `destino_categorias`
--
ALTER TABLE `destino_categorias`
  ADD CONSTRAINT `destino_categorias_ibfk_1` FOREIGN KEY (`id_destino`) REFERENCES `destinos` (`id_destino`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `destino_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_destino` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `fotos_atividades`
--
ALTER TABLE `fotos_atividades`
  ADD CONSTRAINT `fk_fotos_atividades` FOREIGN KEY (`id_atividade`) REFERENCES `atividades` (`id_atividade`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `fotos_hoteis`
--
ALTER TABLE `fotos_hoteis`
  ADD CONSTRAINT `fotos_hoteis_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hoteis` (`id_hotel`) ON DELETE CASCADE;

--
-- Restrições para tabelas `fotos_publicacoes`
--
ALTER TABLE `fotos_publicacoes`
  ADD CONSTRAINT `fk_fotos_publicacao` FOREIGN KEY (`id_publicacao`) REFERENCES `publicacoes_viagens` (`id_publicacao`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `notificacoes`
--
ALTER TABLE `notificacoes`
  ADD CONSTRAINT `fk_notificacoes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `ofertas`
--
ALTER TABLE `ofertas`
  ADD CONSTRAINT `fk_ofertas_pacote` FOREIGN KEY (`id_pacote`) REFERENCES `pacotes` (`id_pacote`) ON DELETE SET NULL;

--
-- Restrições para tabelas `ofertas_antigas`
--
ALTER TABLE `ofertas_antigas`
  ADD CONSTRAINT `ofertas_antigas_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id_destino`);

--
-- Restrições para tabelas `pacote_itens`
--
ALTER TABLE `pacote_itens`
  ADD CONSTRAINT `fk_pacote_itens_pacote` FOREIGN KEY (`id_pacote`) REFERENCES `pacotes` (`id_pacote`) ON DELETE CASCADE;

--
-- Restrições para tabelas `publicacoes_viagens`
--
ALTER TABLE `publicacoes_viagens`
  ADD CONSTRAINT `fk_publicacoes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
