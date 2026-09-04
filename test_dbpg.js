const { Pool, Client} = require('pg');
require("dotenv").config();
const gestor = require('./helpers/gestorArchivos');
const pool = require('./dbpg.js');

async function conectarDBPG() {
  try {
    await pool.connect();
    console.log('✅ Conectado a PostgreSQL');

    const resultado = await pool.query('SELECT NOW()');
    //return console.log('📅 Fecha y hora del servidor:', resultado.rows[0]);
    return resultado.rows[0].now; 
} catch (err) {
    //return console.error('❌ Error de conexión o consulta:', err.message);
    throw err; 
}
}

async function obtenerUsuarios() {
  try {
    await pool.connect();
    console.log('✅ Conectado a PostgreSQL');

    const resultado = await pool.query('SELECT * FROM usuarios');
    console.log('👥 Usuarios:', resultado.rows);
    return resultado.rows;
} catch (err) {
    //return console.error('❌ Error de conexión o consulta:', err.message);
    throw err; 
}
}

function insertaUsuarios(nombre, email, password) {
  pool.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', 
  [nombre, email, password],
  (err, res) => {
    if (err) {
      console.error('❌ Error al insertar:', err.message);
    } else {
      return console.log(' Usuario insertado con éxito' + nombre);
    }
  }
  );
}


//insertaUsuarios("daniel", "daniel@email.com", "pass1234");
//insertaUsuarios("Jhon", "jhon@email.com", "pass2345");
//insertaUsuarios("Felipe", "Felipe@email.com", "pass4567");

//modulos
module.exports = {
    conectarDBPG,
    obtenerUsuarios,
    insertaUsuarios,
};