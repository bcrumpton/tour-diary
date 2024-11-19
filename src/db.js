import Database from 'better-sqlite3'

const db = new Database('tourdiary.db');

const query = `
  CREATE TABLE shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING NOT NULL, 
    date STRING NOT NULL, 
    location STRING NOT NULL, 
    venue STRING NOT NULL, 
    artists STRING NOT NULL
  );
`;

db.exec(query);