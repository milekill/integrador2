require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();
const { Model, DataTypes } = require('sequelize');
const gestor = require('../helpers/gestorArchivos.js');
const indexRouter  = require('../routes/router.js');
const db = require('../test_dbpg.js');
const pool = require('../dbpg.js');
const sequelize = require('../dbsqlz.js');
const { usuarios } = require('../dbsqlz.js');

app.use(express.json());

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
    //quitar password
    const usuariosLimpios = resultado.rows.map(usuario => {
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
    });

    res.json({
      Estado: true,
      total_resultados: usuariosLimpios.length,
      datos: usuariosLimpios
    });

    gestor.registrarVisita('/usuarios/' + queryParams + ' resultados: ' + usuariosLimpios.length);

  } catch (error) {
    console.error('Error en el servidor:', error.message);
    gestor.registrarVisita('/usuarios/'+ error.message);
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor al procesar la consulta.'
    });
  }
});


// Ruta para obtener un usuario por su ID
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'SELECT id, nombre, email FROM usuarios WHERE id = $1';
        const resultado = await pool.query(queryText, [id]);
        gestor.registrarVisita('/usuarios/get.id: ' + id + ' usuario encontrado ' + resultado.rows[0].nombre);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Usuario no encontrado' 
            });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        gestor.registrarVisita('/usuarios/get.id: ' + id + ' error: ' + error.message);
        res.status(500).json({ 
            mensaje: 'Error interno del servidor' 
        });
    }
});


// Ruta para insertar usuario
app.post("/usuarios", async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Nombre, email y password son requeridos" });
    }
    try {
        const query = "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id;";
        const values = [nombre, email, password];
        const result = await pool.query(query, values);
        gestor.registrarVisita('/usuarios/post.id: ' + result.rows[0].id + ' insertado exitosamente ' + nombre);
        res.status(201).json({ mensaje: "Usuario insertado", id: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
        gestor.registrarVisita('/usuarios/post.id: ' + id + ' error: ' + error.message);
    }
});


// Ruta Put , para actualizar email
app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "El nuevo email es requerido" });
    }
    try {
        const query = "UPDATE usuarios SET email = $1 WHERE id = $2 RETURNING *;";
        const values = [email, id];
        const result = await pool.query(query, values);
        gestor.registrarVisita('/usuarios/put.id: ' + id + ' actualizado exitosamente');
    if (result.rowCount > 0) {
        res.json({ mensaje: "Usuario actualizado exitosamente", usuario: result.rows[0] });
    } else {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
    } catch (error) {
        res.status(500).json({ error: error.message });
        gestor.registrarVisita('/usuarios/put.id: ' + id + ' error: ' + error.message);
    }
});


// ruta delete, eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existeUsuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
        if (existeUsuario.rows.length === 0) {
            return res.status(404).json({ 
                error: "Usuario no encontrado", 
                mensaje: `No se puede eliminar porque el usuario con ID ${id} no existe.` 
            });
        }
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        gestor.registrarVisita('/usuarios/delete.id: ' + id + ' eliminado exitosamente');
        res.status(200).json({
            mensaje: `Usuario con ID ${id} eliminado exitosamente`
        });

    } catch (error) {
        console.error("Error en DELETE /usuarios/delete/:id:", error);
        gestor.registrarVisita('/usuarios/delete.id: ' + id + ' error: ' + error.message);
        res.status(500).json({ 
            error: "Error interno del servidor", 
            mensaje: "No se pudo completar la eliminación del usuario debido a un error interno." 
        });
    }
});


/**
 * Simula la operación sensible
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - password del usuario
 * @param {boolean} forzarError - Si es true, forzará un fallo en la segunda acción para probar el rollback
 */

async function registrarUsuarioConHistorial(nombre, email, password, forzarError = false) {
    const client = await pool.connect();
    const datosIntento = { nombre, email, password, forzarError };
    try {
        await client.query('BEGIN');
        console.log('🔄 Transacción iniciada con éxito...');
        const queryUsuario = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id';
        const resUsuario = await client.query(queryUsuario, [nombre, email, password]);
        const usuarioId = resUsuario.rows[0].id;
        console.log(`✅ Acción 1 completada: Usuario registrado con ID ${usuarioId}`);
        if (forzarError) {
        throw new Error('Fallo simulado en la creación del historial (Evidencia de Rollback)');
        }
        const queryHistorial = 'INSERT INTO historial (usuario_id, accion) VALUES ($1, $2)';
        await client.query(queryHistorial, [usuarioId, 'Registro inicial de cuenta']);
        console.log('✅ Acción 2 completada: Historial creado con éxito.');

        await client.query('COMMIT');
        console.log('🎉 Transacción confirmada (COMMIT). Datos guardados permanentemente.\n');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Transacción abortada (ROLLBACK). Motivo: ${error.message}`);
        gestor.registrarLogFallido(error.message, datosIntento);
        console.log('📝 Error registrado exitosamente en error.txt');
    } finally {
        client.release();
    }
}

// Prueba ejecucion casos
async function ejecutarPruebas() {
  console.log('--- Caso 1: Operación Exitosa ---');
  await registrarUsuarioConHistorial('Jum Ortega', 'jum@example.com', 'clave1234', false);

  console.log('--- Caso 2: Operación con Error Forzado (Evidencia de Rollback) ---');
  await registrarUsuarioConHistorial('Ana Lopez', 'ana@example.com', 'clave1234', true);
  
  await pool.end();
}

//ejecutarPruebas();

app.get('/users', async (req, res) => {
  try {
    const connect = await sequelize.conectarDB();
    const users = await usuarios.findAll();
    res.json(users);
  } catch (error) {
    console.error(error.message); 
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

//listen
app.listen(process.env.PORT, () => {
    gestor.registrarVisita('Inicio de Servidor');
    console.log(`Pagina inicial de Servidor con HTML en: http://localhost:${process.env.PORT}`);
    //console.log(`Revisar el Status del Servidor con JSON en: http://localhost:${process.env.PORT}/status`);
    //console.log(`Datos de tu clases con tu nombre con Views EJS en: http://localhost:${process.env.PORT}/datos/nombre`);
    //console.log(`Revisar atraves de Routes: http://localhost:${process.env.PORT}/rutas`);
    console.log(`Base de datos con dbpg PostgreSQL: http://localhost:${process.env.PORT}/dbpg`);
    console.log(`Mostrar Usuarios con dbpg PostgreSQL: http://localhost:${process.env.PORT}/usuarios`);
    console.log(`Buscar Usuarios por nombre con dbpg PostgreSQL: http://localhost:${process.env.PORT}/Usuarios?nombre=Juan`);
});