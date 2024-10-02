import sqlite3 from 'sqlite3';
import path from 'path';

// Configuração do banco de dados
const dbPath = path.join(__dirname, '../database/database.sqlite');
let db: sqlite3.Database;

const connectToDatabase = () => {
    console.log('Conectando ao banco de dados...');

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
            // Chamar a função para criar tabelas
            createTables();
        }
    });
    return db;
};

const createTables = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela produtos:', err.message);
            } else {
                console.log('Tabela produtos criada ou já existe.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS comanda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente TEXT NOT NULL,
            produtos TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela comanda:', err.message);
            } else {
                console.log('Tabela comanda criada ou já existe.');
            }
        });
        
    });
};

const disconnectFromDatabase = () => {
    if (db) {
        console.log('Desconectando do banco de dados...');
        db.close((err) => {
            if (err) {
                console.error('Erro ao desconectar:', err.message);
            } else {
                console.log('Desconectado do banco de dados SQLite.');
            }
        });
    }
};

export { connectToDatabase, disconnectFromDatabase };
