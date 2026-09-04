const { Sequelize, DataTypes, Model } = require('sequelize');
require("dotenv").config();
const gestor = require('./helpers/gestorArchivos');

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
});

//Prueba conexion de servidor PostreSQL
const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    gestor.registrarVisita('Conexión establecida a PostgreSQL con éxito.');
    console.log('Conexión establecida a PostgreSQL con éxito.');
  } catch (error) {
    gestor.registrarVisita('Error en la conexión a PostgreSQL: '+ error);
    console.log('No se pudo conectar a la base de datos PostgreSQL:', error);
  }
};

conectarDB();

const usuarios = sequelize.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


async function crearTabla() {
  try {
    // Crea la tabla
    await usuarios.sync(); 
    console.log('La tabla "Usuarios" fue creada correctamente.');
  } catch (error) {
    console.error('No se pudo conectar o crear la tabla:', error);
  } finally {
    await sequelize.close();
  }
}

//crearTabla();

module.exports = { sequelize, usuarios, conectarDB };
