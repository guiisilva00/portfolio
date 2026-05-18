CREATE TABLE IF NOT EXISTS alunos(
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome_aluno VARCHAR(100) NOT NULL,
    data_nasc DATE NULL
) AUTO_INCREMENT = 1000;

CREATE TABLE IF NOT EXISTS disciplinas(
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nome_disciplina VARCHAR(100) NOT NULL UNIQUE,
    carga_horaria INT NOT NULL
);

CREATE TABLE IF NOT EXISTS contato(
    id_contato INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    telefone VARCHAR(50) NOT NULL UNIQUE,
    id_aluno INT NOT NULL, 
    FOREIGN KEY(id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matriculas (
    id_aluno INT NOT NULL,
    id_disciplina INT NOT NULL,
    PRIMARY KEY (id_aluno, id_disciplina),
    FOREIGN KEY (id_aluno) REFERENCES alunos (id_aluno) ON DELETE CASCADE,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas (id_disciplina) ON DELETE CASCADE
);

INSERT INTO alunos VALUES (default, 'tux', '2026-05-11');
INSERT INTO alunos VALUES (default, 'debian', '2009-05-14');

INSERT INTO disciplinas VALUES (default, 'Sist. Operacionais', 120); 
INSERT INTO disciplinas VALUES (default, 'Banco de dados', 100);     
INSERT INTO disciplinas VALUES (default, 'Prog. Back-end', 100);     
INSERT INTO disciplinas VALUES (default, 'Levant. requisitos', 100); 
INSERT INTO disciplinas VALUES (default, 'Linguagem de Marcação', 150);

INSERT INTO contato (email, telefone, id_aluno) VALUES
('tux@email.com', '+55 (11) 91945-3909', 1000);

INSERT INTO contato (email, telefone, id_aluno) VALUES
('tux2@email.com', '+55 (11) 91945-9999', 1000);

INSERT INTO matriculas (id_aluno, id_disciplina) VALUES (1000, 1);
INSERT INTO matriculas (id_aluno, id_disciplina) VALUES (1001, 2);
INSERT INTO matriculas (id_aluno, id_disciplina) VALUES (1001, 5);

SELECT * FROM alunos;
SELECT * FROM contato;
SELECT * FROM disciplinas;
SELECT * FROM matriculas;


SELECT a.nome_aluno, c.email, c.telefone
FROM alunos as a
INNER JOIN contato as c
ON a.id_aluno = c.id_aluno;

SELECT 
    a.nome_aluno, 
    d.nome_disciplina, 
    d.carga_horaria
FROM matriculas as m
INNER JOIN alunos as a ON m.id_aluno = a.id_aluno
INNER JOIN disciplinas as d ON m.id_disciplina = d.id_disciplina
WHERE d.carga_horaria <= 100;


-- DROP TABLE matriculas, contato, alunos, disciplinas;