SELECT current_user();
SHOW DATABASES;
USE db_teste;

CREATE TABLE IF NOT EXISTS figurinhas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	categoria VARCHAR(100) NOT NULL,
	descricao VARCHAR(255) DEFAULT 'Sem detalhes adicionais',
	status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
	quantidade INT NOT NULL DEFAULT 0,
	data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	foto VARCHAR(100) NOT NULL DEFAULT 'sem-foto.jpg'
);

DROP TABLE IF EXISTS figurinhas;

DESC figurinhas;

INSERT INTO figurinhas (nome, categoria, descricao, status, quantidade, data_cadastro) VALUES
('Neymar', 'Futebol', 'Figurinha do neymar que não foi convocado ainda', 'Disponível', 15, '2026-05-06');

SELECT * FROM figurinhas;