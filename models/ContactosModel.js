const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

class ContactosModel {
  constructor() {

    this.db = new sqlite3.Database("./conf/data.db", (err) => {
      if (err) {
        console.error(err.message);
        return
      }
      console.log("Conectado a la base de datos SQLite.");
    });

    this.db.serialize(()=>{
     
       this.db.run(`
    CREATE TABLE IF NOT EXISTS contacto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      comentario TEXT NOT NULL,
      ip TEXT NOT NULL,
      pais TEXT NOT NULL,
      created_at DATETIME 
    ) 
  `);

    this.db.run(` CREATE TRIGGER IF NOT EXISTS insert_fecha_hora
    AFTER INSERT ON contacto
    FOR EACH ROW
    BEGIN
        UPDATE contacto SET created_at = datetime('now') WHERE id = NEW.id;
    END;`);
    })

 
  }

  crearContacto(email, nombre, mensaje,ip, pais) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO contacto (nombre, email, comentario, ip,pais) VALUES (?, ?, ?, ?, ?)`;
      this.db.run(sql, [nombre,email,mensaje, ip,pais], function (err) {
        if (err){
          console.error(err.message);
          reject(err);
        }
        resolve(true);
      });
    });
  }

  async obtenerContacto(email) {
    const sql = `SELECT * FROM contacto WHERE email = ?`;
    const get = promisify(this.db.get).bind(this.db);
    return await get(sql, [email]);
  }

  async obtenerAllContactos() {
    const sql = `SELECT * FROM contacto`;
    const all = promisify(this.db.all).bind(this.db);
    return await all(sql);
  }
}

module.exports = ContactosModel;
