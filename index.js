require('dotenv').config();
const express = require('express');
const app = express();
const server = require('./middlewares/server.js');

//Saludo de Inicio
console.log("Servidor iniciado");