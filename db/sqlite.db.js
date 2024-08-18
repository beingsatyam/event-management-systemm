const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./event.db";

function createDbConnection() {
  if (fs.existsSync(filepath)) {
    console.log("db exists")
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    //   createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}


const userTableQuery = `CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT 0 
);`

const eventQuery = `CREATE TABLE Events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location TEXT,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);`

const registrationsQuery = `CREATE TABLE Registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    UNIQUE(user_id, event_id)
);
`

// const db  = createDbConnection();
// db.exec(`${userTableQuery}`);
// db.exec(`${eventQuery}`);
// db.exec(`${registrationsQuery}`);



module.exports = createDbConnection();