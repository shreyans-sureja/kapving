const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// citation : https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4
function sqliteConnect() {
    const dbPath = './database.db'

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Failed to connect to SQLite database:', err.message);
            // Exit process if DB connection fails
            process.exit(1);
        } else {
            console.log('Connected to SQLite database at:', dbPath);
        }
    });

    return db;
}

module.exports = sqliteConnect;
