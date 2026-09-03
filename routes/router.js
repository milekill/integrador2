const express = require('express');
const router = express.Router();
const gestor = require('../helpers/gestorArchivos.js');

router.get('/rutas', (req, res) => {
    res.send('¡Hola desde el router externo!');
    gestor.registrarVisita('/rutas');
});

module.exports = router;