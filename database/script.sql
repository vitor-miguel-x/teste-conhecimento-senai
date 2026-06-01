DROP DATABASE db_teste_de_conhecimento;

CREATE DATABASE db_teste_de_conhecimento;

USE db_teste_de_conhecimento;

CREATE TABLE tbl_produto (
	id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    peso DOUBLE NOT NULL,
    porcao DOUBLE NOT NULL,
    unidade_medida VARCHAR(4) NOT NULL,
    validade DATE NOT NULL,
    is_valid BOOLEAN
);

CREATE TABLE tbl_funcionario (
	id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_venda (
	id_venda INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT,
    id_produto INT,
    quantidade INT,
    FOREIGN KEY (id_funcionario) REFERENCES tbl_funcionario (id_funcionario),
    FOREIGN KEY (id_produto) REFERENCES tbl_produto (id_produto)
);

CREATE TABLE tbl_descarte (
	id_descarte INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT,
    id_produto INT,
    quantidade INT,
    data_descarte DATE,
    FOREIGN KEY (id_funcionario) REFERENCES tbl_funcionario (id_funcionario),
    FOREIGN KEY (id_produto) REFERENCES tbl_produto (id_produto)
);

INSERT INTO tbl_funcionario (nome, email, senha) VALUES  
("Eduardo Fonseca", "eduardo12@gmail.com", "edua2@123"),
("Renan Meireles", "renan25@gmail.com", "renan78@123"),
("João Paulo", "joao92@gmail.com", "joao78@123");

INSERT INTO tbl_produto (nome, peso, porcao, unidade_medida, validade, is_valid) VALUES  
("Bolo de Fuba", 120, 20, "g", "2027-02-08", true),
("Cupcake de morango", 20, 20, "g", "2026-07-08", true),
("Torta de limão", 1000, 100, "g", "2026-02-08", false);

INSERT INTO tbl_venda (id_funcionario, id_produto, quantidade) VALUES
(1, 2, 5),  
(2, 1, 10),
(3, 3, 2);  

INSERT INTO tbl_descarte (id_funcionario, id_produto, quantidade, data_descarte) VALUES
(2, 1, 5, curdate()),
(3, 3, 1, curdate());  

DELIMITER $$ 
CREATE TRIGGER trg_validar_produto_insert
BEFORE INSERT ON tbl_produto
FOR EACH ROW
BEGIN
    IF NEW.validade < CURDATE() THEN
        SET NEW.is_valid = FALSE;
    ELSE
        SET NEW.is_valid = TRUE;
    END IF;
END$$

CREATE TRIGGER trg_validar_produto_update
BEFORE UPDATE ON tbl_produto
FOR EACH ROW
BEGIN
    IF NEW.validade < CURDATE() THEN
        SET NEW.is_valid = FALSE;
    ELSE
        SET NEW.is_valid = TRUE;
    END IF;
END$$

DELIMITER ;

SET GLOBAL event_scheduler = ON;

DELIMITER $$
CREATE EVENT ev_verificar_validade_diaria
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    UPDATE tbl_produto 
    SET is_valid = FALSE 
    WHERE validade < CURDATE() AND is_valid = TRUE;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE getVendasByIdFuncionario( IN f_id INT) 
	BEGIN
    DECLARE funcionario_existe INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
    
	select tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_venda.quantidade
		from tbl_venda
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_venda.id_produto
			where tbl_funcionario.id_funcionario = f_id;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getVendasById( IN v_id INT) 
	BEGIN
    DECLARE funcionario_existe INT;
    
	select tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_venda.quantidade, tbl_venda.id_venda
		from tbl_venda
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_venda.id_produto
			where tbl_venda.id_venda = v_id;

END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getVendas() 
	BEGIN
	select tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_venda.quantidade
		from tbl_venda
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_venda.id_produto
			ORDER BY tbl_venda.id_venda DESC;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLastVendaByFuncionario(IN f_id INT) 
	BEGIN
    DECLARE funcionario_existe INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
    
	select tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_venda.quantidade
		from tbl_venda
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_venda.id_produto
			where tbl_funcionario.id_funcionario = f_id order by tbl_venda.id_venda 
            desc limit 1;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE getLastVenda() 
	BEGIN
	select tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_venda.quantidade
		from tbl_venda
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_venda.id_produto
			order by tbl_venda.id_venda 
            desc limit 1;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE createVenda (
		IN f_id INT,
        IN p_nome VARCHAR(100), 
        IN p_peso DOUBLE, 
        IN p_porcao DOUBLE, 
        IN p_unidade_medida VARCHAR(4),
        IN p_validade DATE, 
        IN p_quantidade INT)
BEGIN
 DECLARE funcionario_existe INT;
 DECLARE p_id INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
		IF p_nome IS NOT NULL AND p_nome != '' AND
			p_peso IS NOT NULL AND p_peso > 0 AND
			p_porcao IS NOT NULL AND p_porcao < p_peso AND
			p_unidade_medida IS NOT NULL AND p_unidade_medida != '' AND 
			p_validade IS NOT NULL AND 
			p_quantidade IS NOT NULL AND p_quantidade > 0 THEN
				INSERT INTO tbl_produto (nome, peso, porcao, unidade_medida, validade) 
				VALUES (p_nome, p_peso, p_porcao, p_unidade_medida, p_validade);
                SET p_id = LAST_INSERT_ID();
                
                INSERT INTO tbl_venda (id_funcionario, id_produto, quantidade) VALUES (f_id, p_id, p_quantidade);
                
                CALL getLastVendaByFuncionario(f_id); 
			ELSE 
				SELECT CONCAT('Dados inválidos!!!') 
				AS mensagem;
			END IF;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS updateVenda;

DELIMITER $$
CREATE PROCEDURE updateVenda (
		IN f_id INT,
        IN v_id INT, 
        IN p_nome VARCHAR(100), 
        IN p_peso DOUBLE, 
        IN p_porcao DOUBLE, 
        IN p_unidade_medida VARCHAR(4),
        IN p_validade DATE, 
        IN p_quantidade INT)
BEGIN
 DECLARE funcionario_existe INT;
 DECLARE venda_existe INT;
 DECLARE var_id_produto INT;
 
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    SELECT COUNT(id_venda) INTO venda_existe FROM tbl_venda WHERE id_venda = v_id AND id_funcionario = f_id;
    
    IF funcionario_existe > 0 AND venda_existe > 0 THEN 
    
		SELECT id_produto INTO var_id_produto FROM tbl_venda WHERE id_venda = v_id LIMIT 1;
        
		IF p_nome IS NOT NULL AND p_nome != '' AND
			p_peso IS NOT NULL AND p_peso > 0 AND
			p_porcao IS NOT NULL AND p_porcao < p_peso AND
			p_unidade_medida IS NOT NULL AND p_unidade_medida != '' AND 
			p_validade IS NOT NULL AND 
			p_quantidade IS NOT NULL AND p_quantidade > 0 THEN
            
				UPDATE tbl_produto SET nome = p_nome, peso = p_peso, porcao = p_porcao, unidade_medida = p_unidade_medida, validade = p_validade
                WHERE id_produto = var_id_produto;
                
                UPDATE tbl_venda SET quantidade = p_quantidade 
                WHERE id_venda = v_id AND id_funcionario = f_id;
                
                SELECT tbl_venda.id_venda, tbl_funcionario.id_funcionario, tbl_funcionario.nome AS nome_funcionario,
					tbl_produto.id_produto, tbl_produto.nome AS nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
					DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') AS validade, tbl_produto.is_valid, tbl_venda.quantidade
				FROM tbl_venda
					INNER JOIN tbl_funcionario ON tbl_funcionario.id_funcionario = tbl_venda.id_funcionario
				    INNER JOIN tbl_produto ON tbl_produto.id_produto = tbl_venda.id_produto
				WHERE tbl_venda.id_venda = v_id;
			ELSE 
				SELECT 'Dados inválidos!!!' AS mensagem;
			END IF;
	ELSE
		SELECT CONCAT('Erro: O funcionario ', f_id, ' ou a venda ', v_id, ' não existem ou não correspondem!') AS mensagem;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE deleteVendaByNomeFuncionario (IN f_nome VARCHAR(100), IN p_id INT) 
BEGIN
	DELETE v FROM tbl_venda v
	INNER JOIN tbl_funcionario f ON v.id_funcionario = f.id_funcionario
	WHERE TRIM(LOWER(f.nome)) = TRIM(LOWER(f_nome)) 
		AND v.id_produto = p_id;

    IF ROW_COUNT() > 0 THEN
        SELECT 'Venda deletada com sucesso!' AS mensagem;
    ELSE
        SELECT 'Erro: Nenhuma venda encontrada para esse funcionário e produto.' AS mensagem;
    END IF;
    
END $$
DELIMITER ;

CALL getVendas();
CALL getVendasByIdFuncionario(1);
CALL updateVenda(2, 4, 'Bolo l54354', 100, 20, 'g', '2060-02-03', 20);
CALL createVenda(2, 'Bolo l54354', 100, 20, 'g', '2060-02-03', 20);
CALL deleteVendaByNomeFuncionario("Renan Meireles", 4);
CALL getVendasById(2);


DELIMITER $$
CREATE PROCEDURE getDescartesByIdFuncionario( IN f_id INT) 
	BEGIN
    DECLARE funcionario_existe INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
    
	select tbl_descarte.id_descarte, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_descarte.quantidade, DATE_FORMAT(tbl_descarte.data_descarte , '%d/%m/%Y') as data_descarte
		from tbl_descarte
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_descarte.id_produto
			where tbl_funcionario.id_funcionario = f_id;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getDescartesById( IN d_id INT) 
	BEGIN
    
	select tbl_descarte.id_descarte,tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_descarte.quantidade, DATE_FORMAT(tbl_descarte.data_descarte , '%d/%m/%Y') as data_descarte
		from tbl_descarte
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_descarte.id_produto
			where tbl_descarte.id_descarte = d_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getProdutosDescartados() 
	BEGIN
	select tbl_descarte.id_descarte, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_descarte.quantidade, DATE_FORMAT(tbl_descarte.data_descarte , '%d/%m/%Y') as data_descarte
		from tbl_descarte
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_descarte.id_produto
			ORDER BY tbl_descarte.id_descarte DESC;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLastDescarteByFuncionario(IN f_id INT) 
	BEGIN
    DECLARE funcionario_existe INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
    
	select tbl_descarte.id_descarte, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_descarte.quantidade, DATE_FORMAT(tbl_descarte.data_descarte , '%d/%m/%Y') as data_descarte
		from tbl_descarte
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_descarte.id_produto
			where tbl_funcionario.id_funcionario = f_id order by tbl_descarte.id_descarte
            desc limit 1;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLastDescarte() 
	BEGIN
	select tbl_descarte.id_descarte, tbl_descarte.id_descarte, tbl_funcionario.id_funcionario, tbl_funcionario.nome as nome_funcionario,
	tbl_produto.id_produto, tbl_produto.nome as nome_produto, tbl_produto.peso, tbl_produto.porcao, tbl_produto.unidade_medida, 
	DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') as validade, tbl_produto.is_valid, tbl_descarte.quantidade, DATE_FORMAT(tbl_descarte.data_descarte , '%d/%m/%Y') as data_descarte
		from tbl_descarte
				inner join tbl_funcionario
				on tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
			inner join tbl_produto
				on tbl_produto.id_produto = tbl_descarte.id_produto order by tbl_descarte.id_descarte
            desc limit 1;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE createDescarte (
		IN f_id INT,
        IN p_nome VARCHAR(100), 
        IN p_peso DOUBLE, 
        IN p_porcao DOUBLE, 
        IN p_unidade_medida VARCHAR(4),
        IN p_validade DATE, 
        IN d_quantidade INT,
        IN d_data_descarte DATE)
BEGIN
 DECLARE funcionario_existe INT;
 DECLARE p_id INT;
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    IF funcionario_existe > 0 THEN 
		IF p_nome IS NOT NULL AND p_nome != '' AND
			p_peso IS NOT NULL AND p_peso > 0 AND
			p_porcao IS NOT NULL AND p_porcao < p_peso AND
			p_unidade_medida IS NOT NULL AND p_unidade_medida != '' AND 
			p_validade IS NOT NULL AND 
			d_quantidade IS NOT NULL AND d_quantidade > 0 AND
            d_data_descarte IS NOT NULL THEN
				INSERT INTO tbl_produto (nome, peso, porcao, unidade_medida, validade) 
				VALUES (p_nome, p_peso, p_porcao, p_unidade_medida, p_validade);
                SET p_id = LAST_INSERT_ID();
                
                INSERT INTO tbl_descarte (id_funcionario, id_produto, quantidade, data_descarte) VALUES (f_id, p_id, d_quantidade, d_data_descarte);
                
                CALL getLastDescarteByFuncionario(f_id); 
			ELSE 
				SELECT CONCAT('Dados inválidos!!!') 
				AS mensagem;
			END IF;
	ELSE
		SELECT CONCAT('O funcionario ', f_id, ' não existe!') 
			AS mensagem;
	END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS updateDescarte;

DELIMITER $$
CREATE PROCEDURE updateDescarte (
		IN f_id INT,
        IN d_id INT, 
        IN p_nome VARCHAR(100), 
        IN p_peso DOUBLE, 
        IN p_porcao DOUBLE, 
        IN p_unidade_medida VARCHAR(4),
        IN p_validade DATE, 
        IN d_quantidade INT,
        IN d_data_descarte DATE
        )
BEGIN
 DECLARE funcionario_existe INT;
 DECLARE descarte_existe INT;
 DECLARE var_id_produto INT;
 
    SELECT COUNT(id_funcionario) INTO funcionario_existe FROM tbl_funcionario WHERE id_funcionario = f_id;
    SELECT COUNT(id_descarte) INTO descarte_existe FROM tbl_descarte WHERE id_descarte = d_id AND id_funcionario = f_id;
    
    IF funcionario_existe > 0 AND descarte_existe > 0 THEN 
    
		SELECT id_produto INTO var_id_produto FROM tbl_descarte WHERE id_descarte = d_id LIMIT 1;
    
		IF p_nome IS NOT NULL AND p_nome != '' AND
			p_peso IS NOT NULL AND p_peso > 0 AND
			p_porcao IS NOT NULL AND p_porcao < p_peso AND
			p_unidade_medida IS NOT NULL AND p_unidade_medida != '' AND 
			p_validade IS NOT NULL AND 
			d_quantidade IS NOT NULL AND d_quantidade > 0 AND
            d_data_descarte IS NOT NULL THEN
            
				UPDATE tbl_produto SET nome = p_nome, peso = p_peso, porcao = p_porcao, 
					unidade_medida = p_unidade_medida, validade = p_validade
				WHERE id_produto = var_id_produto;
                
				UPDATE tbl_descarte SET quantidade = d_quantidade, data_descarte = d_data_descarte 
				WHERE id_descarte = d_id AND id_funcionario = f_id;
                
				SELECT tbl_descarte.id_descarte, tbl_funcionario.id_funcionario, tbl_funcionario.nome AS nome_funcionario,
					tbl_produto.id_produto, tbl_produto.nome AS nome_produto, tbl_produto.peso, 
					tbl_produto.porcao, tbl_produto.unidade_medida, 
					DATE_FORMAT(tbl_produto.validade, '%d/%m/%Y') AS validade, 
					tbl_produto.is_valid, tbl_descarte.quantidade, tbl_descarte.data_descarte
				FROM tbl_descarte
					INNER JOIN tbl_funcionario ON tbl_funcionario.id_funcionario = tbl_descarte.id_funcionario
					INNER JOIN tbl_produto ON tbl_produto.id_produto = tbl_descarte.id_produto
				WHERE tbl_descarte.id_descarte = d_id;
			ELSE 
				SELECT 'Dados inválidos!!!' AS mensagem;
			END IF;
	ELSE
		SELECT CONCAT('Erro: O funcionario ', f_id, ' ou o descarte ', d_id, ' não existem ou não correspondem!') AS mensagem;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE deleteDescarteByNomeFuncionario (IN f_nome VARCHAR(100), IN p_id INT) 
BEGIN
	DELETE d FROM tbl_descarte d
	INNER JOIN tbl_funcionario f ON d.id_funcionario = f.id_funcionario
	WHERE TRIM(LOWER(f.nome)) = TRIM(LOWER(f_nome)) 
		AND d.id_produto = p_id;

    IF ROW_COUNT() > 0 THEN
        SELECT 'Descarte deletado com sucesso!' AS mensagem;
    ELSE
        SELECT 'Erro: Nenhum descarte encontrada para esse funcionário e produto.' AS mensagem;
    END IF;
    
END $$
DELIMITER ;


CALL getProdutosDescartados();
CALL getDescartesByIdFuncionario(2);
CALL updateDescarte(2, 1, 'Bolo De Cenoura', 100, 20, 'g', '2022-02-03', 20, '2023-02-03');
CALL createDescarte(2, 'Bolo De Chocolate', 100, 20, 'g', '2024-02-03', 20, '2026-02-03');
CALL deleteDescarteByNomeFuncionario("Renan Meireles", 6);

