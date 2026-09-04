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


const usuarios = sequelize.define("usuarios", {
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
        allowNull: false,
  },
}, {
        tableName: "usuarios",
        timestamps: false,
});


const Pedido = sequelize.define('Pedido', {
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'pendiente'
    }
});

usuarios.hasMany(Pedido, { foreignKey: 'usuariosId', as: 'pedidos' });
Pedido.belongsTo(usuarios, { foreignKey: 'usuariosId' });


async function crearTablaUsuarios() {
  try {
    // Crea la tabla
    await usuarios.sync(); 
    console.log('La tabla "usuarios" fue creada correctamente.');
  } catch (error) {
    console.error('No se pudo conectar o crear la tabla:', error);
  }
}

//crearTablaUsuarios();


async function crearTablaPedido() {
  try {
    // Crea la tabla
    await Pedido.sync(); 
    console.log('La tabla "Pedido" fue creada correctamente.');
  } catch (error) {
    console.error('No se pudo conectar o crear la tabla:', error);
  }
}

//crearTablaPedido();


async function crearUsuario(nombre, email, password) {
    const usuario = await usuarios.create({
        nombre: nombre,
        email: email,
        password: password,
    });
    console.log(`Usuario creado: id: ${usuario.id}, nombre: ${usuario.nombre}, email: ${usuario.email}, pass: ${usuario.password}`);
    return usuario;
}

async function crearPedido(total, estado, usuariosId) {
    const pedido = await Pedido.create({
        total: total,
        estado: estado,
        usuariosId: usuariosId
    });
    console.log(`Pedido creado: id: ${pedido.id}, total: ${pedido.total}, estado: ${pedido.estado}, usuario: ${pedido.usuariosId}`);
    return pedido;
}

async function obtenerUsuario(id) {
  try {
    const usuario = await usuarios.findByPk(id);

    if (usuario) {
      console.log(`Usuario: ${usuario.nombre}`);
    } else {
      console.log('Usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al consultar:', error);
  }
}

async function obtenerPedido(id) {
try {
    const usuarioConPedidos = await usuarios.findByPk(id, {
          include: [{
            model: Pedido,
            as: 'pedidos'
          }]
        });
    if (!usuarioConPedidos) {
        return console.log("error usuario sin pedidos");
    }
    return usuarioConPedidos;
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los datos' });
    }
}

async function obtenerPedidos() {
try {
    const usuarioConPedidos = await usuarios.findAll({
          include: [{
            model: Pedido,
            as: 'pedidos'
          }]
        });
    if (!usuarioConPedidos) {
        return console.log("error sin pedidos");
    }
    return usuarioConPedidos;
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los datos' });
    }
}

async function obtenerUsuarios() {
  try {
    const usuario = await usuarios.findAll();
    const textoJson = JSON.stringify(usuario);

    if (usuario) {
      console.log(`Usuarios: ${textoJson}`);

      return usuario;
    } else {
      console.log('Usuarios no encontrado.');
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
}

// Demo
async function runDemo(nombre, email, password) {
    console.log("Iniciando DEMO:");

    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });

        console.log("Crear Usuario 1:");
        const juan = await crearUsuario("Daniel", "juan@mail.com", "clave123");
        await crearUsuario("Tomas", "tom@mail.com", "clave123");
        await crearUsuario("Javier", "jav@mail.com", "clave123");
        console.log("Crear Pedidos:");
        await crearPedido("3", "pendiente", "1");
        await crearPedido("10", "pendiente", "1");
        await crearPedido("5", "pendiente", "2");
        await crearPedido("1", "pendiente", "3");
        await crearPedido("50", "pendiente", "1");

        console.log("Ingresar usuario por router:");
        await crearUsuario(nombre, email, password);
        await crearPedido("4", "pendiente", "4");

        console.log("Obtener Usuario 1:");
        await obtenerUsuario(juan.id);

        console.log("Obtener todos los Usuarios:");
        await obtenerUsuarios();

        console.log("Obtener Usuarios y Pedidos:");
        const pedidos = await obtenerPedidos();
        const datos = await Object.values(pedidos);
        const textoJson2 = JSON.stringify(datos);
        console.log(textoJson2);


        return pedidos;

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    //await sequelize.close();
    //console.log("Conexion Cerrada"); 
  }   
}

//runDemo("jorge", "jor@email.com", "pass2345");

module.exports = { sequelize, usuarios, conectarDB, runDemo, obtenerUsuarios, crearPedido, obtenerPedido, };