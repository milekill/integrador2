const fs = require('fs/promises');
const path = require('path');

const RUTA_ARCHIVO = './logs/log.txt';

//Registra las visitas en el txt
async function registrarVisita(rutaAccedida) {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0]; 
  const hora = ahora.toTimeString().split(' ')[0];
  
  const logLinea = `Fecha: ${fecha} | Hora: ${hora} | Ruta: ${rutaAccedida}\n`;
  //const archivoLog = path.join(__dirname, 'log.txt');

  try {
    await fs.appendFile(RUTA_ARCHIVO, logLinea, 'utf8');
    console.log('Log registrado con éxito: ' + rutaAccedida);
  } catch (error) {
    console.error('Error al escribir en el archivo log:', error);
  }
}

//modulos
module.exports = {
    registrarVisita,
};