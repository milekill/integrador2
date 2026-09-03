# Integrador M7

## Aplicacion web para gestion de usuarios y datos.

    Desarrollada con Node, 

    **Proyecto ABP Modulo 7**

    [https://github.com/milekill/integrador.git](https://github.com/milekill/integrador.git)

    03-09-2026 Valparaíso, Chile.

    Andreas Müller S.

Versión:1.0.2.1

*   Requisitos del sistema
    -   Node.js: Versión 18.x, 20.x o superior recomendada.
    -   npm: Viene incluido con la instalación de Node.js.
        
*   Sistema operativo: 
    -   Windows, macOS o Linux.
    -   Espacio en disco: Menos de 50 MB para dependencias básicas.
        
*   Instrucciones de instalación
    -   Descarga e instala Node.js desde el sitio oficial de Node.js.
    -   Abre tu terminal o consola y verifica la instalación con ```node -v``` y ```npm -v.```
    -   Crea una carpeta nueva para tu proyecto y entra en ella: ```mkdir mi-app-express``` ```cd mi-app-express```
    -   Instala las dependencias del proyecto en tu carpeta.

*   Ejemplos de uso (Servidor básico con Express)
    -   Ejecuta la aplicación en tu terminal: ```npm run dev```
    -   Abre tu navegador web y ingresa a los siguientes enlaces:
        -   http://localhost:3000. para ver la pagina de inicio con HTML.
        -   http://localhost:3000/status para Revisar el Status del Servidor con JSON en 
        -   http://localhost:3000/datos/AgregaTuNombreAqui para ver Datos de tu clases con tu nombre con Views EJS en.
        -   http://localhost:3000/rutas para Vistar la pagina a traves del Routes.
---  
---
1. Conociendo Node y Express (Lección 1)

* Investigar el ecosistema `Node.js` y para qué se utiliza.
    - Node.js es un entorno de ejecución de código abierto para JavaScript, construido con el motor V8 de Google Chrome. Permite ejecutar código JavaScript fuera del navegador web directamente en servidores o computadoras para desarrollar aplicaciones de backend, servicios web, interfaces de comandos y herramientas de desarrollo.

    - Node.js se utiliza para:

        * Creación de servidores y APIs: Permite programar la lógica del servidor de una página o aplicación web utilizando JavaScript.
        * Aplicaciones en tiempo real: Es ideal para chats, herramientas de colaboración en vivo y plataformas de transmisión de datos (streaming) por su rapidez de respuesta.
        * Microservicios y sistemas rápidos: Maneja múltiples peticiones a la vez de forma eficiente sin bloquear el sistema.
        * Herramientas de desarrollo frontend: Sirve como base para ejecutar herramientas modernas de compilación y empaquetado de código (como Vite, Webpack o entornos de frameworks como React, Angular y Vue).

    - Características Principales:

        * Asíncrono y sin bloqueo: Procesa múltiples tareas de manera simultánea sin detener el flujo principal del programa.
        * Uso del mismo lenguaje: Permite usar JavaScript tanto en el navegador (frontend) como en el servidor (backend).
        * npm (Node Package Manager): Incluye un gran gestor de paquetes y librerías creadas por la comunidad para acelerar el desarrollo.
---
* Identificar qué aporta `Express` sobre `Node` puro.
    - Express aporta una capa de abstracción sobre Node.js puro que simplifica y acelera el desarrollo web. Mientras Node.js proporciona el entorno de ejecución básico con módulos de bajo nivel, Express añade un sistema de enrutamiento robusto, gestión avanzada de peticiones y respuestas HTTP, y un sistema modular de middleware.

    - Enrutamiento Avanzado
        - Node puro: Requiere evaluar manualmente la URL y el método con condicionales complejos (if/switch) sobre el objeto de la petición.
        - Express: Ofrece un sistema de rutas limpio y directo basado en métodos HTTP (app.get, app.post, etc.) y parámetros en la URL.
    - Gestión de Middleware
        - Node puro: Obliga a escribir código repetitivo para analizar cuerpos de peticiones (JSON, datos de formularios) o gestionar cookies y sesiones.
        -   Express: Utiliza funciones middleware que se ejecutan en cadena para procesar peticiones, validar datos, manejar errores o autenticar usuarios de forma ordenada.
    - Manejo de Peticiones y Respuestas
        - Node puro: Los objetos req y res son streams básicos de Node donde hay que escribir cabeceras y fragmentos de datos manualmente (res.writeHead, res.write).
        - Express: Extiende estos objetos con métodos útiles y expresivos como res.json() para enviar datos estructurados o res.send() para texto y HTML.
---
* Realizar un esquema visual del flujo básico servidor–cliente.
```
+---------------------+     Petición HTTP      +--------------------+
|                     |  ------------------->  |                    |
| Cliente (Navegador) |                        | Servidor (Node.js) |
|                     |  <-------------------  |                    |
+---------------------+     Respuesta HTTP     +--------------------+
```
---
* Crear una infografía personal del stack técnico del proyecto.
    - Título y Perfil
        - Nombre del proyecto: Integrador 
        - Desarrollado por: Andreas Müller Silva
        - Rol principal: Desarrollador Backend / Full Stack.
    - Backend
        - Node.js: Entorno de ejecución de JavaScript.
        - Express.js: Framework principal para crear las rutas y la API.
        - JWT: Seguridad, autenticación y encriptación de datos.
    - Bases de Datos
        - PostgreSQL: Almacenamiento principal de información.
    - DevOps y Despliegue
        - Git / GitHub: Control de versiones y trabajo en equipo.
    - Herramientas y Control
        - dotenv:
        - nodemon:
---
---
2. Instalación y configuración de Node (Lección 2)

    * Instalar `Node.js` correctamente (mínimo versión 18).<br>
    ![Node Version instalada](./doc/img/01.png) <br>
    ![Npm Version instalada](./doc/img/02.png)
    * Inicializar el proyecto con `npm init` y completar todos los campos relevantes del `package.json`.<br>
    ![Datos al inicializar el npm init](./doc/img/03.png) <br>
    ![Datos del package.json](./doc/img/04.png)

    * Crear el archivo principal `index.js` o `app.js`, con una función que imprima `"Servidor iniciado"`.<br>
    ![indes.js y app.js en carpeta](./doc/img/05.png)<br>
    ![imprimir "servidor iniciado"](./doc/img/06.png)

    * Se debe justificar brevemente en el `README` por qué se eligió `index.js` o `app.js` como nombre base del archivo principal.<br>
        - Razones para usar index.js: 
            - es el archivo por defecto: Node.js y los sistemas de paquetes buscan index.js de manera automática al abrir una carpeta.
            - Rutas limpias: Permite importar carpetas enteras sin escribir el nombre del archivo en la ruta.
            - Estándar: Sigue las normas comunes de la comunidad de JavaScript.


    * Configurar uso de variables de entorno (`dotenv`) para el puerto del servidor.<br>
    ![npm install dotenv](./doc/img/07.png)<br>
    ![creacion archivo .env con PORT](./doc/img/08.png)

---
---
3. Gestión de paquetes en Node (Lección 3)
    * Instalar y declarar las siguientes dependencias:
        - `express` (requerido)<br>
        ![npm install express](./doc/img/09.png)<br>
        - `dotenv` (recomendado)<br>
        ![npm install dotenv](./doc/img/07.png)<br>
        - `nodemon` como devDependency<br>
        ![npm install nodemon --save-dev](./doc/img/10.png)<br>

    * Crear scripts personalizados en `package.json`:
        - `npm start`
        - `npm run dev`<br>
        ![script "dev" en package.json](./doc/img/11.png)<br>
        ![npm run den funcionando](./doc/img/12.png)<br>
        

    * Agregar comentarios en el código para describir qué hace cada línea relevante.
        ```
        //Ingresar en terminal para instalacion:
        $ npm install express
        $ npm install dotenv
        $ npm instal nodemon --save-dev

        //Agregar script a package.json
        "scripts": {
            "start": "node index.js",
            "dev": "nodemon index.js"
        },
        ```
---
---
4. Sirviendo contenido web (Lección 4)
    * Crear al menos 2 rutas públicas (`/ y /status`), cada una con respuestas en `HTML` o `JSON`.
        ```
        Pagina inicial de Servidor con HTML en: http://localhost:3000
        Revisar el Status del Servidor con JSON en: http://localhost:3000/status
        Datos de tu clases con tu nombre con Views EJS en: http://localhost:3000/datos/Agrega tu nombre aqui
        ```

    * Configurar la carpeta `/public` para servir al menos 1 archivo estático.<br>
        ![carpeta public con html](./doc/img/13.png)<br>
        
    
    * Agregar `middleware express.static()` correctamente.
        ```
        app.use(express.static(path.join(__dirname, 'public')));
        ```
---
---
5. Persistencia en archivos planos (Lección 5)
    * Crear un archivo `log.txt` y una función que registre en él cada visita a una ruta específica.<br>
        ![carpeta con log.txt](./doc/img/14.png)<br>

    * Usar `fs.appendFile()` para agregar líneas de texto.
        ```
        fs.appendFile(RUTA_ARCHIVO, logLinea, 'utf8');
        ```

    * Validar que el texto registrado tenga la siguiente estructura mínima: fecha, hora, ruta accedida.
        ```
        const logLinea = `Fecha: ${fecha} | Hora: ${hora} | Ruta: ${rutaAccedida}\n`;
        ```

    * El archivo debe registrar al menos 3 accesos simulados.
        ```
        Fecha: 2026-08-14 | Hora: 17:01:41 | Ruta: Inicio de Servidor
        Fecha: 2026-08-14 | Hora: 17:01:46 | Ruta: /
        Fecha: 2026-08-14 | Hora: 17:01:48 | Ruta: /status
        Fecha: 2026-08-14 | Hora: 18:17:09 | Ruta: /datos/daniel
        Fecha: 2026-08-14 | Hora: 18:32:24 | Ruta: /rutas
        ```

    * Justificar si se elige otro tipo de evento para registrar (por ejemplo, errores o inicio del servidor).

        Se ha agregado "inicio de servidor" a los logs, cuando se inicia la aplicacion para tener la trazabilidad de cada vez que se pone en marcha.

---
---
6. Ejecución de un aplicativo Node (Lección 6)
    * Ejecutar la aplicación con `npm run dev`.
        <br>
        ![npm run dev](./doc/img/15.png)<br>

    * Validar el acceso a las rutas creadas.
        ```
        http://localhost:3000/
        ```
        ![http://localhost:3000/](./doc/img/16.png)<br>
        ```
        http://localhost:3000/status
        ```

        ![http://localhost:3000/status](./doc/img/17.png)<br>
        ```
        http://localhost:3000/datos/Daniel
        ```

        ![http://localhost:3000/datos/Daniel](./doc/img/18.png)<br>

    * Crear y completar el archivo `README.md` con:
        *   Requisitos del sistema
            -   Node.js: Versión 18.x, 20.x o superior recomendada.
            -   npm: Viene incluido con la instalación de Node.js.
        
        *   Sistema operativo: 
            -   Windows, macOS o Linux.
            -   Espacio en disco: Menos de 50 MB para dependencias básicas.
        
        *   Instrucciones de instalación
            -   Descarga e instala Node.js desde el sitio oficial de Node.js.
            -   Abre tu terminal o consola y verifica la instalación con ```node -v``` y ```npm -v.```
            -   Crea una carpeta nueva para tu proyecto y entra en ella:
                ```mkdir mi-app-express``` ```cd mi-app-express```
            -   Instala las dependencias del proyecto en tu carpeta.

        *   Ejemplos de uso (Servidor básico con Express)
            -   Ejecuta la aplicación en tu terminal:
            ```npm run dev```
            -   Abre tu navegador web y ingresa a los siguientes enlaces:
                -   http://localhost:3000. para ver la pagina de inicio con HTML.
                -   http://localhost:3000/status para Revisar el Status del Servidor con JSON en 
                -   http://localhost:3000/datos/AgregaTuNombreAqui para ver Datos de tu clases con tu nombre con Views EJS en.
                -   http://localhost:3000/rutas para Vistar la pagina a traves del router.

    * Subir el repositorio a GitHub con nombre claro y estructura organizada.<br>
        [https://github.com/milekill/integrador.git](https://github.com/milekill/integrador.git)

    * El repositorio debe incluir al menos 5 carpetas bien nombradas.
        <br>![carpetas](./doc/img/19.png)<br>


    * Crear un `router.js` externo y conectar las rutas con `app.use()`.
        <br>![router.js](./doc/img/20.png)<br>

---