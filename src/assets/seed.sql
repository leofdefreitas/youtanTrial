CREATE TABLE IF NOT EXISTS realtyTypes (  id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                    realtyType TEXT);

INSERT or IGNORE INTO realtyTypes (id, realtyType) VALUES (1, 'Privado');
INSERT or IGNORE INTO realtyTypes (id, realtyType) VALUES (2, 'Público');
INSERT or IGNORE INTO realtyTypes (id, realtyType) VALUES (3, 'Desapropriado');

CREATE TABLE IF NOT EXISTS addresses (    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                    address TEXT, 
                                    date TEXT, 
                                    activityField TEXT, 
                                    class TEXT, 
                                    description TEXT, 
                                    startingDate TEXT, 
                                    endingDate TEXT, 
                                    realtyType INTEGER REFERENCES realtyTypes(id) ON UPDATE CASCADE);

INSERT or IGNORE INTO addresses (id, address, date, activityField, class, description, startingDate, endingDate, realtyType) VALUES (1, 'Rua São Bento, 4 - Casa', '01/01/2020', 'Alimentação', 'Classe', 'Curta Descrição', '01/01/2020', '01/04/2020', 1);
INSERT or IGNORE INTO addresses (id, address, date, activityField, class, description, startingDate, endingDate, realtyType) VALUES (2, 'Rua São Bento, 5 - Casa', '01/01/2020', 'Alimentação', 'Classe', 'Curta Descrição', '01/01/2020', '01/04/2020', 1);
INSERT or IGNORE INTO addresses (id, address, date, activityField, class, description, startingDate, endingDate, realtyType) VALUES (3, 'Rua São Bento, 6 - Prédio', '01/01/2020', 'Poupa Tempo', 'Classe', 'Curta Descrição', '01/01/2020', '01/04/2020', 2);
INSERT or IGNORE INTO addresses (id, address, date, activityField, class, description, startingDate, endingDate, realtyType) VALUES (4, 'Rua São Bento, 7 - Sobrado', '01/01/2020', 'Abandonado', 'Classe', 'Curta Descrição', '01/01/2020', '01/04/2020', 3);
