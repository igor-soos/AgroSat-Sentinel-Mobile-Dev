import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const migrationsPath = path.join(__dirname, 'migrations');

export let db: sqlite3.Database;

const run = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const exec = (sql: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // Enable foreign keys
        await exec('PRAGMA foreign_keys = ON');

        // Run migrations
        const migrationFiles = fs
          .readdirSync(migrationsPath)
          .filter((file) => file.endsWith('.sql'))
          .sort();

        for (const file of migrationFiles) {
          const migrationPath = path.join(migrationsPath, file);
          const sql = fs.readFileSync(migrationPath, 'utf-8');
          console.log(`🔄 Running migration: ${file}`);
          await exec(sql);
        }

        console.log('✅ Database migrations completed');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getDb = (): sqlite3.Database => {
  return db;
};

export const query = <T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const queryOne = <T = any>(
  sql: string,
  params: any[] = []
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
};

export const execute = (
  sql: string,
  params: any[] = []
): Promise<{ id: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else
        resolve({
          id: this.lastID,
          changes: this.changes,
        });
    });
  });
};