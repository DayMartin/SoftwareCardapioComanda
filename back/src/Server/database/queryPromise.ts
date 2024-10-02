import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database/database.sqlite');

const queryDatabase = <T>(query: string, params: any[] = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
        });

        db.all(query, params, (err, rows: T[]) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });

        db.close();
    });
};

const runDatabase = (query: string, params: any[] = []): Promise<{ changes: number }> => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
        });

        db.run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });

        db.close();
    });
};

export { queryDatabase, runDatabase };
