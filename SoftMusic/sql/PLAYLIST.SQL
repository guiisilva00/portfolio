USE db_2td;

CREATE TABLE IF NOT EXISTS musica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    album VARCHAR(100),
    ano YEAR
);

DROP TABLE IF EXISTS musica;

INSERT INTO musica (titulo, artista, categoria, album, ano) VALUES 
('Flow Espacial', 'Teto, WIU, Matuê', 'Trap', '30PRAUM', 2023),
('Vampiro', 'Matuê, Teto, WIU', 'Trap', '30PRAUM', 2022),
('Conexões de Máfia', 'Matuê (feat. Rich the Kid)', 'Trap', 'Single', 2023),
('M4', 'Teto (feat. Matuê)', 'Trap', 'Previas.zip', 2021);

DESC musica;

SELECT * FROM musica;