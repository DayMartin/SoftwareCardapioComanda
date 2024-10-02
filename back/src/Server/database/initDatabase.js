import sqlite3 from 'sqlite3';
import path from 'path';

// Conecte-se ao banco de dados
const dbPath = path.join(__dirname, '../database/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Criar tabela de produtos
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL
    )`);
});

// Fechar a conexão
db.close();
