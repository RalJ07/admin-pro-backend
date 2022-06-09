const express = require("express");
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor express

const app = express();

//configurar CORS
app.use( cors() );

//Base de datos
dbConnection();



//usuario y clave de MongoDb
// mean_user yhBMCz2yKVew7pk8

//Rutas
app.get( '/', (req ,res) => {

    res.json( {
        ok: true,
        msg: 'Hola Mundo'
    } )


} );





app.listen( process.env.PORT , () => {
    console.log('Servidor corriendo en el puerto' + 3000);
} )

