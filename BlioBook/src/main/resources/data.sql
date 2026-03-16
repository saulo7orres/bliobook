
INSERT INTO CATEGORIA (nome) VALUES ('Estratégia');
INSERT INTO CATEGORIA (nome) VALUES ('Aventura');
INSERT INTO CATEGORIA (nome) VALUES ('Ficção');
INSERT INTO CATEGORIA (nome) VALUES ('Regionalismo');
INSERT INTO CATEGORIA (nome) VALUES ('Realismo');
INSERT INTO CATEGORIA (nome) VALUES ('Romance');

INSERT INTO AUTOR (nome) VALUES ('Sun Tzu');
INSERT INTO AUTOR (nome) VALUES ('Miguel de Cervantes');
INSERT INTO AUTOR (nome) VALUES ('John Bunyan');
INSERT INTO AUTOR (nome) VALUES ('Graciliano Ramos');
INSERT INTO AUTOR (nome) VALUES ('Machado de Assis');


INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('A Arte da Guerra', 1, 'Disponível');
INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('Dom Quixote', 2, 'Disponível');
INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('O Peregrino', 3, 'Disponível');
INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('Vidas Secas', 4, 'Não Disponível');
INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('Memórias Póstumas de Brás Cubas', 5, 'Disponível');
INSERT INTO LIVRO (titulo, categoria_id, situacao) VALUES ('Dom Casmurro', 6, 'Emprestado');

INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (1, 1); -- Estratégia -> A Arte da Guerra (Disponível)-> Sun Tzu
INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (2, 2); -- Aventura -> Dom Quixote (Disponível) -> Cervantes
INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (3, 3); -- Ficção -> O Peregrino (Disponível)-> John Bunyan
INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (4, 4); -- Regionalismo -> Vidas Secas (Não Disponível)-> Graciliano Ramos
INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (5, 5); -- Realismo -> Memórias Póstumas de Brás Cubas (Disponível)-> (1 Livro) Machado de Assis
INSERT INTO LIVRO_AUTORES (livros_id, autores_id) VALUES (6, 5); -- Romance -> Dom Casmurro (Emprestado))-> (2 Livro) Machado de Assis

-- SELECT * FROM AUTOR ;
-- SELECT * FROM CATEGORIA ; 
-- SELECT * FROM LIVRO ;
-- SELECT * FROM LIVRO_AUTORES ;

-- Matar o Server em Background

-- netstat -ano | findstr :8080

-- taskkill /F /PID 1234