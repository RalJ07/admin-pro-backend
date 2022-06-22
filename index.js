const express = require("express");
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor express

const app = express();

//configurar CORS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

//Base de datos
dbConnection();



//usuario y clave de MongoDb
// mean_user yhBMCz2yKVew7pk8

//Rutas
app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/login', require('./routes/auth') );





app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en el puerto' + 3000);
} )

