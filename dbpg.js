const { Pool, Client } = require('pg');
require("dotenv").config();
const gestor = require('./helpers/gestorArchivos');

// Configuración del Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // número máximo de conexiones activas
  idleTimeoutMillis: 30000, // tiempo que una conexión puede estar inactiva antes de cerrarse
  connectionTimeoutMillis: 2000 // tiempo máximo para intentar conectarse
});


module.exports = pool;

/* 
// Crear la base de datos
CREATE DATABASE wallet;

// Crear la tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Perez', 'juan@mail.com', 'claveSecreta123'),
('Maria Lopez', 'maria@mail.com', 'claveSecreta456'),
('Carlos Gomez', 'carlos@mail.com', 'claveSecreta789');
*/


/* // Crear la tabla de historial
CREATE TABLE historial (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(150) NOT NULL,
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);
    */