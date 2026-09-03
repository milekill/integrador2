require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const gestor = require('../helpers/gestorArchivos.js');
const indexRouter  = require('../routes/router.js');
const db = require('../test_dbpg.js');
const pool = require('../dbpg.js')

//Registro del middleware
app.use((req, res, next) => {
    try {
        if (req.url === '/') {
            gestor.registrarVisita('/');
        }
    } catch (error) {
        console.error('Error en el registro de la ruta:', error);
        throw error;
    }
  next();
});

//Middleware para servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../public')));


//Ruta que devuelve una respuesta en HTML
app.get('/', (req, res) => {
    res.send('<h1>Bienvenido</h1>');
    gestor.registrarVisita('/');
});

app.use('/', indexRouter);

//Ruta que devuelve una respuesta en JSON
app.get('/status', (req, res) => {
    res.json({ status: 'activo', uptime: process.uptime() });
    gestor.registrarVisita('/status');
});


//Indicar a Express con EJS
app.set('view engine', 'ejs');

//Ruta /datos para el view de EJS
app.get('/datos/:nombre', (req, res) => {
    const {nombre} = req.params
    const datos = {
        titulo: 'Mis Datos en Views',
        usuario: nombre,
        conectado: true,
        fecha: new Date().toISOString().replace('T', ' ').slice(0, 19),
        cursos: ['JavaScript', 'Node.js', 'Express', 'Nodemon', 'Dotenv','EJS']
    };
    gestor.registrarVisita('/datos/'+nombre);
    res.render('index', datos);
});

//app.use(express.json());

// Ruta del dbpg para conectar PostgreSQL con pg
app.get('/dbpg', async (req, res) => {
    try {
        const resultadoConexion = await db.conectarDBPG();
        res.send(`Servidor dbpg conectado: ${resultadoConexion}`);
        gestor.registrarVisita('/dbpg/' + resultadoConexion);
    } catch (err) {
        res.status(500).send(`Error al conectar a la base de datos con dbpg: ${err.message}`);
        gestor.registrarVisita('/dbpg/error' + err.message);
    }
});

// Ruta GET /usuarios
app.get('/usuarios', async (req, res) => {
    try {
    const { nombre, limite = 10, pagina = 1 } = req.query;
    const offset = (pagina - 1) * limite;
    let queryText = 'SELECT id, nombre, email, password FROM usuarios';
    const queryParams = [];

    if (nombre) {
      queryText += ' WHERE nombre ILIKE $1';
      queryParams.push(`%${nombre}%`);
    }

    queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limite), parseInt(offset));

    const resultado = await pool.query(queryText, queryParams);
    const usuariosLimpios = resultado.rows.map(usuario => {
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
    });

    res.json({
      Estado: true,
      //pagina: parseInt(pagina),
      //limite: parseInt(limite),
      total_resultados: usuariosLimpios.length,
      datos: usuariosLimpios
    });
    gestor.registrarVisita('/usuarios' + JSON.stringify(usuariosLimpios));

  } catch (error) {
    console.error('Error en el servidor:', error.message);
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor al procesar la consulta.'
    });
  }
});


//listen
app.listen(process.env.PORT, () => {
    gestor.registrarVisita('Inicio de Servidor');
    console.log(`Pagina inicial de Servidor con HTML en: http://localhost:${process.env.PORT}`);
    console.log(`Revisar el Status del Servidor con JSON en: http://localhost:${process.env.PORT}/status`);
    console.log(`Datos de tu clases con tu nombre con Views EJS en: http://localhost:${process.env.PORT}/datos/nombre`);
    console.log(`Revisar atraves de Routes: http://localhost:${process.env.PORT}/rutas`);
    console.log(`Base de datos con dbpg PostgreSQL: http://localhost:${process.env.PORT}/dbpg`);
    console.log(`Mostrar Usuarios con dbpg PostgreSQL: http://localhost:${process.env.PORT}/usuarios`);
    console.log(`Buscar Usuarios por nombre con dbpg PostgreSQL: http://localhost:${process.env.PORT}/Usuarios?nombre=Juan`);
});