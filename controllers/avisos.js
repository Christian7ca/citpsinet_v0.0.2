'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Avisos = require('./../models/avisos')
const config = require('./../config')
mongoose.Promise = global.Promise

exports.crearAviso = (req, res) => {
    var aviso = new Avisos
    aviso.id = moment().unix()
    aviso.autor = req.user._id
    aviso.imagen = '/images/avisos/' + moment().add(3, 's').unix() + '.' + req.files.imagen_aviso.mimetype.split('/')[1]
    aviso.caducidad = moment(req.body.caducidad).unix()
    aviso.save()
        .then((aviso) => {
            req.files.imagen_aviso.mv(config.PATH_PUBLIC + aviso.imagen, function(err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send({ message: 'Error a la hora crear la imagen en el sevidor' })
                }
                res.status(200).send({ message: 'Aviso creado exitosamente' })
            })
        })
        .catch((err) => {

        })
}

exports.verAvisos = (req, res) => {
    Avisos.find()
        .where('caducidad')
        .gte(moment().unix())
        .where('endPoint')
        .equals('#')
        .exec((err, avisos) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Falla al extraer de la Base de datos :' + err)
            }
            res.status(200).send(avisos)
        })
}

exports.borrarAviso = (req, res) => {
    Avisos.findOneAndRemove({ 'id': req.body.id }, function(err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ message: 'Problema al borar evento' })
        }
        res.status(200).send({ message: 'Evento eliminado' })
    })
}