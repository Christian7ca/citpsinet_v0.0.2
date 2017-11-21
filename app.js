'use strict'

const express = require('express')
const pug = require('pug')
const sessions = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')(sessions)
const passport = require('passport')
const config = require('./config')
const home = require('./routes/home')
const dashboard = require('./routes/dashboard')
    // const adminServicios = require('./routes/admin-servicios')
const favicon = require('serve-favicon')
const app = express()

app.use(sessions({
    secret: config.TOKEN,
    name: "sessionID",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        url: config.MOGODB_URL,
        autoReconnect: true
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'pug');
app.set("views", (__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', home)
app.use('/dashboard', dashboard)
    // app.use('/admin_servicios', adminServicios)
app.use(function(req, res, next) {
    res.render('404')
})


/* const Usuario = require('./models/usuarios')
mongoose.Promise = global.Promise
const moment = require('moment')
const usuario = new Usuario({
    numeroControl: '11429',
    primerNombre: 'christian',
    apellidoPaterno: 'martínez',
    apellidoMaterno: 'Barrera',
    sexo: 'Masculino',
    fechaNacimiento: '03/03/1994',
    nacionalidad: 'Mexicana',
    correoPrincipal: 'chris@gmail.com',
    telefonoPrincipal: '7771370506',
    direccionPostal: 'Av. Teopanzolco 17 Col. Teopanzolco',
    rol: 'WEB-MASTER',
    imagen: '/images/avatars/avatar.png',
    password: '123'
})
usuario.save()
    .then((usuario) => {
        console.log(usuario)
    })
    .catch((err) => {
        console.log(err)
    }) */

module.exports = app