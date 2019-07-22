// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/pruebaedata', (err, res) => {
    if (err) throw err;

    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online');

});

//Rutas
app.use('/user', userRoutes);
app.use('/', appRoutes);
app.use('/login', loginRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000 \x1b[32m%s\x1b[0m', 'online');
});