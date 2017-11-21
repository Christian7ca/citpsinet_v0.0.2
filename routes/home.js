'use strict'

const express = require('express')
const auth = require('../auth/passport')
const controller = require('./../controllers/usuarios')
const home = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')
const Avisos = require('./../models/avisos')

home.get('/', (req, res) => {
    /* Avisos.find()
        .where('caducidad')
        .gte(moment().unix())
        .exec((err, avisos) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Falla al extraer de la Base de datos')
            }
            res.render('home', {
                titulo: "Inicio",
                slides: avisos
            })
        }) */
    res.render('inicio', {
        titlePage: "Inicio"
    })
})

home.get('/investigacion', (req, res) => {
    res.render('investigacion', {
        titlePage: "Investigación"
    })
})

home.get('/servicios', (req, res) => {
    res.render('servicios', {
        titlePage: "Servicios"
    })
})

home.get('/eventos', (req, res) => {
    res.render('eventos', {
        titlePage: "Eventos"
    })
})

home.get('/evento', (req, res) => {
    res.render('evento', {
        titlePage: "Información del Evento"
    })
})

home.get('/login', (req, res) => {
    res.render('login')
})

home.post('/login', controller.postLogin)

module.exports = home