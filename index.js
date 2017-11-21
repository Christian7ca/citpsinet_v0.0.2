'use strict'

const app = require('./app')
const mongoose = require('mongoose')
const config = require('./config')

mongoose.Promise = global.Promise
mongoose.connect(config.MOGODB_URL, { useMongoClient: true }).then(
    () => {
        app.listen(config._PORT, () => {
            console.log('App listening on port 3000!');
        })
    },
    err => {
        throw err
        process.exit(1)
    }
)
var connection = mongoose.connection
process.on('SIGINT', () => {
    connection.close(() => {
        console.log("Conexión a la base de datos terminada por finalización del proceso");
        process.exit(0);
    });
});