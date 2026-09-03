const { Pool, Client} = require('pg');
require("dotenv").config();
const gestor = require('./helpers/gestorArchivos');
const pool = require('./dbpg.js');


/* const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM productos');
    console.log(res.rows);
} finally {
    client.release(); // muy importante
}
// Cerrar el pool manualmente si el proceso termina
    await pool.end(); */


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



/* async function obtenerUsuarios() {
try {
const resultado = await pool.query('SELECT * FROM usuarios');
console.log('👥 Usuarios:', resultado.rows);
} catch (error) {
console.error('❌ Error en la consulta:', error.message);
}
}
obtenerUsuarios();
 */


// Verificar la conexión al iniciar el servidor
/* pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    gestor.registrarVisita('Error en la conexión a PostgreSQL con dbpg: ' + err);
    console.error('Error al conectar a la base de datos:', err.stack);
    
  } else {
    gestor.registrarVisita('Conexión establecida a PostgreSQL con éxito con dbpg. ' + res.rows[0].now);
    console.log('Conexión exitosa a PostgreSQL. Servidor de BD activo en:', res.rows[0].now);
  }
}); */


//modulos
module.exports = {
    conectarDBPG,
};